import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prescriptionId, medicationName, effectiveness, symptoms, sideEffects, notes, date } = body

    // Validate required fields
    if (!prescriptionId || !medicationName || !effectiveness || !date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Store symptoms/sideEffects as JSON strings
    const feedback = await prisma.medicationFeedback.create({
      data: {
        prescriptionId,
        medicationName,
        effectiveness,
        symptoms: JSON.stringify(symptoms || []),
        sideEffects: JSON.stringify(sideEffects || []),
        notes: notes || '',
        date,
        createdAt: new Date()
      }
    })

    return NextResponse.json(feedback, { status: 201 })
  } catch (error) {
    console.error('Error creating feedback:', error)
    return NextResponse.json(
      { error: 'Failed to create feedback' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const prescriptionId = searchParams.get('prescriptionId')

    // If prescriptionId is provided, fetch feedback for that prescription
    if (prescriptionId) {
      const feedback = await prisma.medicationFeedback.findMany({
        where: { prescriptionId },
        orderBy: { createdAt: 'desc' }
      })
      return NextResponse.json(feedback)
    }

    // Otherwise, fetch all feedback for the current patient
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const decoded = verifyToken(token)
    if (!decoded?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    // Get all prescriptions for this patient
    const prescriptions = await prisma.prescription.findMany({
      where: { patientId: decoded.userId },
      select: { id: true, medicationName: true }
    })
    const prescriptionIds = prescriptions.map(p => p.id)
    // Get all feedback for these prescriptions
    const feedback = await prisma.medicationFeedback.findMany({
      where: { prescriptionId: { in: prescriptionIds } },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(feedback)
  } catch (error) {
    console.error('Error fetching feedback:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    )
  }
} 
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    if (decoded.userType !== 'PATIENT') {
      return NextResponse.json(
        { error: 'Only patients can upload prescriptions' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const medicationName = formData.get('medicationName') as string
    const dosage = formData.get('dosage') as string
    const frequency = formData.get('frequency') as string
    const duration = formData.get('duration') as string
    const instructions = formData.get('instructions') as string

    // Validate required fields
    if (!file || !medicationName || !dosage || !frequency || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    // Convert file to base64 for storage (in production, use cloud storage)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`

    // Create prescription
    const prescription = await prisma.prescription.create({
      data: {
        patientId: decoded.userId,
        medicationName,
        dosage,
        frequency,
        duration,
        instructions,
        imageUrl: base64Image,
        isActive: true
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            patientId: true
          }
        }
      }
    })

    return NextResponse.json(
      { 
        message: 'Prescription uploaded successfully',
        prescription
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Upload prescription error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
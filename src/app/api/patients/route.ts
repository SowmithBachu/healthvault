import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
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

    if (decoded.userType !== 'HOSPITAL') {
      return NextResponse.json(
        { error: 'Only hospitals can access patient data' },
        { status: 403 }
      )
    }

    // Get all patients assigned to this hospital
    const patients = await prisma.hospitalPatient.findMany({
      where: {
        hospitalId: decoded.userId,
        isActive: true
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            patientId: true,
            dateOfBirth: true,
            phoneNumber: true,
            address: true,
            emergencyContact: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        assignedDate: 'desc'
      }
    })

    return NextResponse.json({ 
      patients: patients.map(p => ({
        ...p.patient,
        assignedDate: p.assignedDate
      }))
    })
  } catch (error) {
    console.error('Get patients error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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

    if (decoded.userType !== 'HOSPITAL') {
      return NextResponse.json(
        { error: 'Only hospitals can assign patients' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { patientId } = body

    if (!patientId) {
      return NextResponse.json(
        { error: 'Patient ID is required' },
        { status: 400 }
      )
    }

    // Check if patient exists
    const patient = await prisma.user.findFirst({
      where: {
        id: patientId,
        userType: 'PATIENT'
      }
    })

    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      )
    }

    // Check if already assigned
    const existingAssignment = await prisma.hospitalPatient.findFirst({
      where: {
        hospitalId: decoded.userId,
        patientId: patientId
      }
    })

    if (existingAssignment) {
      if (existingAssignment.isActive) {
        return NextResponse.json(
          { error: 'Patient already assigned to this hospital' },
          { status: 400 }
        )
      } else {
        // Reactivate assignment
        await prisma.hospitalPatient.update({
          where: { id: existingAssignment.id },
          data: { isActive: true }
        })
      }
    } else {
      // Create new assignment
      await prisma.hospitalPatient.create({
        data: {
          hospitalId: decoded.userId,
          patientId: patientId
        }
      })
    }

    return NextResponse.json(
      { message: 'Patient assigned successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Assign patient error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
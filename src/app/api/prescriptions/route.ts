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

    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get('patientId')

    let prescriptions

    if (decoded.userType === 'PATIENT') {
      // Patients can only see their own prescriptions
      prescriptions = await prisma.prescription.findMany({
        where: { patientId: decoded.userId },
        include: {
          hospital: {
            select: {
              id: true,
              name: true,
              hospitalName: true
            }
          }
        },
        orderBy: { prescribedDate: 'desc' }
      })
    } else if (decoded.userType === 'HOSPITAL') {
      // Hospitals can see prescriptions for their patients
      if (patientId) {
        // Check if patient is assigned to this hospital
        const assignment = await prisma.hospitalPatient.findFirst({
          where: {
            hospitalId: decoded.userId,
            patientId: patientId,
            isActive: true
          }
        })

        if (!assignment) {
          return NextResponse.json(
            { error: 'Patient not assigned to this hospital' },
            { status: 403 }
          )
        }

        prescriptions = await prisma.prescription.findMany({
          where: { patientId },
          include: {
            patient: {
              select: {
                id: true,
                name: true,
                patientId: true
              }
            }
          },
          orderBy: { prescribedDate: 'desc' }
        })
      } else {
        // Get all prescriptions for patients assigned to this hospital
        const patientIds = await prisma.hospitalPatient.findMany({
          where: {
            hospitalId: decoded.userId,
            isActive: true
          },
          select: { patientId: true }
        })

        prescriptions = await prisma.prescription.findMany({
          where: {
            patientId: {
              in: patientIds.map(p => p.patientId)
            }
          },
          include: {
            patient: {
              select: {
                id: true,
                name: true,
                patientId: true
              }
            }
          },
          orderBy: { prescribedDate: 'desc' }
        })
      }
    }

    return NextResponse.json({ prescriptions })
  } catch (error) {
    console.error('Get prescriptions error:', error)
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
        { error: 'Only hospitals can create prescriptions' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      patientId,
      medicationName,
      dosage,
      frequency,
      duration,
      instructions,
      imageUrl,
      expiryDate
    } = body

    // Validate required fields
    if (!patientId || !medicationName || !dosage || !frequency || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if patient is assigned to this hospital
    const assignment = await prisma.hospitalPatient.findFirst({
      where: {
        hospitalId: decoded.userId,
        patientId: patientId,
        isActive: true
      }
    })

    if (!assignment) {
      return NextResponse.json(
        { error: 'Patient not assigned to this hospital' },
        { status: 403 }
      )
    }

    // Create prescription
    const prescription = await prisma.prescription.create({
      data: {
        patientId,
        hospitalId: decoded.userId,
        medicationName,
        dosage,
        frequency,
        duration,
        instructions,
        imageUrl,
        expiryDate: expiryDate ? new Date(expiryDate) : null
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
        message: 'Prescription created successfully',
        prescription
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create prescription error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
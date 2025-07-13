import { NextRequest, NextResponse } from 'next/server'
import { createUser, getUserByEmail } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, userType, patientId, hospitalName, hospitalCode } = body

    // Validate required fields
    if (!email || !password || !userType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate user type
    if (!['PATIENT', 'HOSPITAL'].includes(userType)) {
      return NextResponse.json(
        { error: 'Invalid user type' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Validate patient-specific fields
    if (userType === 'PATIENT') {
      if (!name || !patientId) {
        return NextResponse.json(
          { error: 'Name and Patient ID are required for patients' },
          { status: 400 }
        )
      }
    }

    // For hospitals, do not require name, hospitalName, or hospitalCode

    // Create user
    const user = await createUser({
      email,
      password,
      userType,
      ...(userType === 'PATIENT' ? { name, patientId } : {})
      // Do not include hospitalName or hospitalCode for hospitals
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: userWithoutPassword
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
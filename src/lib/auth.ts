import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './db'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: string, userType: string): string {
  return jwt.sign(
    { userId, userType },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!)
  } catch (error) {
    return null
  }
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      prescriptions: true,
      hospitalPatients: {
        include: {
          patient: true
        }
      }
    }
  })
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email }
  })
}

export async function createUser(userData: {
  email: string
  password: string
  name: string
  userType: 'PATIENT' | 'HOSPITAL'
  patientId?: string
  hospitalName?: string
  hospitalCode?: string
}) {
  const hashedPassword = await hashPassword(userData.password)
  
  return prisma.user.create({
    data: {
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      userType: userData.userType,
      patientId: userData.patientId,
      hospitalName: userData.hospitalName,
      hospitalCode: userData.hospitalCode
    }
  })
} 
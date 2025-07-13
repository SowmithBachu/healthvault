'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  FileText,
  Plus,
  Activity,
  Building,
  UserPlus,
  Pill
} from 'lucide-react'

interface Patient {
  id: string
  name: string
  email: string
  patientId: string
  dateOfBirth?: string
  phoneNumber?: string
  address?: string
  emergencyContact?: string
  assignedDate: string
}

interface Prescription {
  id: string
  medicationName: string
  dosage: string
  frequency: string
  duration: string
  instructions?: string
  imageUrl?: string
  prescribedDate: string
  expiryDate?: string
  isActive: boolean
  patient: {
    id: string
    name: string
    patientId: string
  }
}

export default function HospitalDashboard() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalPrescriptions: 0,
    activePrescriptions: 0,
    recentPrescriptions: 0
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      
      // Fetch patients
      const patientsResponse = await fetch('/api/patients', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (patientsResponse.ok) {
        const patientsData = await patientsResponse.json()
        setPatients(patientsData.patients)
      }

      // Fetch prescriptions
      const prescriptionsResponse = await fetch('/api/prescriptions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (prescriptionsResponse.ok) {
        const prescriptionsData = await prescriptionsResponse.json()
        setPrescriptions(prescriptionsData.prescriptions)
        
        // Calculate stats
        const now = new Date()
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        
        const active = prescriptionsData.prescriptions.filter((p: Prescription) => p.isActive).length
        const recent = prescriptionsData.prescriptions.filter((p: Prescription) => 
          new Date(p.prescribedDate) >= thirtyDaysAgo
        ).length

        setStats({
          totalPatients: patients.length,
          totalPrescriptions: prescriptionsData.prescriptions.length,
          activePrescriptions: active,
          recentPrescriptions: recent
        })
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 transition-colors duration-300 dark:bg-gray-950 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Hospital Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your patients and prescriptions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[{
          label: 'Total Patients',
          value: stats.totalPatients,
          icon: <Users className="h-8 w-8 text-blue-500" />, sub: 'All time'
        }, {
          label: 'Total Prescriptions',
          value: stats.totalPrescriptions,
          icon: <FileText className="h-8 w-8 text-green-500" />, sub: 'All time'
        }, {
          label: 'Active Prescriptions',
          value: stats.activePrescriptions,
          icon: <Pill className="h-8 w-8 text-purple-500" />, sub: 'Currently active'
        }, {
          label: 'Recent (30 days)',
          value: stats.recentPrescriptions,
          icon: <Activity className="h-8 w-8 text-orange-400" />, sub: 'Recent activity'
        }].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6 text-gray-900 dark:text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.label}</p>
                <p className="text-3xl font-bold">{card.value}</p>
              </div>
              <div className="p-3 rounded-lg">{card.icon}</div>
            </div>
            <div className="mt-4 flex items-center text-gray-400 dark:text-gray-500">
              <span className="text-sm">{card.sub}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Patients */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Patients</h2>
            <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
              View All
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {patients.length === 0 && (
            <div className="px-6 py-12 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No patients</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Get started by assigning patients to your hospital.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Prescriptions */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Prescriptions</h2>
            <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
              View All
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {prescriptions.length === 0 && (
            <div className="px-6 py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No prescriptions</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Start by creating prescriptions for your patients.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center px-6 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <UserPlus className="h-6 w-6 mr-3" />
            <span className="font-medium">Assign Patient</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center px-6 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="h-6 w-6 mr-3" />
            <span className="font-medium">Create Prescription</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center px-6 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Building className="h-6 w-6 mr-3" />
            <span className="font-medium">View Reports</span>
          </motion.button>
        </div>
      </div>
    </div>
  )
} 
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Heart,
  Stethoscope,
  Database,
  Lock
} from 'lucide-react'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'patient' | 'hospital'>('patient')

  const features = [
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your medical data is encrypted and protected with industry-standard security measures.'
    },
    {
      icon: Users,
      title: 'Connected Care',
      description: 'Seamless communication between patients and healthcare providers for better care coordination.'
    },
    {
      icon: FileText,
      title: 'Digital Prescriptions',
      description: 'Upload and manage prescriptions digitally with image support and detailed medication tracking.'
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Instant synchronization between patient and hospital dashboards for up-to-date information.'
    },
    {
      icon: CheckCircle,
      title: 'Easy Management',
      description: 'Simple and intuitive interface for managing prescriptions and patient records.'
    },
    {
      icon: Database,
      title: 'Comprehensive Records',
      description: 'Complete medical history tracking with detailed prescription information and timestamps.'
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">HealthVault</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold mb-6 text-white dark:text-white"
            >
              Secure Medical Prescription
              <span className="block text-blue-200 dark:text-blue-400">Management</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-blue-100 dark:text-zinc-200 mb-8 max-w-3xl mx-auto"
            >
              Connect patients and hospitals through a unified platform for seamless prescription tracking and healthcare management.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link 
                href="/auth/register?type=patient"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 dark:bg-zinc-900 dark:text-blue-400 dark:hover:bg-zinc-800 transition-colors inline-flex items-center justify-center"
              >
                <Stethoscope className="mr-2 h-5 w-5" />
                Patient Registration
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/auth/hospital-access"
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 dark:border-zinc-700 dark:hover:bg-zinc-900 dark:hover:text-blue-400 transition-colors inline-flex items-center justify-center"
              >
                <Database className="mr-2 h-5 w-5" />
                Hospital Registration
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-zinc-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose HealthVault?
            </h2>
            <p className="text-xl text-gray-600 dark:text-zinc-300 max-w-2xl mx-auto">
              Our platform provides comprehensive solutions for modern healthcare management with security and ease of use.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-zinc-900 p-6 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-zinc-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-zinc-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-zinc-300 max-w-2xl mx-auto">
              Simple steps to get started with HealthVault
            </p>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setActiveTab('patient')}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  activeTab === 'patient'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                For Patients
              </button>
              <button
                onClick={() => setActiveTab('hospital')}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  activeTab === 'hospital'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                For Hospitals
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {activeTab === 'patient' ? (
              <>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-center"
                >
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Register</h3>
                  <p className="text-gray-600">Create your account with a unique patient ID</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Prescriptions</h3>
                  <p className="text-gray-600">Upload prescription images and manage your medications</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-center"
                >
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Track & Manage</h3>
                  <p className="text-gray-600">View your complete prescription history and track medications</p>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-center"
                >
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Register Hospital</h3>
                  <p className="text-gray-600">Register your hospital with license and contact information</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Assign Patients</h3>
                  <p className="text-gray-600">Connect with patients and manage their medical records</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-center"
                >
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Manage Records</h3>
                  <p className="text-gray-600">Create and manage prescriptions for your patients</p>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

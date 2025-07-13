'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, 
  Calendar, 
  Clock, 
  AlertTriangle,
  Plus,
  Eye,
  Download,
  Pill,
  Activity,
  X,
  Search,
  Filter,
  Bell,
  Settings,
  Moon,
  Sun,
  TrendingUp,
  Users,
  Shield,
  Sparkles,
  Heart,
  Target,
  Zap,
  BarChart3,
  PieChart,
  Smartphone,
  Clock3,
  CheckCircle,
  AlertCircle,
  Info,
  Star,
  Award,
  Target as TargetIcon,
  CalendarDays,
  Timer,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Brain,
  Bone,
  Eye as EyeIcon,
  Ear,
  Droplet,
  Video,
  MessageSquare
} from 'lucide-react'
import UploadPrescriptionModal from '@/components/UploadPrescriptionModal'
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

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
  hospital?: {
    name: string
    hospitalName?: string
  }
}

interface HealthMetric {
  date: string
  value: number
  type: 'bloodPressure' | 'heartRate' | 'weight' | 'glucose'
}

interface MedicationReminder {
  id: string
  medicationName: string
  time: string
  taken: boolean
  date: string
}

export default function PatientDashboard() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loading, setLoading] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [showNotifications, setShowNotifications] = useState(false)
  const [adherenceRate, setAdherenceRate] = useState(87)
  const [healthScore, setHealthScore] = useState(92)
  const [nextMedication, setNextMedication] = useState<MedicationReminder | null>(null)
  const [showHealthInsights, setShowHealthInsights] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'reminders' | 'body'>('overview')
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null)
  const [bodyPartInfo, setBodyPartInfo] = useState<any>(null)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [selectedMedicationForFeedback, setSelectedMedicationForFeedback] = useState<Prescription | null>(null)
  const [feedbackData, setFeedbackData] = useState({
    effectiveness: '',
    symptoms: [] as string[],
    sideEffects: [] as string[],
    notes: '',
    date: new Date().toISOString().split('T')[0]
  })
  
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expiring: 0,
    expired: 0
  })

  // Mock health data for analytics
  const [healthMetrics] = useState<HealthMetric[]>([
    { date: '2024-01-01', value: 120, type: 'bloodPressure' },
    { date: '2024-01-02', value: 118, type: 'bloodPressure' },
    { date: '2024-01-03', value: 122, type: 'bloodPressure' },
    { date: '2024-01-04', value: 119, type: 'bloodPressure' },
    { date: '2024-01-05', value: 121, type: 'bloodPressure' },
  ])

  const [reminders] = useState<MedicationReminder[]>([
    { id: '1', medicationName: 'Aspirin', time: '08:00', taken: true, date: '2024-01-15' },
    { id: '2', medicationName: 'Vitamin D', time: '12:00', taken: false, date: '2024-01-15' },
    { id: '3', medicationName: 'Omega-3', time: '18:00', taken: false, date: '2024-01-15' },
  ])

  // Mock real-time health metrics data
  const [liveMetrics, setLiveMetrics] = useState([
    { time: '09:00', heartRate: 72, bpSystolic: 120, bpDiastolic: 80, spo2: 98 },
    { time: '09:05', heartRate: 74, bpSystolic: 121, bpDiastolic: 81, spo2: 98 },
    { time: '09:10', heartRate: 73, bpSystolic: 119, bpDiastolic: 79, spo2: 99 },
    { time: '09:15', heartRate: 75, bpSystolic: 122, bpDiastolic: 82, spo2: 97 },
    { time: '09:20', heartRate: 76, bpSystolic: 123, bpDiastolic: 83, spo2: 98 },
    { time: '09:25', heartRate: 74, bpSystolic: 121, bpDiastolic: 80, spo2: 99 },
  ])

  // Mock upcoming appointments
  const [appointments] = useState([
    { id: 1, doctor: 'Dr. Smith', date: '2024-06-20', time: '10:30 AM', type: 'General Checkup' },
    { id: 2, doctor: 'Dr. Lee', date: '2024-06-25', time: '02:00 PM', type: 'Cardiology' },
    { id: 3, doctor: 'Dr. Patel', date: '2024-07-01', time: '09:00 AM', type: 'Dermatology' },
  ])

  // Symptom Checker state
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const symptomsList = [
    'Fever', 'Cough', 'Headache', 'Fatigue', 'Shortness of Breath', 'Chest Pain', 'Nausea', 'Dizziness', 'Sore Throat', 'Muscle Pain'
  ]
  const getSymptomFeedback = () => {
    if (selectedSymptoms.length === 0) return 'Select symptoms to get instant feedback.'
    if (selectedSymptoms.includes('Chest Pain') && selectedSymptoms.includes('Shortness of Breath')) return 'Seek immediate medical attention!'
    if (selectedSymptoms.includes('Fever') && selectedSymptoms.includes('Cough')) return 'Possible flu or infection. Monitor and consult a doctor if symptoms persist.'
    if (selectedSymptoms.includes('Headache') && selectedSymptoms.includes('Dizziness')) return 'Stay hydrated and rest. If persistent, consult a doctor.'
    return 'Monitor your symptoms. If you feel unwell, consult a healthcare provider.'
  }

  // Wellness Goals state (mock data)
  const [wellnessGoals, setWellnessGoals] = useState({
    steps: 6500,
    stepsGoal: 10000,
    water: 6,
    waterGoal: 8,
    sleep: 6.5,
    sleepGoal: 8
  })

  // Mock health news feed
  const [newsFeed] = useState([
    { id: 1, title: '5 Tips for a Healthy Heart', summary: 'Learn how to keep your heart healthy with these simple lifestyle changes.', icon: <Heart className='h-6 w-6 text-red-500' /> },
    { id: 2, title: 'The Importance of Staying Hydrated', summary: 'Discover why drinking enough water is crucial for your well-being.', icon: <Droplet className='h-6 w-6 text-blue-400' /> },
    { id: 3, title: 'How to Improve Your Sleep Quality', summary: 'Better sleep means better health. Try these expert-backed tips.', icon: <Moon className='h-6 w-6 text-indigo-500' /> },
    { id: 4, title: 'Managing Stress in Daily Life', summary: 'Practical advice for reducing stress and boosting mental health.', icon: <Brain className='h-6 w-6 text-fuchsia-500' /> },
  ])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => {
        const now = new Date()
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        const newMetric = {
          time,
          heartRate: 70 + Math.floor(Math.random() * 10),
          bpSystolic: 118 + Math.floor(Math.random() * 7),
          bpDiastolic: 78 + Math.floor(Math.random() * 7),
          spo2: 97 + Math.floor(Math.random() * 3)
        }
        return [...prev.slice(-5), newMetric]
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Body parts data with health information
  const bodyPartsData = {
    head: {
      name: 'Head & Brain',
      icon: <Brain className="h-6 w-6" />,
      health: 'Good',
      prescriptions: prescriptions.filter(p => p.medicationName.toLowerCase().includes('aspirin') || p.medicationName.toLowerCase().includes('pain')),
      symptoms: ['Headaches', 'Dizziness'],
      recommendations: ['Stay hydrated', 'Get adequate sleep']
    },
    chest: {
      name: 'Chest & Heart',
      icon: <Heart className="h-6 w-6" />,
      health: 'Excellent',
      prescriptions: prescriptions.filter(p => p.medicationName.toLowerCase().includes('heart') || p.medicationName.toLowerCase().includes('blood')),
      symptoms: [],
      recommendations: ['Regular exercise', 'Heart-healthy diet']
    },
    stomach: {
      name: 'Stomach & Digestive',
      icon: <Activity className="h-6 w-6" />,
      health: 'Good',
      prescriptions: prescriptions.filter(p => p.medicationName.toLowerCase().includes('acid') || p.medicationName.toLowerCase().includes('stomach')),
      symptoms: ['Occasional indigestion'],
      recommendations: ['Eat slowly', 'Avoid spicy foods']
    },
    arms: {
      name: 'Arms & Joints',
      icon: <Bone className="h-6 w-6" />,
      health: 'Good',
      prescriptions: prescriptions.filter(p => p.medicationName.toLowerCase().includes('joint') || p.medicationName.toLowerCase().includes('pain')),
      symptoms: ['Mild stiffness'],
      recommendations: ['Regular stretching', 'Joint exercises']
    },
    legs: {
      name: 'Legs & Mobility',
      icon: <Bone className="h-6 w-6" />,
      health: 'Excellent',
      prescriptions: prescriptions.filter(p => p.medicationName.toLowerCase().includes('leg') || p.medicationName.toLowerCase().includes('mobility')),
      symptoms: [],
      recommendations: ['Walking exercise', 'Strength training']
    }
  }

  useEffect(() => {
    fetchPrescriptions()
  }, [])

  useEffect(() => {
    // Update next medication reminder
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    
    const nextReminder = reminders.find(reminder => {
      const [hour, minute] = reminder.time.split(':').map(Number)
      return (hour > currentHour) || (hour === currentHour && minute > currentMinute)
    })
    
    setNextMedication(nextReminder || reminders[0])
  }, [reminders])

  const fetchPrescriptions = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/prescriptions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPrescriptions(data.prescriptions)
        
        // Calculate stats
        const active = data.prescriptions.filter((p: Prescription) => p.isActive).length

        setStats({
          total: data.prescriptions.length,
          active,
          expiring: 0,
          expired: 0
        })
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error)
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

  const getDaysUntilExpiry = (expiryDate: string) => {
    const now = new Date()
    const expiry = new Date(expiryDate)
    return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  }

  const handleUploadSuccess = () => {
    fetchPrescriptions()
  }

  const handleViewImage = (imageUrl: string) => {
    setSelectedImage(imageUrl)
  }

  const handleDownloadImage = (imageUrl: string, medicationName: string) => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `${medicationName}_prescription.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    if (!isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.dosage.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && prescription.isActive) ||
                         (filterStatus === 'inactive' && !prescription.isActive)
    return matchesSearch && matchesFilter
  })

  const getHealthInsights = () => {
    const insights = []
    if (adherenceRate > 90) insights.push({ type: 'success', message: 'Excellent medication adherence! Keep it up!' })
    if (healthScore > 90) insights.push({ type: 'success', message: 'Your health score is outstanding!' })
    if (prescriptions.length > 5) insights.push({ type: 'info', message: 'Consider organizing medications by time of day' })
    return insights
  }

  const handleBodyPartClick = (part: string) => {
    setSelectedBodyPart(part)
    setBodyPartInfo(bodyPartsData[part as keyof typeof bodyPartsData])
  }

  const getHealthColor = (health: string) => {
    switch (health.toLowerCase()) {
      case 'excellent': return 'text-green-500'
      case 'good': return 'text-blue-500'
      case 'fair': return 'text-yellow-500'
      case 'poor': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const [aiInsights, setAiInsights] = useState([
    'Keep your blood pressure in check with regular exercise.',
    'Remember to take your medication on time for best results.',
    'Stay hydrated and maintain a balanced diet.',
    'Monitor your heart rate during physical activity.',
    'Schedule regular checkups with your healthcare provider.'
  ])
  const [currentInsight, setCurrentInsight] = useState(0)

  const generateNewInsight = () => {
    setCurrentInsight((prev) => (prev + 1) % aiInsights.length)
  }

  const openFeedbackModal = (medication: Prescription) => {
    setSelectedMedicationForFeedback(medication)
    setFeedbackData({
      effectiveness: '',
      symptoms: [],
      sideEffects: [],
      notes: '',
      date: new Date().toISOString().split('T')[0]
    })
    setShowFeedbackModal(true)
  }

  const handleFeedbackSubmit = () => {
    // Here you would typically send the feedback to your backend
    console.log('Feedback submitted:', {
      medication: selectedMedicationForFeedback?.medicationName,
      feedback: feedbackData
    })
    
    // Show success message
    alert('Feedback submitted successfully! Your doctor will be notified.')
    setShowFeedbackModal(false)
    setSelectedMedicationForFeedback(null)
  }

  const toggleSymptom = (symptom: string, type: 'symptoms' | 'sideEffects') => {
    setFeedbackData(prev => ({
      ...prev,
      [type]: prev[type].includes(symptom) 
        ? prev[type].filter(s => s !== symptom)
        : [...prev[type], symptom]
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96 dark:bg-gray-900">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-b-2 border-blue-600"
        />
      </div>
    )
  }

  return (
    <div className={`space-y-6 transition-colors duration-300 ${isDarkMode ? 'dark' : ''} bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 min-h-screen`}>
      {/* Enhanced Header with Real-time Clock */}
      <div className="flex items-center justify-between bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-800/20">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Patient Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your medical prescriptions and track your health</p>
        </div>
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className="p-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all shadow-md"
          >
            {isDarkMode ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-gray-600" />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all shadow-md relative"
          >
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            {stats.total > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
              >
                {stats.total}
              </motion.span>
            )}
          </motion.button>
        </div>
      </div>

      {/* Move Recent Prescriptions and Quick Actions to the top */}
      <div className="flex flex-col gap-6">
      {/* Enhanced Recent Prescriptions */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950 rounded-2xl shadow-xl border border-white/20 dark:border-gray-800/20 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500 to-indigo-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Recent Prescriptions</h2>
                <p className="text-blue-100">Your current medication records</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-blue-100 bg-white/20 px-3 py-1 rounded-full">
                {filteredPrescriptions.length} of {prescriptions.length}
              </span>
              <button className="text-white hover:text-blue-100 text-sm font-medium bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-all">
                View All
              </button>
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredPrescriptions.slice(0, 5).map((prescription, index) => (
            <motion.div
              key={prescription.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="px-8 py-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {prescription.medicationName}
                    </h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      prescription.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {prescription.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {
                    (prescription.dosage !== 'N/A' && prescription.dosage) ||
                    (prescription.frequency !== 'N/A' && prescription.frequency) ||
                    (prescription.duration !== 'N/A' && prescription.duration)
                      ? (
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          {prescription.dosage && prescription.dosage !== 'N/A' && (
                            <span className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold">
                              <Pill className="h-4 w-4 mr-1 text-blue-400" /> {prescription.dosage}
                            </span>
                          )}
                          {prescription.frequency && prescription.frequency !== 'N/A' && (
                            <span className="inline-flex items-center px-3 py-1 rounded-lg bg-green-50 text-green-700 text-sm font-semibold">
                              <Clock className="h-4 w-4 mr-1 text-green-400" /> {prescription.frequency}
                            </span>
                          )}
                          {prescription.duration && prescription.duration !== 'N/A' && (
                            <span className="inline-flex items-center px-3 py-1 rounded-lg bg-purple-50 text-purple-700 text-sm font-semibold">
                              <Calendar className="h-4 w-4 mr-1 text-purple-400" /> {prescription.duration}
                            </span>
                          )}
                          {prescription.instructions && prescription.instructions.trim() !== '' && (
                            <span className="inline-flex items-center px-3 py-1 rounded-lg bg-yellow-50 text-yellow-700 text-sm font-semibold cursor-pointer group relative">
                              <FileText className="h-4 w-4 mr-1 text-yellow-400" />
                              Instructions
                              <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-white border border-gray-200 rounded shadow-lg text-xs text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                {prescription.instructions}
                              </span>
                            </span>
                          )}
                        </div>
                      ) : null
                  }
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Prescribed: {formatDate(prescription.prescribedDate)}
                    {prescription.hospital && (
                      <span> • {prescription.hospital.hospitalName || prescription.hospital.name}</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {prescription.imageUrl && (
                    <>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleViewImage(prescription.imageUrl!)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title="View Image"
                      >
                        <Eye className="h-5 w-5" />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDownloadImage(prescription.imageUrl!, prescription.medicationName)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title="Download Image"
                      >
                        <Download className="h-5 w-5" />
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {filteredPrescriptions.length === 0 && (
            <div className="px-8 py-12 text-center">
              <FileText className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No prescriptions found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by having your hospital add prescriptions to your account.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
      
            {/* Enhanced Quick Actions */}
      <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-950 dark:to-emerald-950 rounded-2xl shadow-xl border border-white/20 dark:border-gray-800/20 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-emerald-500 to-teal-600">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
              <p className="text-emerald-100">Essential tools for your health management</p>
            </div>
          </div>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.button 
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowUploadModal(true)}
              className="group relative overflow-hidden flex items-center justify-center px-8 py-8 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-indigo-600 hover:to-blue-700 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-blue-400/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <div className="relative flex items-center gap-6">
                <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                  <Plus className="h-10 w-10" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold mb-1">Upload Prescription</div>
                  <div className="text-blue-100">Add new medication records to your profile</div>
                </div>
              </div>
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.print()}
              className="group relative overflow-hidden flex items-center justify-center px-8 py-8 bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 hover:from-emerald-600 hover:via-teal-600 hover:to-green-700 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-emerald-400/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <div className="relative flex items-center gap-6">
                <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                  <FileText className="h-10 w-10" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold mb-1">Print Summary</div>
                  <div className="text-emerald-100">Generate comprehensive medical report</div>
                </div>
              </div>
            </motion.button>
          </div>
        </div>
      </div>
                </div>

      {/* Upload Prescription Modal */}
      <UploadPrescriptionModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUploadSuccess}
      />

      {/* Feedback Modal */}
      {showFeedbackModal && selectedMedicationForFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500 rounded-full">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Medication Feedback</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedMedicationForFeedback.medicationName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-6">
                {/* Effectiveness Rating */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    How effective was this medication?
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Very Effective', 'Somewhat Effective', 'Not Effective'].map((option) => (
                      <button
                        key={option}
                        onClick={() => setFeedbackData(prev => ({ ...prev, effectiveness: option }))}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          feedbackData.effectiveness === option
                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
                            : 'border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-600'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>



                {/* Side Effects */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Did you experience any side effects? (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Nausea', 'Dizziness', 'Headache', 'Drowsiness', 'Dry Mouth', 'Upset Stomach', 'Rash', 'None'].map((effect) => (
                      <label key={effect} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={feedbackData.sideEffects.includes(effect)}
                          onChange={() => toggleSymptom(effect, 'sideEffects')}
                          className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{effect}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={feedbackData.notes}
                    onChange={(e) => setFeedbackData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Share any additional observations or concerns..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                    rows={3}
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Date of Feedback
                  </label>
                  <input
                    type="date"
                    value={feedbackData.date}
                    onChange={(e) => setFeedbackData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFeedbackSubmit}
                disabled={!feedbackData.effectiveness}
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Feedback
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Enhanced Image Viewer Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Prescription Image</h2>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4">
              <img 
                src={selectedImage} 
                alt="Prescription" 
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg shadow-lg"
              />
            </div>
          </motion.div>
        </div>
      )}

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Welcome to HealthVault!</p>
                  <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">Your secure prescription management platform</p>
                </div>
                {prescriptions.length > 0 && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">Prescriptions Loaded</p>
                    <p className="text-xs text-green-600 dark:text-green-300 mt-1">You have {prescriptions.length} prescription(s) in your account</p>
                  </div>
                )}
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-sm font-medium text-purple-800 dark:text-purple-200">Upload Feature</p>
                  <p className="text-xs text-purple-600 dark:text-purple-300 mt-1">You can upload prescription images for better record keeping</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Live Health Metrics Section */}
      <div className="bg-gradient-to-br from-cyan-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950 rounded-2xl shadow-lg p-6 border border-white/20 dark:border-gray-800/20 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Activity className="h-7 w-7 animate-pulse text-blue-500" /> Live Health Metrics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Heart Rate Chart */}
          <div className="flex flex-col items-center">
            <span className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">Heart Rate</span>
            <ResponsiveContainer width="100%" height={120}>
              <RechartsLineChart data={liveMetrics} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ef" />
                <XAxis dataKey="time" tick={{ fill: '#64748b' }} fontSize={12} />
                <YAxis domain={[60, 100]} tick={{ fill: '#64748b' }} fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="heartRate" stroke="#3b82f6" strokeWidth={3} dot={false} isAnimationActive={true} />
              </RechartsLineChart>
            </ResponsiveContainer>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">{liveMetrics[liveMetrics.length-1].heartRate} bpm</span>
          </div>
          {/* Blood Pressure Chart */}
          <div className="flex flex-col items-center">
            <span className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">Blood Pressure</span>
            <ResponsiveContainer width="100%" height={120}>
              <RechartsLineChart data={liveMetrics} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ef" />
                <XAxis dataKey="time" tick={{ fill: '#64748b' }} fontSize={12} />
                <YAxis domain={[70, 130]} tick={{ fill: '#64748b' }} fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="bpSystolic" stroke="#10b981" strokeWidth={3} dot={false} isAnimationActive={true} />
                <Line type="monotone" dataKey="bpDiastolic" stroke="#6366f1" strokeWidth={3} dot={false} isAnimationActive={true} />
              </RechartsLineChart>
            </ResponsiveContainer>
            <span className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">{liveMetrics[liveMetrics.length-1].bpSystolic}/{liveMetrics[liveMetrics.length-1].bpDiastolic}</span>
          </div>
          {/* SpO2 Chart */}
          <div className="flex flex-col items-center">
            <span className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">SpO₂</span>
            <ResponsiveContainer width="100%" height={120}>
              <RechartsLineChart data={liveMetrics} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ef" />
                <XAxis dataKey="time" tick={{ fill: '#64748b' }} fontSize={12} />
                <YAxis domain={[95, 100]} tick={{ fill: '#64748b' }} fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="spo2" stroke="#f59e42" strokeWidth={3} dot={false} isAnimationActive={true} />
              </RechartsLineChart>
            </ResponsiveContainer>
            <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">{liveMetrics[liveMetrics.length-1].spo2}%</span>
          </div>
        </div>
      </div>
      
      {/* Medication Feedback Section */}
      <div className="bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 dark:from-gray-900 dark:via-gray-950 dark:to-orange-950 rounded-2xl shadow-lg p-6 border border-white/20 dark:border-gray-800/20 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500 rounded-full shadow-lg">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Medication Feedback</h2>
              <p className="text-gray-600 dark:text-gray-400">Share your experience with medications</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prescriptions.slice(0, 6).map((prescription) => (
            <motion.div
              key={prescription.id}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-200 dark:border-orange-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-orange-500" />
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {prescription.medicationName}
                  </h3>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  prescription.isActive 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {prescription.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                {prescription.dosage && prescription.dosage !== 'N/A' && (
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Dosage:</span> {prescription.dosage}
                  </div>
                )}
                {prescription.frequency && prescription.frequency !== 'N/A' && (
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Frequency:</span> {prescription.frequency}
                  </div>
                )}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openFeedbackModal(prescription)}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Give Feedback
              </motion.button>
            </motion.div>
          ))}
        </div>
        
        {prescriptions.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Medications Available</h3>
            <p className="text-gray-600 dark:text-gray-400">Add prescriptions to start providing feedback</p>
          </div>
        )}
      </div>


      {/* Enhanced Medication Reminders Section */}
      <div className="bg-gradient-to-br from-emerald-100 via-green-50 to-teal-100 dark:from-gray-900 dark:via-gray-950 dark:to-emerald-950 rounded-2xl shadow-xl p-8 border border-white/20 dark:border-gray-800/20 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500 rounded-full shadow-lg">
              <Bell className="h-8 w-8 text-white" />
        </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Medication Reminders</h2>
              <p className="text-gray-600 dark:text-gray-400">Track your daily medication schedule</p>
        </div>
      </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{adherenceRate}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Adherence Rate</div>
          </div>
          </div>
        
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-white/40 rounded-full h-3 shadow-inner">
            <div 
              className="bg-gradient-to-r from-emerald-400 to-green-500 h-3 rounded-full transition-all duration-700 shadow-lg" 
              style={{ width: `${adherenceRate}%` }}
            ></div>
          </div>
        </div>

        {/* Reminders List */}
        <div className="space-y-4">
          {reminders.map((reminder, index) => (
            <motion.div
              key={reminder.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                reminder.taken 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700' 
                  : 'bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border-gray-200 dark:border-gray-600'
              }`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full shadow-md ${
                      reminder.taken 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                    }`}>
                      <Pill className="h-6 w-6" />
        </div>
        <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {reminder.medicationName}
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                          <Clock3 className="h-4 w-4 mr-1" />
                          {reminder.time}
                </span>
                        <span className="inline-flex items-center px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                          <Calendar className="h-4 w-4 mr-1" />
                          {reminder.date}
                </span>
        </div>
      </div>
      </div>
                  
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={reminder.taken}
                          onChange={() => {
                            console.log(`Marking ${reminder.medicationName} as ${reminder.taken ? 'not taken' : 'taken'}`)
                          }}
                          className="w-6 h-6 text-emerald-600 bg-white border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-emerald-500/20 focus:ring-offset-0 dark:bg-gray-700 dark:border-gray-600 transition-all duration-200"
                        />
                        {reminder.taken && (
                          <CheckCircle className="absolute inset-0 w-6 h-6 text-emerald-600 pointer-events-none" />
                        )}
                      </div>
                      <span className={`text-lg font-semibold transition-colors duration-200 ${
                        reminder.taken 
                          ? 'text-green-700 dark:text-green-300' 
                          : 'text-gray-700 dark:text-gray-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                      }`}>
                        {reminder.taken ? 'Taken' : 'Mark as Taken'}
              </span>
                    </label>
                    
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-md transition-all duration-200 ${
                      reminder.taken 
                        ? 'bg-green-100 text-green-800 border-2 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-600' 
                        : 'bg-red-100 text-red-800 border-2 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-600'
                    }`}>
                      {reminder.taken ? (
                        <>
                          <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                          Completed
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
                          Pending
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Success Animation Overlay */}
              {reminder.taken && (
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-emerald-400/10 pointer-events-none"></div>
              )}
            </motion.div>
          ))}
      </div>
        
        {/* Summary Stats */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {reminders.filter(r => r.taken).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Taken Today</div>
            </div>
            <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {reminders.filter(r => !r.taken).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
            </div>
            <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {reminders.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Reminders</div>
            </div>
          </div>
        </div>
      </div>

      {/* Symptom Checker Section */}
      <div className="bg-gradient-to-br from-yellow-100 via-orange-50 to-amber-100 dark:from-gray-900 dark:via-gray-950 dark:to-yellow-950 rounded-2xl shadow-lg p-6 border border-white/20 dark:border-gray-800/20 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <AlertTriangle className="h-7 w-7 text-yellow-500 animate-bounce" /> Symptom Checker
        </h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {symptomsList.map(symptom => (
            <button
              key={symptom}
              onClick={() => setSelectedSymptoms(prev => prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom])}
              className={`px-4 py-2 rounded-lg font-medium shadow transition-all ${selectedSymptoms.includes(symptom) ? 'bg-yellow-400 text-white' : 'bg-white/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200'}`}
            >
              {symptom}
            </button>
          ))}
        </div>
        <div className="text-md font-semibold text-gray-800 dark:text-yellow-100 flex items-center gap-2 animate-fade-in">
          <Info className="h-5 w-5 text-yellow-400" />
          {getSymptomFeedback()}
        </div>
      </div>



      {/* Smart Body Map Section */}
      <div className="bg-gradient-to-br from-cyan-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950 rounded-2xl shadow-lg p-6 border border-white/20 dark:border-gray-800/20 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <EyeIcon className="h-7 w-7 text-cyan-500 animate-pulse" /> Smart Body Map
        </h2>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* SVG Body Map */}
          <div className="flex-shrink-0">
            <svg width="120" height="260" viewBox="0 0 120 260" className="cursor-pointer">
              {/* Head */}
              <circle cx="60" cy="30" r="20" fill="#bae6fd" stroke="#0ea5e9" strokeWidth="3" onClick={() => handleBodyPartClick('head')} />
              {/* Chest */}
              <rect x="40" y="50" width="40" height="50" rx="15" fill="#a5b4fc" stroke="#6366f1" strokeWidth="3" onClick={() => handleBodyPartClick('chest')} />
              {/* Stomach */}
              <rect x="45" y="100" width="30" height="35" rx="10" fill="#fcd34d" stroke="#f59e42" strokeWidth="3" onClick={() => handleBodyPartClick('stomach')} />
              {/* Arms */}
              <rect x="15" y="60" width="20" height="70" rx="10" fill="#bbf7d0" stroke="#10b981" strokeWidth="3" onClick={() => handleBodyPartClick('arms')} />
              <rect x="85" y="60" width="20" height="70" rx="10" fill="#bbf7d0" stroke="#10b981" strokeWidth="3" onClick={() => handleBodyPartClick('arms')} />
              {/* Legs */}
              <rect x="45" y="135" width="10" height="70" rx="5" fill="#fca5a5" stroke="#ef4444" strokeWidth="3" onClick={() => handleBodyPartClick('legs')} />
              <rect x="65" y="135" width="10" height="70" rx="5" fill="#fca5a5" stroke="#ef4444" strokeWidth="3" onClick={() => handleBodyPartClick('legs')} />
            </svg>
          </div>
          {/* Info Panel */}
          <div className="flex-1">
            {selectedBodyPart && bodyPartInfo ? (
              <div className="p-4 rounded-xl bg-white/80 dark:bg-gray-800/80 shadow flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-2">
                  {bodyPartInfo.icon}
                  <span className="font-bold text-lg text-gray-900 dark:text-white">{bodyPartInfo.name}</span>
                  <span className={`ml-2 text-sm font-semibold ${getHealthColor(bodyPartInfo.health)}`}>{bodyPartInfo.health}</span>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-200">Prescriptions:</div>
                <ul className="list-disc list-inside text-gray-800 dark:text-gray-100 mb-2">
                  {bodyPartInfo.prescriptions.length > 0 ? bodyPartInfo.prescriptions.map((p: any) => (
                    <li key={p.id}>{p.medicationName}</li>
                  )) : <li>None</li>}
                </ul>
                <div className="text-sm text-gray-700 dark:text-gray-200">Symptoms:</div>
                <ul className="list-disc list-inside text-gray-800 dark:text-gray-100 mb-2">
                  {bodyPartInfo.symptoms.length > 0 ? bodyPartInfo.symptoms.map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  )) : <li>None</li>}
                </ul>
                <div className="text-sm text-gray-700 dark:text-gray-200">Recommendations:</div>
                <ul className="list-disc list-inside text-gray-800 dark:text-gray-100 mb-2">
                  {bodyPartInfo.recommendations.length > 0 ? bodyPartInfo.recommendations.map((r: string, i: number) => (
                    <li key={i}>{r}</li>
                  )) : <li>None</li>}
                </ul>
                <button
                  onClick={() => alert(`Symptom logged for ${bodyPartInfo.name}`)}
                  className="mt-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg shadow font-semibold"
                >
                  Log Symptom
                </button>
              </div>
            ) : (
              <div className="p-4 text-gray-500 dark:text-gray-400">Click a body part to view details and log symptoms.</div>
            )}
          </div>
        </div>
      </div>

    </div>
  )
} 
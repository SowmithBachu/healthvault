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
  Circle,
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

interface MedicationFeedback {
  id: string
  prescriptionId: string
  medicationName: string
  effectiveness: string
  symptoms: string[]
  sideEffects: string[]
  notes: string
  date: string
  createdAt: string
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
  
  const [medicationFeedbacks, setMedicationFeedbacks] = useState<MedicationFeedback[]>([])
  const [showFeedbackDisplay, setShowFeedbackDisplay] = useState(false)
  const [selectedPrescriptionForFeedback, setSelectedPrescriptionForFeedback] = useState<Prescription | null>(null)
  
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

  const [reminders, setReminders] = useState<MedicationReminder[]>([
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
    if (!selectedMedicationForFeedback) return
    
    const newFeedback: MedicationFeedback = {
      id: Date.now().toString(),
      prescriptionId: selectedMedicationForFeedback.id,
      medicationName: selectedMedicationForFeedback.medicationName,
      effectiveness: feedbackData.effectiveness,
      symptoms: feedbackData.symptoms,
      sideEffects: feedbackData.sideEffects,
      notes: feedbackData.notes,
      date: feedbackData.date,
      createdAt: new Date().toISOString()
    }
    
    // Store feedback in state
    setMedicationFeedbacks(prev => [...prev, newFeedback])
    
    // Here you would typically send the feedback to your backend
    console.log('Feedback submitted:', newFeedback)
    
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

  const toggleReminder = (reminderId: string) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === reminderId 
        ? { ...reminder, taken: !reminder.taken }
        : reminder
    ))
  }

  const showFeedbackForPrescription = (prescription: Prescription) => {
    setSelectedPrescriptionForFeedback(prescription)
    setShowFeedbackDisplay(true)
  }

  const getFeedbackForPrescription = (prescriptionId: string) => {
    return medicationFeedbacks.filter(feedback => feedback.prescriptionId === prescriptionId)
  }

  const [allFeedback, setAllFeedback] = useState<MedicationFeedback[]>([])
  const [feedbackLoading, setFeedbackLoading] = useState(false)

  // Fetch all feedback for the patient
  const fetchAllFeedback = async () => {
    setFeedbackLoading(true)
    try {
      const res = await fetch('/api/feedback', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        // Parse JSON fields
        setAllFeedback(
          data.map((fb: any) => ({
            ...fb,
            symptoms: typeof fb.symptoms === 'string' ? JSON.parse(fb.symptoms) : fb.symptoms,
            sideEffects: typeof fb.sideEffects === 'string' ? JSON.parse(fb.sideEffects) : fb.sideEffects,
          }))
        )
      }
    } catch (e) {
      console.error('Error fetching feedback', e)
    } finally {
      setFeedbackLoading(false)
    }
  }

  // Fetch feedback on component mount
  useEffect(() => {
    fetchAllFeedback()
  }, [])

  // Group feedback by prescription
  const feedbackByPrescription = allFeedback.reduce((acc: Record<string, MedicationFeedback[]>, fb) => {
    if (!acc[fb.medicationName]) acc[fb.medicationName] = []
    acc[fb.medicationName].push(fb)
    return acc
  }, {})

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
    <div className={`transition-colors duration-300 ${isDarkMode ? 'dark' : ''} bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 min-h-screen`}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/40 dark:border-slate-700/40 shadow-lg shadow-slate-200/20 dark:shadow-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
        <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">HealthVault</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Your Personal Health Dashboard</p>
        </div>
            <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
                className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-white/90 dark:hover:bg-slate-700/90 transition-all shadow-lg shadow-slate-200/30 dark:shadow-slate-900/30 border border-slate-200/40 dark:border-slate-700/40 backdrop-blur-sm"
          >
                {isDarkMode ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-slate-600" />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-white/90 dark:hover:bg-slate-700/90 transition-all shadow-lg shadow-slate-200/30 dark:shadow-slate-900/30 border border-slate-200/40 dark:border-slate-700/40 backdrop-blur-sm relative"
          >
                <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            {stats.total > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-lg shadow-rose-500/30"
              >
                {stats.total}
              </motion.span>
            )}
          </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Prescriptions */}
        <div className="xl:col-span-2 bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl shadow-slate-200/20 dark:shadow-slate-900/20 border border-slate-200/30 dark:border-slate-700/30 overflow-hidden backdrop-blur-sm">
          <div className="px-6 py-5 bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/40 dark:from-slate-800/60 dark:via-slate-700/40 dark:to-slate-600/30 border-b border-slate-200/40 dark:border-slate-700/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500/90 via-indigo-600/90 to-purple-600/90 rounded-xl shadow-lg shadow-blue-500/20">
                  <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Recent Prescriptions</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Your current medications</p>
              </div>
            </div>
              <div className="px-4 py-2 bg-gradient-to-r from-blue-100/80 to-indigo-100/60 dark:from-blue-900/40 dark:to-indigo-900/30 rounded-full border border-blue-200/50 dark:border-blue-800/50 shadow-sm">
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                {filteredPrescriptions.length} of {prescriptions.length}
              </span>
            </div>
          </div>
        </div>
          <div className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
            {filteredPrescriptions.slice(0, 3).map((prescription, index) => (
            <motion.div
              key={prescription.id}
                initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="px-4 py-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {prescription.medicationName}
                    </h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      prescription.isActive 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' 
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                    }`}>
                      {prescription.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                    <div className="flex flex-wrap items-center gap-1 mb-1">
                          {prescription.dosage && prescription.dosage !== 'N/A' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-xs">
                          <Pill className="h-3 w-3 mr-1" /> {prescription.dosage}
                            </span>
                          )}
                          {prescription.frequency && prescription.frequency !== 'N/A' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-xs">
                          <Clock className="h-3 w-3 mr-1" /> {prescription.frequency}
                            </span>
                          )}
                        </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(prescription.prescribedDate)}
                  </p>
                </div>
                  <div className="flex items-center space-x-1">
                    {/* Feedback Display Button */}
                    {getFeedbackForPrescription(prescription.id).length > 0 && (
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => showFeedbackForPrescription(prescription)}
                        className="text-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 p-1.5 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                        title="View Feedback"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </motion.button>
                    )}
                    
                    {/* Feedback Button - Always visible */}
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openFeedbackModal(prescription)}
                      className="text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 p-1.5 rounded-md hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                      title="Give Feedback"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </motion.button>
                    
                  {prescription.imageUrl && (
                    <>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleViewImage(prescription.imageUrl!)}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title="View Image"
                      >
                          <Eye className="h-4 w-4" />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDownloadImage(prescription.imageUrl!, prescription.medicationName)}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title="Download Image"
                      >
                          <Download className="h-4 w-4" />
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {filteredPrescriptions.length === 0 && (
              <div className="px-4 py-8 text-center">
                <FileText className="mx-auto h-8 w-8 text-slate-400 dark:text-slate-500 mb-2" />
                <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-1">No prescriptions found</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Get started by uploading your prescriptions.
              </p>
            </div>
          )}
        </div>
      </div>
      
        {/* Quick Actions - Compact */}
        {/* Quick Actions */}
        <div className="bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl shadow-slate-200/20 dark:shadow-slate-900/20 border border-slate-200/30 dark:border-slate-700/30 overflow-hidden backdrop-blur-sm">
          <div className="px-6 py-5 bg-gradient-to-r from-emerald-50/80 via-green-50/60 to-teal-50/40 dark:from-slate-800/60 dark:via-slate-700/40 dark:to-slate-600/30 border-b border-slate-200/40 dark:border-slate-700/40">
          <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500/90 via-green-600/90 to-teal-600/90 rounded-xl shadow-lg shadow-emerald-500/20">
                <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Quick Actions</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">Essential health tools</p>
            </div>
          </div>
        </div>
          <div className="p-5 space-y-4">
            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowUploadModal(true)}
              className="group relative overflow-hidden flex items-center justify-center px-4 py-3 bg-gradient-to-br from-blue-500/90 via-indigo-600/90 to-purple-600/90 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 border border-blue-400/30 w-full"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <div className="relative flex items-center gap-3">
                <div className="p-2 bg-white/25 rounded-lg backdrop-blur-sm shadow-sm">
                  <Plus className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold">Upload Prescription</div>
                  <div className="text-xs text-blue-100/90">Add new medication</div>
                </div>
              </div>
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.print()}
              className="group relative overflow-hidden flex items-center justify-center px-4 py-3 bg-gradient-to-br from-emerald-500/90 via-green-600/90 to-teal-600/90 hover:from-emerald-600 hover:via-green-700 hover:to-teal-700 text-white rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 border border-emerald-400/30 w-full"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <div className="relative flex items-center gap-3">
                <div className="p-2 bg-white/25 rounded-lg backdrop-blur-sm shadow-sm">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold">Print Summary</div>
                  <div className="text-xs text-emerald-100/90">Generate report</div>
                </div>
              </div>
            </motion.button>
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden border border-slate-200/60 dark:border-slate-700/60"
          >
            <div className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 border-b-2 border-slate-300 dark:border-slate-500">
              <div className="flex items-center justify-between p-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Medication Feedback</h2>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                    {selectedMedicationForFeedback.medicationName}
                  </p>
              </div>
              <button
                onClick={() => setShowFeedbackModal(false)}
                  className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors border border-slate-300 dark:border-slate-500"
              >
                  <X className="h-4 w-4 text-slate-600 dark:text-slate-300" />
              </button>
              </div>
            </div>
            
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-4">
                {/* Effectiveness Rating */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    How effective was this medication?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Very Effective', 'Somewhat Effective', 'Not Effective'].map((option) => (
                      <button
                        key={option}
                        onClick={() => setFeedbackData(prev => ({ ...prev, effectiveness: option }))}
                        className={`p-2.5 rounded-lg border text-sm transition-colors ${
                          feedbackData.effectiveness === option
                            ? 'border-slate-600 bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-white font-medium'
                            : 'border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Side Effects */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Side effects? (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {['Nausea', 'Dizziness', 'Headache', 'Drowsiness', 'Dry Mouth', 'Upset Stomach', 'Rash', 'None'].map((effect) => (
                      <label key={effect} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={feedbackData.sideEffects.includes(effect)}
                          onChange={() => toggleSymptom(effect, 'sideEffects')}
                          className="w-4 h-4 text-slate-600 bg-white border-slate-300 rounded focus:ring-slate-500 dark:focus:ring-slate-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{effect}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={feedbackData.notes}
                    onChange={(e) => setFeedbackData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Share any observations or experiences..."
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent dark:bg-slate-700 dark:text-white resize-none text-sm"
                    rows={2}
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Date of Feedback
                  </label>
                  <input
                    type="date"
                    value={feedbackData.date}
                    onChange={(e) => setFeedbackData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-600">
              <div className="flex items-center justify-end gap-3 p-4">
              <button
                onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFeedbackSubmit}
                disabled={!feedbackData.effectiveness}
                  className="px-6 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 dark:hover:bg-slate-200"
              >
                Submit Feedback
              </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Enhanced Image Viewer Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg max-w-2xl w-full max-h-[80vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Prescription Image</h2>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-3">
              <img 
                src={selectedImage} 
                alt="Prescription" 
                className="w-full h-auto rounded-lg shadow-sm"
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

      {/* Feedback Display Modal */}
      {showFeedbackDisplay && selectedPrescriptionForFeedback && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg max-w-2xl w-full max-h-[80vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Medication Feedback</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {selectedPrescriptionForFeedback.medicationName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowFeedbackDisplay(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {getFeedbackForPrescription(selectedPrescriptionForFeedback.id).length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500 mb-3" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No Feedback Yet</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    You haven't provided feedback for this medication yet.
                  </p>
                  <button
                    onClick={() => {
                      setShowFeedbackDisplay(false)
                      openFeedbackModal(selectedPrescriptionForFeedback)
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg text-sm font-medium transition-all duration-200"
                  >
                    Give Feedback Now
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {getFeedbackForPrescription(selectedPrescriptionForFeedback.id).map((feedback, index) => (
                    <motion.div
                      key={feedback.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.1 }}
                      className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200/60 dark:border-slate-600/60"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            {formatDate(feedback.date)}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {/* Effectiveness */}
                      <div className="mb-3">
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Effectiveness
                        </label>
                        <div className="flex items-center gap-2">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            feedback.effectiveness === 'Very Effective' 
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                              : feedback.effectiveness === 'Somewhat Effective'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                              : feedback.effectiveness === 'Not Very Effective'
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                          }`}>
                            {feedback.effectiveness}
                          </div>
                        </div>
                      </div>
                      
                      {/* Symptoms */}
                      {feedback.symptoms.length > 0 && (
                        <div className="mb-3">
                          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Symptoms Experienced
                          </label>
                          <div className="flex flex-wrap gap-1">
                            {feedback.symptoms.map((symptom, idx) => (
                              <span key={idx} className="inline-flex items-center px-2 py-1 rounded-md bg-orange-50 text-orange-700 text-xs dark:bg-orange-900/30 dark:text-orange-300">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                {symptom}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Side Effects */}
                      {feedback.sideEffects.length > 0 && (
                        <div className="mb-3">
                          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Side Effects
                          </label>
                          <div className="flex flex-wrap gap-1">
                            {feedback.sideEffects.map((effect, idx) => (
                              <span key={idx} className="inline-flex items-center px-2 py-1 rounded-md bg-red-50 text-red-700 text-xs dark:bg-red-900/30 dark:text-red-300">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {effect}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Notes */}
                      {feedback.notes && (
                        <div>
                          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Additional Notes
                          </label>
                          <p className="text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-600">
                            {feedback.notes}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-end gap-2 p-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setShowFeedbackDisplay(false)}
                className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                Close
              </button>
              {getFeedbackForPrescription(selectedPrescriptionForFeedback.id).length > 0 && (
                <button
                  onClick={() => {
                    setShowFeedbackDisplay(false)
                    openFeedbackModal(selectedPrescriptionForFeedback)
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg text-sm font-medium transition-all duration-200"
                >
                  Add More Feedback
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Live Health Metrics */}
      <div className="bg-gradient-to-br from-cyan-50/80 via-blue-50/60 to-indigo-50/40 dark:from-slate-900 dark:via-slate-950 dark:to-blue-950 rounded-2xl shadow-xl shadow-slate-200/20 dark:shadow-slate-900/20 border border-slate-200/30 dark:border-slate-700/30 overflow-hidden backdrop-blur-sm">
        <div className="px-6 py-5 bg-gradient-to-r from-cyan-50/90 via-blue-50/70 to-indigo-50/50 dark:from-slate-800/60 dark:via-slate-700/40 dark:to-slate-600/30 border-b border-slate-200/40 dark:border-slate-700/40">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-cyan-500/90 via-blue-600/90 to-indigo-600/90 rounded-xl shadow-lg shadow-cyan-500/20">
              <Activity className="h-6 w-6 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Live Health Metrics</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">Real-time health monitoring</p>
            </div>
          </div>
        </div>
        <div className="p-6">
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
        </div>
        
      {/* Medication Reminders */}
      <div className="bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl shadow-slate-200/20 dark:shadow-slate-900/20 border border-slate-200/30 dark:border-slate-700/30 overflow-hidden backdrop-blur-sm">
        <div className="px-6 py-5 bg-gradient-to-r from-purple-50/80 via-pink-50/60 to-rose-50/40 dark:from-slate-800/60 dark:via-slate-700/40 dark:to-slate-600/30 border-b border-slate-200/40 dark:border-slate-700/40">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500/90 via-pink-600/90 to-rose-600/90 rounded-xl shadow-lg shadow-purple-500/20">
              <Clock3 className="h-6 w-6 text-white" />
        </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Medication Reminders</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">Stay on track with your medications</p>
        </div>
      </div>
          </div>
        <div className="p-5 space-y-4">
          {reminders.map((reminder, index) => (
            <motion.div
              key={reminder.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className={`relative overflow-hidden rounded-lg shadow-sm border transition-all duration-200 hover:shadow-md ${
                reminder.taken 
                  ? 'bg-gradient-to-r from-emerald-50/80 to-green-50/80 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200/50 dark:border-emerald-700/50' 
                  : 'bg-gradient-to-r from-white/80 to-slate-50/80 dark:from-slate-800/80 dark:to-slate-700/80 border-slate-200/50 dark:border-slate-600/50'
              }`}
            >
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg shadow-sm ${
                      reminder.taken 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                    }`}>
                      <Pill className="h-4 w-4" />
        </div>
        <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                        {reminder.medicationName}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 rounded-md text-xs font-medium">
                          <Clock3 className="h-3 w-3 mr-1" />
                          {reminder.time}
                </span>
                        <span className="inline-flex items-center px-2 py-0.5 bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300 rounded-md text-xs font-medium">
                          <Calendar className="h-3 w-3 mr-1" />
                          {reminder.date}
                </span>
        </div>
      </div>
      </div>
                  
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleReminder(reminder.id)}
                      className={`relative p-2 rounded-lg transition-all duration-200 ${
                        reminder.taken 
                          ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300' 
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-300'
                      }`}
                      title={reminder.taken ? 'Mark as not taken' : 'Mark as taken'}
                    >
                      {reminder.taken ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                    </motion.button>
                    
                    <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium shadow-sm transition-all duration-200 ${
                      reminder.taken 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700' 
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 border border-rose-200 dark:border-rose-700'
                    }`}>
                      {reminder.taken ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Done
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Pending
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Success Animation Overlay */}
              {reminder.taken && (
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/5 to-green-400/5 pointer-events-none"></div>
              )}
            </motion.div>
          ))}
      </div>
        
        {/* Summary Stats */}
        <div className="px-4 pb-4 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg shadow-sm">
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {reminders.filter(r => r.taken).length}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Taken</div>
            </div>
            <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg shadow-sm">
              <div className="text-lg font-bold text-rose-600 dark:text-rose-400">
                {reminders.filter(r => !r.taken).length}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Pending</div>
            </div>
            <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg shadow-sm">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {reminders.length}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Symptom Checker */}
      <div className="bg-gradient-to-br from-yellow-50/80 via-orange-50/60 to-amber-50/40 dark:from-slate-900 dark:via-slate-950 dark:to-yellow-950 rounded-2xl shadow-xl shadow-slate-200/20 dark:shadow-slate-900/20 border border-slate-200/30 dark:border-slate-700/30 overflow-hidden backdrop-blur-sm">
        <div className="px-6 py-5 bg-gradient-to-r from-yellow-50/90 via-orange-50/70 to-amber-50/50 dark:from-slate-800/60 dark:via-slate-700/40 dark:to-slate-600/30 border-b border-slate-200/40 dark:border-slate-700/40">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-yellow-500/90 via-orange-600/90 to-amber-600/90 rounded-xl shadow-lg shadow-yellow-500/20">
              <AlertTriangle className="h-6 w-6 text-white animate-bounce" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Symptom Checker</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">Get instant health guidance</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-3 mb-6">
          {symptomsList.map(symptom => (
            <button
              key={symptom}
              onClick={() => setSelectedSymptoms(prev => prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom])}
                className={`px-4 py-2.5 rounded-xl font-medium shadow-sm transition-all border ${
                  selectedSymptoms.includes(symptom) 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-yellow-400' 
                    : 'bg-white/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700'
                }`}
            >
              {symptom}
            </button>
          ))}
        </div>
          <div className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-3">
              <Info className="h-5 w-5 text-yellow-500" />
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
          {getSymptomFeedback()}
              </p>
            </div>
          </div>
        </div>
      </div>



      {/* Smart Body Map */}
      <div className="bg-gradient-to-br from-cyan-50/80 via-blue-50/60 to-indigo-50/40 dark:from-slate-900 dark:via-slate-950 dark:to-blue-950 rounded-2xl shadow-xl shadow-slate-200/20 dark:shadow-slate-900/20 border border-slate-200/30 dark:border-slate-700/30 overflow-hidden backdrop-blur-sm">
        <div className="px-6 py-5 bg-gradient-to-r from-cyan-50/90 via-blue-50/70 to-indigo-50/50 dark:from-slate-800/60 dark:via-slate-700/40 dark:to-slate-600/30 border-b border-slate-200/40 dark:border-slate-700/40">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-cyan-500/90 via-blue-600/90 to-indigo-600/90 rounded-xl shadow-lg shadow-cyan-500/20">
              <EyeIcon className="h-6 w-6 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Smart Body Map</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">Interactive health monitoring</p>
            </div>
          </div>
        </div>
        <div className="p-6">
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
  </div> {/* End Main Content */}
    </div> // End outermost div
  )
} 
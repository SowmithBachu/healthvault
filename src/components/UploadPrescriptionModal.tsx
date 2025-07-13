'use client'

import { useState, useRef } from 'react'
import { X, Upload, FileText, Pill, Clock, Calendar, Activity } from 'lucide-react'

interface UploadPrescriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: () => void
}

export default function UploadPrescriptionModal({ isOpen, onClose, onUpload }: UploadPrescriptionModalProps) {
  const [formData, setFormData] = useState({
    medicationName: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Live validation
    if (name !== 'instructions' && value.trim() === '') {
      setError(`Please enter ${name.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
    } else {
      setError('')
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed')
        return
      }
      setSelectedFile(file)
      setError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!selectedFile) {
      setError('Please select a prescription image')
      return
    }

    if (!formData.medicationName) {
      setError('Please enter medication name')
      return
    }
    if (!formData.dosage) {
      setError('Please enter dosage')
      return
    }
    if (!formData.frequency) {
      setError('Please enter frequency')
      return
    }
    if (!formData.duration) {
      setError('Please enter duration')
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const uploadData = new FormData()
      uploadData.append('file', selectedFile)
      uploadData.append('medicationName', formData.medicationName)
      uploadData.append('dosage', formData.dosage)
      uploadData.append('frequency', formData.frequency)
      uploadData.append('duration', formData.duration)
      uploadData.append('instructions', formData.instructions)

      const response = await fetch('/api/prescriptions/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      // Reset form
      setFormData({
        medicationName: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
      })
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      onUpload()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/30">
      <div className="relative z-10 max-w-md w-full">
        <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
          {/* Close button in top-right corner */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="flex items-center justify-center px-6 py-4 border-b border-gray-100 dark:border-zinc-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Upload Prescription</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
            {/* File Upload - Compact */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Prescription Image
              </label>
              <div
                className={`relative border-2 border-dashed ${selectedFile ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50'} rounded-lg p-4 text-center transition-all duration-300 group cursor-pointer hover:border-blue-500 hover:bg-blue-100 flex flex-col items-center justify-center min-h-[80px] shadow-sm`}
                onClick={() => fileInputRef.current?.click()}
                tabIndex={0}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && fileInputRef.current?.click()}
                role="button"
                aria-label="Upload prescription image"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {selectedFile ? (
                  <div className="flex flex-col items-center space-y-1">
                    <Upload className="h-8 w-8 text-blue-400" />
                    <span className="text-sm font-medium text-blue-700 truncate max-w-full">
                      {selectedFile.name}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-1">
                    <Upload className="h-8 w-8 text-blue-400 group-hover:text-blue-500" />
                    <span className="text-sm text-blue-700 group-hover:text-blue-800 font-medium">
                      Click to upload image
                    </span>
                    <span className="text-xs text-gray-400">(Max 5MB)</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Compact form fields in 2 columns */}
            <div className="grid grid-cols-2 gap-3">
              {/* Medication Name */}
              <div className="col-span-2">
                <label htmlFor="medicationName" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                  Medication Name <span className="text-blue-500">*</span>
                </label>
                <div className="relative">
                  <Pill className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
                  <input
                    type="text"
                    id="medicationName"
                    name="medicationName"
                    value={formData.medicationName}
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-inner placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all text-sm"
                    placeholder="Medication name"
                    required
                  />
                </div>
              </div>
              
              {/* Dosage */}
              <div>
                <label htmlFor="dosage" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                  Dosage <span className="text-blue-500">*</span>
                </label>
                <div className="relative">
                  <Clock className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
                  <input
                    type="text"
                    id="dosage"
                    name="dosage"
                    value={formData.dosage}
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-inner placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all text-sm"
                    placeholder="500mg"
                    required
                  />
                </div>
              </div>
              
              {/* Frequency */}
              <div>
                <label htmlFor="frequency" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                  Frequency <span className="text-blue-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
                  <input
                    type="text"
                    id="frequency"
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-inner placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all text-sm"
                    placeholder="Twice daily"
                    required
                  />
                </div>
              </div>
              
              {/* Duration */}
              <div>
                <label htmlFor="duration" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                  Duration <span className="text-blue-500">*</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
                  <input
                    type="text"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-inner placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all text-sm"
                    placeholder="5 days"
                    required
                  />
                </div>
              </div>
              
              {/* Instructions */}
              <div className="col-span-2">
                <label htmlFor="instructions" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                  Special Instructions
                </label>
                <div className="relative">
                  <Activity className="absolute left-2 top-2 h-4 w-4 text-blue-400" />
                  <textarea
                    id="instructions"
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent min-h-[60px] resize-none bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-inner placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all text-sm"
                    placeholder="Any special instructions (optional)"
                  />
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="flex pt-4 border-t border-gray-100 dark:border-zinc-800">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-lg font-bold shadow-lg focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Upload className="h-4 w-4 mr-2 animate-spin" /> Uploading...
                  </span>
                ) : 'Upload Prescription'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 
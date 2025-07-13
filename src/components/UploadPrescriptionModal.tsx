'use client'

import { useState, useRef } from 'react'
import { X, Upload, Plus, Trash2 } from 'lucide-react'

interface UploadPrescriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: () => void
}

interface MedicationData {
  id: string
  medicationName: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
  imageFile: File | null
}

export default function UploadPrescriptionModal({ isOpen, onClose, onUpload }: UploadPrescriptionModalProps) {
  const [medications, setMedications] = useState<MedicationData[]>([
    {
      id: '1',
      medicationName: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
      imageFile: null
    }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  const handleInputChange = (id: string, field: keyof MedicationData, value: string) => {
    setMedications(prev => prev.map(med => 
      med.id === id ? { ...med, [field]: value } : med
    ))
    setError('')
  }

  const handleFileSelect = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
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
      setMedications(prev => prev.map(med => 
        med.id === id ? { ...med, imageFile: file } : med
      ))
      setError('')
    }
  }

  const addMedication = () => {
    const newId = (medications.length + 1).toString()
    setMedications(prev => [...prev, {
      id: newId,
      medicationName: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
      imageFile: null
    }])
  }

  const removeMedication = (id: string) => {
    if (medications.length > 1) {
      setMedications(prev => prev.filter(med => med.id !== id))
    }
  }

  const validateMedication = (med: MedicationData): string | null => {
    if (!med.imageFile) return 'Please select a prescription image'
    if (!med.medicationName.trim()) return 'Please enter medication name'
    if (!med.dosage.trim()) return 'Please enter dosage'
    if (!med.frequency.trim()) return 'Please enter frequency'
    if (!med.duration.trim()) return 'Please enter duration'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate all medications
    for (const med of medications) {
      const validationError = validateMedication(med)
      if (validationError) {
        setError(validationError)
        return
      }
    }

    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      
      // Upload each medication
      for (const med of medications) {
        const uploadData = new FormData()
        uploadData.append('file', med.imageFile!)
        uploadData.append('medicationName', med.medicationName)
        uploadData.append('dosage', med.dosage)
        uploadData.append('frequency', med.frequency)
        uploadData.append('duration', med.duration)
        uploadData.append('instructions', med.instructions)

        const response = await fetch('/api/prescriptions/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: uploadData
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || `Upload failed for ${med.medicationName}`)
        }
      }

      // Reset form
      setMedications([{
        id: '1',
        medicationName: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
        imageFile: null
      }])

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-lg w-full max-h-[85vh] overflow-hidden border border-slate-200/60 dark:border-slate-700/60">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 border-b-2 border-slate-300 dark:border-slate-500">
          <div className="flex items-center justify-between p-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Upload Prescriptions</h2>
              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                Add multiple medications to your records
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors border border-slate-300 dark:border-slate-500"
            >
              <X className="h-4 w-4 text-slate-600 dark:text-slate-300" />
            </button>
          </div>
        </div>
        
        {/* Form Content */}
        <div className="p-3 max-h-[60vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}
            
            {/* Medications List */}
            <div className="space-y-3">
              {medications.map((medication, index) => (
                <div key={medication.id} className="border border-slate-200 dark:border-slate-600 rounded-lg p-3 bg-slate-50/50 dark:bg-slate-700/30">
                  {/* Medication Header */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Medication {index + 1}
                    </h3>
                    {medications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedication(medication.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* File Upload */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                      Prescription Image
                    </label>
                    <div
                      className={`relative border-2 border-dashed rounded-lg p-3 text-center transition-colors cursor-pointer hover:border-slate-400 dark:hover:border-slate-400 ${
                        medication.imageFile 
                          ? 'border-slate-400 bg-slate-50 dark:bg-slate-700/50' 
                          : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/30'
                      }`}
                      onClick={() => fileInputRefs.current[medication.id]?.click()}
                      tabIndex={0}
                      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && fileInputRefs.current[medication.id]?.click()}
                      role="button"
                      aria-label="Upload prescription image"
                    >
                      <input
                        ref={el => fileInputRefs.current[medication.id] = el}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileSelect(medication.id, e)}
                        className="hidden"
                      />
                      {medication.imageFile ? (
                        <div className="flex flex-col items-center space-y-1">
                          <Upload className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate max-w-full">
                            {medication.imageFile.name}
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center space-y-1">
                          <Upload className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                          <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                            Click to upload image
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">(Max 5MB)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-2">
                    {/* Medication Name */}
                    <div>
                      <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                        Medication Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={medication.medicationName}
                        onChange={(e) => handleInputChange(medication.id, 'medicationName', e.target.value)}
                        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm"
                        placeholder="Enter medication name"
                        required
                      />
                    </div>
                    
                    {/* Dosage and Frequency */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                          Dosage <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={medication.dosage}
                          onChange={(e) => handleInputChange(medication.id, 'dosage', e.target.value)}
                          className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm"
                          placeholder="500mg"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                          Frequency <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={medication.frequency}
                          onChange={(e) => handleInputChange(medication.id, 'frequency', e.target.value)}
                          className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm"
                          placeholder="Twice daily"
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Duration */}
                    <div>
                      <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                        Duration <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={medication.duration}
                        onChange={(e) => handleInputChange(medication.id, 'duration', e.target.value)}
                        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm"
                        placeholder="5 days"
                        required
                      />
                    </div>
                    
                    {/* Instructions */}
                    <div>
                      <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                        Special Instructions
                      </label>
                      <textarea
                        value={medication.instructions}
                        onChange={(e) => handleInputChange(medication.id, 'instructions', e.target.value)}
                        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent dark:bg-slate-700 dark:text-white resize-none text-sm"
                        placeholder="Any special instructions (optional)"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Medication Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={addMedication}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <Plus className="h-4 w-4" />
                Add Another Medication
              </button>
            </div>
          </form>
        </div>
        
        {/* Footer */}
        <div className="bg-slate-50 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-600">
          <div className="flex items-center justify-between p-3">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {medications.length} medication{medications.length !== 1 ? 's' : ''} ready to upload
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 dark:hover:bg-slate-200"
              >
                {loading ? 'Uploading...' : `Upload ${medications.length} Medication${medications.length !== 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
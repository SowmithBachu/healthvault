"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HospitalAccessPage() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (code === '1234') {
      router.push('/hospital/dashboard')
    } else {
      setError('Invalid code. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">Hospital Access</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">Enter 4-digit Code</label>
            <input
              type="text"
              id="code"
              name="code"
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg tracking-widest text-center"
              placeholder="----"
              maxLength={4}
              required
              autoFocus
            />
          </div>
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Enter Dashboard
          </button>
        </form>
      </div>
    </div>
  )
} 
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'

export default function SignupComponent() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
    valid: false
  })

  const checkPasswordStrength = (value: string) => {
    const strength = {
      length: value.length >= 8,
      lowercase: /[a-z]/.test(value),
      uppercase: /[A-Z]/.test(value),
      number: /[0-9]/.test(value),
      special: /[!@#$%^&*]/.test(value),
      valid: false
    }
    
    const conditionsMet = [strength.lowercase, strength.uppercase, strength.number, strength.special]
      .filter(Boolean).length >= 3
    
    strength.valid = strength.length && conditionsMet
    setPasswordStrength(strength)
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-black p-4 w-[23vw]">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  checkPasswordStrength(e.target.value)
                }}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {password && (
              <div className="mt-2 space-y-2 text-sm">
                <p className={`flex items-center ${passwordStrength.length ? 'text-green-500' : 'text-gray-500'}`}>
                  {passwordStrength.length ? '✓' : '○'} At least 8 characters
                </p>
                <p className="text-gray-700">At least 3 of the following:</p>
                <div className="ml-4 space-y-1">
                  <p className={passwordStrength.lowercase ? 'text-green-500' : 'text-gray-500'}>
                    {passwordStrength.lowercase ? '✓' : '○'} Lower case letters (a-z)
                  </p>
                  <p className={passwordStrength.uppercase ? 'text-green-500' : 'text-gray-500'}>
                    {passwordStrength.uppercase ? '✓' : '○'} Upper case letters (A-Z)
                  </p>
                  <p className={passwordStrength.number ? 'text-green-500' : 'text-gray-500'}>
                    {passwordStrength.number ? '✓' : '○'} Numbers (0-9)
                  </p>
                  <p className={passwordStrength.special ? 'text-green-500' : 'text-gray-500'}>
                    {passwordStrength.special ? '✓' : '○'} Special characters (!@#$%^&*)
                  </p>
                </div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {confirmPassword && confirmPassword !== password && (
              <p className="mt-2 text-red-500 text-sm">Passwords do not match</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Sign up
            </button>
          </div>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-600 hover:text-indigo-500">
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

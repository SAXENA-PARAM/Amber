'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

export default function Component() {
  const router = useRouter()

  const handleRedirect = () => {
    // Redirect to /signup with a query parameter for the profession
    router.push(`/landing`)
  }

  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
    valid: false
  })
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')

  const checkPasswordStrength = (value: string) => {
    const strength = {
      length: value.length >= 8,
      lowercase: /[a-z]/.test(value),
      uppercase: /[A-Z]/.test(value),
      number: /[0-9]/.test(value),
      special: /[!@#$%^&*]/.test(value),
      valid: false
    }
    
    // Check if at least 3 conditions are met (excluding length which is required)
    const conditionsMet = [strength.lowercase, strength.uppercase, strength.number, strength.special]
      .filter(Boolean).length >= 3
    
    strength.valid = strength.length && conditionsMet
    setPasswordStrength(strength)
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-black p-4 w-[23vw]">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome</h2>
        <form className="space-y-6">

        <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
             Username
            </label>
            <input
              id="username"
              type="username"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>



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
              onChange={(e) => setEmail(e.target.value)}
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
          <button
  type="submit"
  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
  onClick={async (e) => {
    e.preventDefault(); // Prevent the default behavior of the event
  
    try {
      const response = await fetch('http://localhost:5001/api/v1/user/web/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: username,
          email,
          password,
        }),
      });
  
      // Handle non-JSON responses gracefully
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Non-JSON error response:', errorText);
        alert(`Failed to create account: ${response.statusText || 'Unknown error'}`);

        return;
      }
  
      const data = await response.json();
      console.log('Signup response:', data.data);
      Cookies.set('accessToken', data.data.accessToken);
      // alert('Account created successfully!');
      handleRedirect();

      
    } catch (error) {
      console.error('Error during signup:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  }}
  
>
  Enter
</button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full  bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <a href="/api/auth/login" className="flex items-center justify-center gap-3">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </a>
          </button>

          {/* <div className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-indigo-600 hover:text-indigo-500">
              Sign up
            </Link>
          </div> */}
        </form>
      </div>
    </div>
  )
}

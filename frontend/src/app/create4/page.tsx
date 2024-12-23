"use client"
import { useState } from "react"
import React from 'react'
interface CourseDetails {
    name: string
    description: string
    imageUrl: string
    promoVideoUrl: string
    category: string
    subCategory: string
    prerequisites: string
    price: string
  }

const page = () => {
    const [courseDetails, setCourseDetails] = useState<CourseDetails>({
        name: '',
        description: '',
        imageUrl: '',
        promoVideoUrl: '',
        category: '',
        subCategory: '',
        prerequisites: '',
        price: ''
      })
      const updateCourseDetails = (field: keyof CourseDetails, value: string) => {
        setCourseDetails(prev => ({ ...prev, [field]: value }))
      }
  return (
    <div>
        <div>
            <h1>Pricing</h1>
            Set pricing of your course here
        </div>
        <label className="block text-sm font-medium mb-1">Price (₹)</label>
            <input
              type="number"
              className="w-full p-2 border text-black rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={courseDetails.price}
              onChange={(e ) => updateCourseDetails('price', e.target.value)}
            />
    </div>
  )
}

export default page
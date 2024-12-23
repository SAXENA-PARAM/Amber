'use client'

import React, { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import * as LucideIcons from 'lucide-react'

interface AnimatedIconButtonProps {
  text: string
  icon: keyof typeof LucideIcons
}

export default function AnimatedIconButton({ text, icon }: AnimatedIconButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const controls = useAnimation()
  const Icon = LucideIcons[icon] as React.ComponentType<LucideIcons.LucideProps>;

  useEffect(() => {
    const animateIcon = async () => {
      if (isHovered) {
        await controls.start({
          x: '100%',
          opacity: 0.7,
          transition: { duration: 1, ease: 'easeInOut' },
        })
        await new Promise(resolve => setTimeout(resolve, 500)) // Wait for 0.5 seconds
        await controls.start({
          x: '200%',
          opacity: 0,
          transition: { duration: 1 },
        })
      } else {
        controls.start({
          x: '-100%',
          opacity: 0,
          transition: { duration: 1 },
        })
      }
    }
    animateIcon()
  }, [isHovered, controls])

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  return (
    <button
      className={`relative overflow-hidden px-4 py-2 text-xl rounded-full transition-colors duration-300 ${
        isHovered ? 'bg-white text-black' : 'bg-black text-white shadow-xl'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative z-10 flex items-center justify-center">
        <span className={`transition-opacity duration-300 ${isHovered ? 'opacity-30' : 'opacity-100'}`}>
          {text}
        </span>
      </div>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ x: '-100%', opacity: 0 }}
        animate={controls}
      >
        <Icon className="w-6 h-6" />
      </motion.div>
    </button>
  )
}

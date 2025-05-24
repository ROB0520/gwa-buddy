'use client'

import { useEffect } from 'react'
import '../app/no-transitions.css'

export function DisableTransitionsOnLoad() {
  useEffect(() => {
    // Add a class to the document element to disable transitions
    document.documentElement.classList.add('no-transitions')
    
    // Remove the class after a short delay to re-enable transitions
    const timer = setTimeout(() => {
      document.documentElement.classList.remove('no-transitions')
    }, 300) // Increased delay to ensure all elements are loaded
    
    return () => clearTimeout(timer)
  }, [])
  
  return null
}

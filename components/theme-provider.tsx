"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const [mounted, setMounted] = React.useState(false)
  
  // Only render the children once the component has mounted to prevent hydration issues
  React.useEffect(() => {
    // Add no-transitions class immediately
    document.documentElement.classList.add('no-transitions')
    
    setMounted(true)
    
    // Remove the class after a delay
    const timer = setTimeout(() => {
      document.documentElement.classList.remove('no-transitions')
    }, 300)
    
    return () => clearTimeout(timer)
  }, [])
  
  if (!mounted) {
    return (
      <NextThemesProvider {...props}>
        <div style={{ visibility: 'hidden' }}>{children}</div>
      </NextThemesProvider>
    )
  }
  
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

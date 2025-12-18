import { UserButton } from '@clerk/nextjs'
import { CheckCircle } from 'lucide-react'
import React from 'react'

const page = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="flex flex-col items-center gap-4">
        {/* Animated Tick */}
        <div className="animate-scale-in">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>  
        <h1 className="text-white text-xl font-medium">Login successful</h1>
        <p className="text-neutral-400 text-sm">
          Redirecting to your dashboard…
        </p>
      </div>
    </div>
  )
}

export default page
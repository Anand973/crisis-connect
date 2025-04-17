"use client"

import { useState } from "react"
import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AlertBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-amber-50 border-y border-amber-200">
      <div className="container py-3 px-4 md:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <p className="text-sm font-medium text-amber-900">
              <span className="font-bold">ALERT:</span> Wildfire evacuation orders in effect for North County.
              <Link href="/crisis/wildfire-2023" className="ml-2 underline">
                View details
              </Link>
            </p>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-amber-900" onClick={() => setIsVisible(false)}>
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
      </div>
    </div>
  )
}


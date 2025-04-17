"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Home, Package, Clock } from "lucide-react"

export default function ImpactMetrics() {
  const [counts, setCounts] = useState({
    people: 0,
    shelters: 0,
    resources: 0,
    responseTime: 0,
  })

  const targetCounts = {
    people: 12500,
    shelters: 230,
    resources: 4800,
    responseTime: 45,
  }

  useEffect(() => {
    const duration = 2000
    const interval = 20
    const steps = duration / interval

    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      const progress = Math.min(currentStep / steps, 1)

      setCounts({
        people: Math.floor(targetCounts.people * progress),
        shelters: Math.floor(targetCounts.shelters * progress),
        resources: Math.floor(targetCounts.resources * progress),
        responseTime: Math.floor(targetCounts.responseTime * progress),
      })

      if (currentStep >= steps) {
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
      <Card>
        <CardContent className="pt-6 flex flex-col items-center text-center">
          <Users className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-4xl font-bold mb-2">{counts.people.toLocaleString()}</h3>
          <p className="text-muted-foreground">People Assisted</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 flex flex-col items-center text-center">
          <Home className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-4xl font-bold mb-2">{counts.shelters.toLocaleString()}</h3>
          <p className="text-muted-foreground">Shelters Coordinated</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 flex flex-col items-center text-center">
          <Package className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-4xl font-bold mb-2">{counts.resources.toLocaleString()}</h3>
          <p className="text-muted-foreground">Resources Distributed</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 flex flex-col items-center text-center">
          <Clock className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-4xl font-bold mb-2">
            {counts.responseTime}
            <span className="text-xl">min</span>
          </h3>
          <p className="text-muted-foreground">Avg. Response Time</p>
        </CardContent>
      </Card>
    </div>
  )
}


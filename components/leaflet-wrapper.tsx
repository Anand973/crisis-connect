"use client"

import dynamic from 'next/dynamic'
import React from 'react'

// This technique creates a wrapper around Leaflet components that can be safely imported
// in components without causing SSR issues
const LeafletMapWrapper = (props: { children: React.ReactNode }) => {
  return <>{props.children}</>
}

// Use dynamic import to avoid SSR issues with Leaflet
export const LeafletMap = dynamic(
  () => Promise.resolve(LeafletMapWrapper),
  {
    ssr: false
  }
)

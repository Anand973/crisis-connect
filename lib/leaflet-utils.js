"use client"

import L from 'leaflet'

// Fix for Leaflet icon issues - this needs to run only on the client side
export function fixLeafletIcons() {
  // Fix Leaflet default icon issues common in webpack/Next.js environments
  if (typeof window !== 'undefined') {
    // Only run this code on the client side
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    })
  }
}

// Create a custom div icon for crisis markers
export function createDivIcon(color, size = 20) {
  return L.divIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; border: 2px solid white;"></div>`,
    iconSize: [size, size],
  })
}

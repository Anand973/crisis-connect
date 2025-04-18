"use client"

import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import 'leaflet-defaulticon-compatibility'

const CrisisMapContent = () => {
  // Default center coordinates (can be updated based on your needs)
  const center: [number, number] = [20.5937, 78.9629] // India coordinates
  
  return (
    <div className="h-full w-full">
      <MapContainer 
        center={center} 
        zoom={5} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Add markers and other map elements here */}
      </MapContainer>
    </div>
  )
}

export default CrisisMapContent


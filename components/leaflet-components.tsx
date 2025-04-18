"use client"

import React from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix Leaflet icon issues with Next.js
const fixLeafletIcon = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  })
}

// Component to recenter map to user's location
function LocationMarker() {
  const [position, setPosition] = React.useState<L.LatLng | null>(null)
  const map = useMap()

  React.useEffect(() => {
    map.locate().on("locationfound", (e) => {
      setPosition(e.latlng)
      map.flyTo(e.latlng, map.getZoom())
    })
  }, [map])

  return position === null ? null : (
    <Marker
      position={position}
      icon={L.divIcon({
        className: "custom-icon",
        html: `<div style="background-color: #3b82f6; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center;">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="1"></circle>
                </svg>
              </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })}
    >
      <Popup>You are here</Popup>
    </Marker>
  )
}

// Custom icon creator
const createCustomIcon = (color:any) => {
  return L.divIcon({
    className: "custom-icon",
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  })
}

export function LeafletComponents(props:any) {
  const { 
    mapCenter, 
    mapZoom, 
    resources, 
    selectedResource, 
    setSelectedResource 
  } = props.LeafletComponents || {};
  // Initialize Leaflet icons on component mount
  React.useEffect(() => {
    fixLeafletIcon()
  }, [])

  return (
    <MapContainer 
      center={mapCenter} 
      zoom={mapZoom} 
      style={{ height: "100%", width: "100%" }} 
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocationMarker />

      {resources.map((resource:any) => (
        <Marker
          key={resource.id}
          position={[resource.lat, resource.lng]}
          icon={createCustomIcon(resource.color)}
          eventHandlers={{
            click: () => {
              setSelectedResource(resource)
            },
          }}
        >
          <Popup>
            <div className="p-1">
              <h3 className="font-medium">{resource.name}</h3>
              <p className="text-sm">{resource.description}</p>
              <div className="mt-2 flex justify-between">
                <button className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200">
                  Details
                </button>
                <button className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                  Request
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

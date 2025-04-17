"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin } from "lucide-react"

// Fix Leaflet icon issues with Next.js
const fixLeafletIcon = () => {
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  })
}

// Custom icons for different resource types
const createCustomIcon = (color) => {
  return L.divIcon({
    className: "custom-icon",
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  })
}

// Component to recenter map to user's location
function LocationMarker() {
  const [position, setPosition] = useState(null)
  const map = useMap()

  useEffect(() => {
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
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

// Sample resource data
const sampleResources = [
  {
    id: 1,
    type: "food",
    name: "Community Food Bank",
    description: "Providing emergency food supplies",
    lat: 40.7128,
    lng: -74.006,
    color: "#10b981", // green
  },
  {
    id: 2,
    type: "medical",
    name: "Downtown Hospital",
    description: "Medical supplies and assistance",
    lat: 40.7148,
    lng: -74.013,
    color: "#ef4444", // red
  },
  {
    id: 3,
    type: "shelter",
    name: "Emergency Shelter",
    description: "Temporary housing available",
    lat: 40.7158,
    lng: -73.998,
    color: "#8b5cf6", // purple
  },
  {
    id: 4,
    type: "water",
    name: "Water Distribution Center",
    description: "Clean water available",
    lat: 40.7118,
    lng: -74.009,
    color: "#3b82f6", // blue
  },
]

export default function MapComponent() {
  const [mapReady, setMapReady] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredResources, setFilteredResources] = useState(sampleResources)
  const [selectedResource, setSelectedResource] = useState(null)
  const [mapCenter, setMapCenter] = useState([40.7128, -74.006]) // NYC default
  const [mapZoom, setMapZoom] = useState(13)

  useEffect(() => {
    fixLeafletIcon()
    setMapReady(true)
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = sampleResources.filter(
        (resource) =>
          resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resource.type.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredResources(filtered)
    } else {
      setFilteredResources(sampleResources)
    }
  }, [searchQuery])

  const handleResourceSelect = (resource) => {
    setSelectedResource(resource)
    setMapCenter([resource.lat, resource.lng])
    setMapZoom(15)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    // In a real app, you might want to trigger a geocoding service here
    // For now, we'll just filter the resources
  }

  if (!mapReady) {
    return <div className="h-[600px] flex items-center justify-center">Loading map...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-4rem)]">
      <div className="md:col-span-1 overflow-y-auto p-4 border-r">
        <form onSubmit={handleSearchSubmit} className="mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search resources or locations..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        <div className="space-y-4 mt-4">
          <h3 className="font-medium">Available Resources</h3>
          {filteredResources.length === 0 ? (
            <p className="text-muted-foreground text-sm">No resources found matching your search.</p>
          ) : (
            filteredResources.map((resource) => (
              <div
                key={resource.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedResource?.id === resource.id ? "border-primary bg-primary/5" : "hover:bg-muted"
                }`}
                onClick={() => handleResourceSelect(resource)}
              >
                <div className="flex items-start">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-0.5"
                    style={{ backgroundColor: resource.color }}
                  >
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium">{resource.name}</h4>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">Type: {resource.type}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="md:col-span-2 h-full">
        <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: "100%", width: "100%" }} zoomControl={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <LocationMarker />

          {filteredResources.map((resource) => (
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
                    <Button size="sm" variant="outline" className="text-xs">
                      Details
                    </Button>
                    <Button size="sm" className="text-xs">
                      Request
                    </Button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}


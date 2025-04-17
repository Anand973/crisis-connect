"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

export default function CrisisMap() {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && mapRef.current) {
      // Fix Leaflet icon issues
      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      })

      // Initialize map
      const map = L.map(mapRef.current).setView([34.0522, -118.2437], 10)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      // Add sample crisis markers
      const emergencyIcon = L.divIcon({
        className: "custom-div-icon",
        html: `<div style="background-color: rgba(255, 0, 0, 0.6); width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
        iconSize: [20, 20],
      })

      const resourceIcon = L.divIcon({
        className: "custom-div-icon",
        html: `<div style="background-color: rgba(0, 128, 0, 0.6); width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
        iconSize: [20, 20],
      })

      // Sample emergency locations
      L.marker([34.052, -118.243], { icon: emergencyIcon })
        .addTo(map)
        .bindPopup("Flooding: 15 people need evacuation assistance")

      L.marker([34.076, -118.293], { icon: emergencyIcon })
        .addTo(map)
        .bindPopup("Power outage: Medical equipment support needed")

      L.marker([34.025, -118.343], { icon: emergencyIcon })
        .addTo(map)
        .bindPopup("Building damage: Temporary shelter needed for 8 families")

      // Sample resource locations
      L.marker([34.062, -118.223], { icon: resourceIcon })
        .addTo(map)
        .bindPopup("Community Center: Water, food, charging stations available")

      L.marker([34.082, -118.273], { icon: resourceIcon })
        .addTo(map)
        .bindPopup("Medical Volunteer Station: First aid and basic medical care")

      L.marker([34.045, -118.323], { icon: resourceIcon })
        .addTo(map)
        .bindPopup("Supply Distribution: Blankets, hygiene kits, baby supplies")

      // Add a simple legend
      const legend = L.control({ position: "bottomright" })
      legend.onAdd = () => {
        const div = L.DomUtil.create("div", "legend")
        div.innerHTML = `
          <div style="background: white; padding: 8px; border-radius: 4px; box-shadow: 0 0 10px rgba(0,0,0,0.2);">
            <div style="display: flex; align-items: center; margin-bottom: 5px;">
              <div style="background-color: rgba(255, 0, 0, 0.6); width: 15px; height: 15px; border-radius: 50%; margin-right: 5px; border: 1px solid white;"></div>
              <span style="font-size: 12px;">Help Needed</span>
            </div>
            <div style="display: flex; align-items: center;">
              <div style="background-color: rgba(0, 128, 0, 0.6); width: 15px; height: 15px; border-radius: 50%; margin-right: 5px; border: 1px solid white;"></div>
              <span style="font-size: 12px;">Resources Available</span>
            </div>
          </div>
        `
        return div
      }
      legend.addTo(map)

      return () => {
        map.remove()
      }
    }
  }, [])

  return <div ref={mapRef} className="h-full w-full" />
}


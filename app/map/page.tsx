import { MainNav } from "@/components/navigation"
import dynamic from "next/dynamic"

// Dynamically import the map component to avoid SSR issues with Leaflet
const MapComponentWithNoSSR = dynamic(() => import("@/components/map-component"), { ssr: false })

export default function MapPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        <MapComponentWithNoSSR />
      </main>
    </div>
  )
}


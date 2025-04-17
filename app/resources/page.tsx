import { MainNav } from "@/components/navigation"
import { ResourceCard, ResourceFilter } from "@/components/ui-components"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Filter } from "lucide-react"
import Link from "next/link"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function ResourcesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        <div className="container py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
              <p className="text-muted-foreground">Find and request resources available in your area</p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Resource
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-64 lg:w-72 hidden md:block">
              <ResourceFilter />
            </div>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
                <div className="relative w-full">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search resources..." className="w-full pl-8" />
                </div>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="md:hidden">
                      <Filter className="mr-2 h-4 w-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                      <SheetDescription>Filter resources by type, distance, and availability</SheetDescription>
                    </SheetHeader>
                    <div className="mt-4">
                      <ResourceFilter />
                    </div>
                  </SheetContent>
                </Sheet>
                <Button variant="outline" className="hidden sm:flex">
                  <Link href="/map" className="flex items-center">
                    View Map
                  </Link>
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                <ResourceCard />
                <ResourceCard
                  title="Medical Supplies"
                  location="Downtown Hospital"
                  distance="1.2 miles away"
                  category="Medical"
                />
                <ResourceCard
                  title="Emergency Shelter"
                  location="Community Center"
                  distance="0.5 miles away"
                  category="Shelter"
                />
                <ResourceCard
                  title="Water Distribution"
                  location="City Park"
                  distance="0.7 miles away"
                  category="Water"
                />
                <ResourceCard
                  title="Clothing Donations"
                  location="Church Outreach Center"
                  distance="1.5 miles away"
                  category="Clothing"
                />
                <ResourceCard
                  title="Power Station"
                  location="Public Library"
                  distance="0.9 miles away"
                  category="Electricity"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


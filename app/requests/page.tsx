import { MainNav } from "@/components/navigation"
import { RequestCard, ResourceFilter } from "@/components/ui-components"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Filter } from "lucide-react"
import Link from "next/link"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function RequestsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        <div className="container py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Requests</h1>
              <p className="text-muted-foreground">View and respond to help requests in your area</p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Request
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
                  <Input type="search" placeholder="Search requests..." className="w-full pl-8" />
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
                      <SheetDescription>Filter requests by type, distance, and urgency</SheetDescription>
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
                <RequestCard />
                <RequestCard
                  title="Need Water Supplies"
                  location="Riverside Apartments"
                  urgency="Medium"
                  description="Family of 4 needs drinking water after pipe burst"
                />
                <RequestCard
                  title="Elderly Assistance"
                  location="Sunset Retirement Home"
                  urgency="High"
                  description="Elderly residents need help evacuating due to power outage"
                />
                <RequestCard
                  title="Baby Formula Needed"
                  location="Cedar Street Apartments"
                  urgency="High"
                  description="Infant formula needed urgently for 3-month old"
                />
                <RequestCard
                  title="Transportation Help"
                  location="Westside Neighborhood"
                  urgency="Medium"
                  description="Need transportation to medical appointment for disabled person"
                />
                <RequestCard
                  title="Pet Supplies"
                  location="Oakwood Drive"
                  urgency="Low"
                  description="Need pet food and supplies for 2 dogs and 1 cat"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


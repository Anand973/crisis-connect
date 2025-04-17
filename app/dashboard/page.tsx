import { MainNav } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResourceCard } from "@/components/ui-components"
import { AlertTriangle, Package, Users, Clock, ArrowRight, MapPin, Bell } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        <div className="container py-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening in your area.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+5 since yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Resources</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">145</div>
                <p className="text-xs text-muted-foreground">+12 since yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Volunteers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32</div>
                <p className="text-xs text-muted-foreground">+2 since yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.2h</div>
                <p className="text-xs text-muted-foreground">-15min from last week</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest requests and resources in your area</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="requests">
                  <TabsList className="mb-4">
                    <TabsTrigger value="requests">Requests</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                  </TabsList>
                  <TabsContent value="requests" className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <AlertTriangle className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">Medical supplies needed</p>
                          <p className="text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <MapPin className="mr-1 h-3 w-3" /> 0.8 miles away
                            </span>
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="mt-4 text-center">
                      <Link href="/requests" className="text-sm text-primary hover:underline">
                        View all requests
                      </Link>
                    </div>
                  </TabsContent>
                  <TabsContent value="resources" className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Package className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">Food supplies available</p>
                          <p className="text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <MapPin className="mr-1 h-3 w-3" /> 1.2 miles away
                            </span>
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="mt-4 text-center">
                      <Link href="/resources" className="text-sm text-primary hover:underline">
                        View all resources
                      </Link>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Nearby Activity</CardTitle>
                <CardDescription>Crisis events and updates in your area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 items-start border-b pb-4 last:border-0 last:pb-0">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Bell className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Flash Flood Warning</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Potential flooding in downtown area. Shelter available at Community Center.
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          <Clock className="inline h-3 w-3 mr-1" /> 2 hours ago
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Nearby Resources</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            </div>
            <div className="mt-4 text-center">
              <Button asChild>
                <Link href="/map">View Map</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


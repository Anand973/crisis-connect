import Link from "next/link"
import { MapPin, AlertCircle, Users, Shield, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import CrisisMap from "@/components/crisis-map"
import AlertBanner from "@/components/alert-banner"
import ImpactMetrics from "@/components/impact-metrics"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <Link href="/" className="text-xl font-bold">
              Crisis Connect
            </Link>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#how-it-works" className="text-sm font-medium hover:text-primary">
              How It Works
            </Link>
            <Link href="#updates" className="text-sm font-medium hover:text-primary">
              Updates
            </Link>
            <Link href="#impact" className="text-sm font-medium hover:text-primary">
              Impact
            </Link>
            <Link href="#about" className="text-sm font-medium hover:text-primary">
              About
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="relative py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                    Local Help When It Matters Most
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Crisis Connect brings together those who need help with those who can provide it during emergencies
                    and disasters.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/need-help">
                    <Button size="lg" className="bg-red-600 hover:bg-red-700">
                      I Need Help
                    </Button>
                  </Link>
                  <Link href="/offer-help">
                    <Button size="lg" variant="outline">
                      I Can Help
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-full h-[400px] rounded-xl overflow-hidden border shadow-lg">
                  <CrisisMap />
                </div>
              </div>
            </div>
          </div>
        </section>

        <AlertBanner />

        <section id="how-it-works" className="py-12 md:py-16 lg:py-20 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  How Crisis Connect Works
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform connects people in need with local resources and volunteers during emergencies.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card className="border-2 border-primary/20">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Locate Resources</h3>
                  <p className="text-muted-foreground">
                    Find nearby help, supplies, and safe locations on our interactive map.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 border-primary/20">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Connect Directly</h3>
                  <p className="text-muted-foreground">
                    Communicate with volunteers and resource providers in your immediate area.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 border-primary/20">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Verified & Secure</h3>
                  <p className="text-muted-foreground">
                    Trust our verification system to ensure legitimate requests and offers.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="updates" className="py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Latest Updates</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Stay informed about ongoing crises and platform developments.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="bg-muted p-1 text-xs text-muted-foreground">
                      {new Date().toLocaleDateString()} • Crisis Update
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">
                        {i === 1
                          ? "Flood Relief Efforts Underway in Riverside County"
                          : i === 2
                            ? "Volunteers Needed for Wildfire Evacuation Centers"
                            : i === 3
                              ? "Emergency Supplies Distribution Points Updated"
                              : "New Mobile App Feature: Offline Resource Maps"}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {i === 1
                          ? "Local volunteers have established 3 new distribution centers for clean water and emergency supplies..."
                          : i === 2
                            ? "Evacuation centers are seeking volunteers to help with meal preparation and shelter organization..."
                            : i === 3
                              ? "Updated locations for emergency supply distribution have been added to the crisis map..."
                              : "Our latest app update allows users to download resource maps for offline use during connectivity issues..."}
                      </p>
                      <Link href={`/updates/${i}`} className="flex items-center text-sm text-primary">
                        Read more <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-center">
              <Link href="/updates">
                <Button variant="outline">View All Updates</Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="impact" className="py-12 md:py-16 lg:py-20 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Impact</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Crisis Connect has helped thousands of people during emergencies.
                </p>
              </div>
            </div>
            <ImpactMetrics />
            <div className="mt-12 text-center">
              <Link href="/stories">
                <Button>Read Success Stories</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 lg:py-20 border-t">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 md:gap-16 lg:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Ready to join our community of helpers?
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                  Whether you need assistance or can offer help, Crisis Connect brings communities together when it
                  matters most.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button size="lg">Sign Up Now</Button>
                  </Link>
                  <Link href="/about">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex flex-col items-start space-y-4">
                <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                  "Crisis Connect helped our family find shelter and supplies after the hurricane. The local volunteers
                  we connected with have become like family."
                </blockquote>
                <p className="font-medium">— Maria S., Hurricane Survivor</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-lg font-semibold">Crisis Connect</span>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="/about" className="text-sm hover:underline underline-offset-4">
              About
            </Link>
            <Link href="/privacy" className="text-sm hover:underline underline-offset-4">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm hover:underline underline-offset-4">
              Terms
            </Link>
            <Link href="/contact" className="text-sm hover:underline underline-offset-4">
              Contact
            </Link>
          </nav>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Crisis Connect. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}


import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import { AlertCircle, MapPin, Users, Shield, ArrowRight } from "lucide-react"
import CrisisMap from "./components/CrisisMap"
import AlertBanner from "./components/AlertBanner"
import ImpactMetrics from "./components/ImpactMetrics"
import UserRegistration from "./components/UserRegistration"
import UserProfile from "./components/UserProfile"
import Login from "./components/Login"
import ForgotPassword from "./components/ForgotPassword"
import CrisisDashboard from "./components/CrisisDashboard"
import ProtectedRoute from "./components/ProtectedRoute"
import { UserProvider } from "./context/UserContext"
import NewsFeed from "./components/NewsFeed"
import "./App.css"
import ResourceRequestForm from "./components/Neededhelp"

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-red-500" />
                <Link to="/" className="text-xl font-bold">
                  Crisis Connect
                </Link>
              </div>
              <nav className="hidden md:flex gap-6">
                <Link to="/" className="text-sm font-medium hover:text-primary">
                  Home
                </Link>
                <Link to="/dashboard" className="text-sm font-medium hover:text-primary">
                  Dashboard
                </Link>
                <Link to="/profile" className="text-sm font-medium hover:text-primary">
                  Profile
                </Link>
                <a href="#about" className="text-sm font-medium hover:text-primary">
                  About
                </a>
              </nav>
              <div className="flex items-center gap-4">
                <Link to="/login">
                  <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                    Log In
                  </button>
                </Link>
                <Link to="/register">
                  <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                    Sign Up
                  </button>
                </Link>
              </div>
            </div>
          </header>
          <main className="flex-1">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<UserRegistration />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    {/* <CrisisDashboard /> */}
                    
                    <ResourceRequestForm/>
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={
                <section className="relative py-12 md:py-16 lg:py-20">
                  <div className="container px-4 md:px-6">
                    <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
                      <div className="flex flex-col justify-center space-y-4">
                        <div className="space-y-2">
                          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                            Local Help When It Matters Most
                          </h1>
                          <p className="max-w-[600px] text-muted-foreground md:text-xl">
                            Crisis Connect brings together those who need help with those who can provide it during
                            emergencies and disasters.
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 min-[400px]:flex-row">
                          <Link to="/login">
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-600 text-primary-foreground hover:bg-red-700 h-11 px-8">
                              I Need Help
                            </button>
                          </Link>
                          <Link to="/login">
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8">
                              I Can Help
                            </button>
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
                  <div className="rounded-lg border-2 border-primary/20 bg-card text-card-foreground shadow-sm">
                    <div className="p-6 pt-6">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold">Locate Resources</h3>
                      <p className="text-muted-foreground">
                        Find nearby help, supplies, and safe locations on our interactive map.
                      </p>
                    </div>
                  </div>
                  <div className="rounded-lg border-2 border-primary/20 bg-card text-card-foreground shadow-sm">
                    <div className="p-6 pt-6">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold">Connect Directly</h3>
                      <p className="text-muted-foreground">
                        Communicate with volunteers and resource providers in your immediate area.
                      </p>
                    </div>
                  </div>
                  <div className="rounded-lg border-2 border-primary/20 bg-card text-card-foreground shadow-sm">
                    <div className="p-6 pt-6">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Shield className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold">Verified & Secure</h3>
                      <p className="text-muted-foreground">
                        Trust our verification system to ensure legitimate requests and offers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section><section id="updates" className="py-12 md:py-16 lg:py-20">
              <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Latest Updates</h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                      Stay informed about ongoing crises and platform developments.
                    </p>
                  </div>
                </div>
                <div className="mx-auto max-w-5xl py-12">
                  <NewsFeed />
                </div>
               
              </div>
            </section>
            <AlertBanner />

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
                  <Link to="/stories">
                    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                      Read Success Stories
                    </button>
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
                      <Link to="/register">
                        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8">
                          Sign Up Now
                        </button>
                      </Link>
                      <Link to="/about">
                        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8">
                          Learn More
                        </button>
                      </Link>
                    </div>
                  </div>
                  <div className="flex flex-col items-start space-y-4">
                    <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                      "Crisis Connect helped our family find shelter and supplies after the hurricane. The local
                      volunteers we connected with have become like family."
                    </blockquote>
                    <p className="font-medium">— Maria S., Hurricane Survivor</p>
                  </div>
                </div>
              </div>
            </section>

            <footer className="border-t py-6 md:py-8">
            <div className="container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              
              <nav className="flex gap-4 sm:gap-6 m-auto">
                <Link to="/about" className="text-sm hover:underline underline-offset-4">
                  About
                </Link>
                <Link to="/privacy" className="text-sm hover:underline underline-offset-4">
                  Privacy
                </Link>
                <Link to="/terms" className="text-sm hover:underline underline-offset-4">
                  Terms
                </Link>
                <Link to="/contact" className="text-sm hover:underline underline-offset-4">
                  Contact
                </Link>
              </nav>
             
            </div>
          </footer>



                </section>
                
              } />
            </Routes>

           

            

            

            

           
          </main>
          
        </div>
      </Router>
    </UserProvider>
  )
}

export default App


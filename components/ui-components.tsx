import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Phone, MessageSquare, Clock } from "lucide-react"

// Sample UI components that will be used throughout the application
export function ResourceCard({
  title = "Food Supplies",
  location = "Downtown Community Center",
  distance = "0.8 miles away",
  category = "Food",
  availability = "Available now",
  contact = "555-123-4567",
}) {
  return (
    <Card className="overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{title}</h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{location}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Clock className="h-4 w-4 mr-1" />
              <span>{distance}</span>
            </div>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {category}
          </Badge>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Badge variant="secondary" className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {availability}
          </Badge>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="bg-muted p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Provider" />
            <AvatarFallback>CC</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">Community Center</span>
        </div>
        <Button size="sm">Request</Button>
      </div>
    </Card>
  )
}

export function RequestCard({
  title = "Need Medical Supplies",
  location = "Oak Street, Apartment 4B",
  urgency = "High",
  description = "Require basic first aid supplies and medications for elderly resident",
  postedTime = "20 minutes ago",
}) {
  return (
    <Card className="overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{title}</h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{location}</span>
            </div>
          </div>
          <Badge variant={urgency === "High" ? "destructive" : urgency === "Medium" ? "default" : "outline"}>
            {urgency} Priority
          </Badge>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <div className="mt-4 flex items-center text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          <span>Posted {postedTime}</span>
        </div>
      </div>
      <div className="bg-muted p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Requester" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">John Doe</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Message
          </Button>
          <Button size="sm">Offer Help</Button>
        </div>
      </div>
    </Card>
  )
}

export function ResourceFilter() {
  return (
    <div className="flex flex-col gap-4 p-4 bg-card rounded-lg border shadow-sm">
      <h3 className="font-medium">Filter Resources</h3>
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium mb-1 block">Resource Type</label>
          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Resources</SelectItem>
              <SelectItem value="food">Food</SelectItem>
              <SelectItem value="medical">Medical</SelectItem>
              <SelectItem value="shelter">Shelter</SelectItem>
              <SelectItem value="transport">Transportation</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Distance</label>
          <Select defaultValue="5">
            <SelectTrigger>
              <SelectValue placeholder="Select distance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Within 1 mile</SelectItem>
              <SelectItem value="5">Within 5 miles</SelectItem>
              <SelectItem value="10">Within 10 miles</SelectItem>
              <SelectItem value="25">Within 25 miles</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Availability</label>
          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Select availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="now">Available Now</SelectItem>
              <SelectItem value="today">Available Today</SelectItem>
              <SelectItem value="tomorrow">Available Tomorrow</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="w-full">Apply Filters</Button>
      </div>
    </div>
  )
}


"use client"

import { useState } from "react"
import { BarChart, Bell, Calendar, Home, Menu, MessageSquare, Search, Settings, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatCard } from "./stat-card"
import { UserNav } from "./user-nav"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-2 text-lg font-medium">
              <Button variant="ghost" className="justify-start gap-2">
                <Home className="h-5 w-5" />
                Dashboard
              </Button>
              <Button variant="ghost" className="justify-start gap-2">
                <Users className="h-5 w-5" />
                Users
              </Button>
              <Button variant="ghost" className="justify-start gap-2">
                <MessageSquare className="h-5 w-5" />
                Messages
              </Button>
              <Button variant="ghost" className="justify-start gap-2">
                <BarChart className="h-5 w-5" />
                Analytics
              </Button>
              <Button variant="ghost" className="justify-start gap-2">
                <Calendar className="h-5 w-5" />
                Calendar
              </Button>
              <Button variant="ghost" className="justify-start gap-2">
                <Settings className="h-5 w-5" />
                Settings
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <form className="hidden md:flex">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search..." className="w-64 rounded-lg bg-background pl-8" />
            </div>
          </form>
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              3
            </span>
            <span className="sr-only">Notifications</span>
          </Button>
          <UserNav />
        </div>
      </header>
      <main className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline">Download</Button>
            <Button>Create New</Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Total Revenue" value="$45,231.89" description="+20.1% from last month" trend="up" />
              <StatCard title="Subscriptions" value="2,350" description="+180.1% from last month" trend="up" />
              <StatCard title="Active Users" value="1,893" description="+19% from last month" trend="up" />
              <StatCard title="Bounce Rate" value="12.5%" description="-3.4% from last month" trend="down" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>You made 265 sales this month.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] rounded-lg bg-muted/30"></div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>You had 12 activities today.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-muted/50"></div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">User {i} completed a task</p>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View all
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>View your analytics data and insights.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] rounded-lg bg-muted/30"></div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>View and download your reports.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Report #{i}</p>
                        <p className="text-xs text-muted-foreground">Generated on {new Date().toLocaleDateString()}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage your notification settings.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Email notifications", "Push notifications", "Monthly newsletter", "Marketing emails"].map(
                    (item, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <p className="text-sm font-medium">{item}</p>
                          <p className="text-xs text-muted-foreground">
                            Receive notifications about updates and features.
                          </p>
                        </div>
                        <div className="h-6 w-10 rounded-full bg-primary"></div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <p>© 2024 Dashboard Inc. All rights reserved.</p>
      </footer>
    </div>
  )
}


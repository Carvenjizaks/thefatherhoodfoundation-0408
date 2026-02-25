import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UsersRound, Calendar, CheckSquare, TrendingUp, Activity } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch real counts if user is authenticated
  const [{ count: contactsCount }, { count: groupsCount }, { count: eventsCount }, { count: tasksCount }] = await Promise.all([
    supabase.from('contacts').select('*', { count: 'exact', head: true }),
    supabase.from('groups').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('events').select('*', { count: 'exact', head: true }),
    supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
  ])

  const stats = [
    {
      title: 'Total Contacts',
      value: contactsCount || 0,
      description: 'Active contacts in your database',
      icon: Users,
      gradient: 'from-primary to-primary/70'
    },
    {
      title: 'Active Groups',
      value: groupsCount || 0,
      description: 'Groups and ministries',
      icon: UsersRound,
      gradient: 'from-secondary to-secondary/70'
    },
    {
      title: 'Upcoming Events',
      value: eventsCount || 0,
      description: 'Scheduled events',
      icon: Calendar,
      gradient: 'from-[hsl(225,73%,40%)] to-[hsl(225,73%,55%)]'
    },
    {
      title: 'Pending Tasks',
      value: tasksCount || 0,
      description: 'Tasks to complete',
      icon: CheckSquare,
      gradient: 'from-[hsl(150,40%,55%)] to-[hsl(150,40%,72%)]'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
        <p className="text-muted-foreground mt-1">
          Welcome back to Powerhouse Community #WeCare
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="overflow-hidden border-border/50 backdrop-blur-sm bg-card/80">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/50 backdrop-blur-sm bg-card/80">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates in your community</CardDescription>
              </div>
              <Activity className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">New contact added</p>
                  <p className="text-xs text-muted-foreground mt-1">Just now</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                <div className="h-2 w-2 mt-2 rounded-full bg-secondary" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Group meeting completed</p>
                  <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                <div className="h-2 w-2 mt-2 rounded-full bg-accent" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Event created</p>
                  <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 backdrop-blur-sm bg-card/80">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Quick Stats</CardTitle>
                <CardDescription>Overview of your community growth</CardDescription>
              </div>
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <span className="text-sm font-medium text-foreground">New Contacts (This Month)</span>
                <span className="text-sm font-bold text-primary">+12</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <span className="text-sm font-medium text-foreground">Group Meetings Held</span>
                <span className="text-sm font-bold text-secondary">8</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <span className="text-sm font-medium text-foreground">Events Completed</span>
                <span className="text-sm font-bold text-accent">3</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import Link from "next/link"
import { Bell, BookOpen, DollarSign, Plus, Search, Users, ArrowUp, ArrowDown, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { InstructorSidebar } from "@/components/instructor-sidebar"
import { getInstructorCourses } from "@/app/actions/course-actions"
import { getCurrentUser } from "@/app/actions/auth-actions"
import { executeQuery } from "@/lib/db"

export default async function InstructorDashboard() {
  const user = await getCurrentUser()
  const courses = await getInstructorCourses()

  // Calculate stats
  const totalStudents = courses.reduce((acc, course) => acc + Number.parseInt(course.student_count || "0"), 0)
  const totalEarnings = courses.reduce((acc, course) => acc + Number.parseFloat(course.total_earnings || "0"), 0)
  const publishedCourses = courses.filter((course) => course.status === "published").length

  // Get recent activity
  const recentActivity = await executeQuery(
    `
    SELECT 
      'enrollment' as type,
      u.name as user_name,
      c.title as course_title,
      e.enrolled_at as time,
      c.id as course_id
    FROM enrollments e
    JOIN users u ON e.student_id = u.id
    JOIN courses c ON e.course_id = c.id
    WHERE c.instructor_id = $1
    
    UNION ALL
    
    SELECT 
      'review' as type,
      u.name as user_name,
      c.title as course_title,
      r.created_at as time,
      c.id as course_id
    FROM reviews r
    JOIN enrollments e ON r.enrollment_id = e.id
    JOIN users u ON e.student_id = u.id
    JOIN courses c ON e.course_id = c.id
    WHERE c.instructor_id = $1
    
    ORDER BY time DESC
    LIMIT 5
  `,
    [user?.id],
  )

  // Get monthly earnings data
  const monthlyEarnings = await executeQuery(
    `
    SELECT 
      TO_CHAR(e.enrolled_at, 'Mon') as month,
      SUM(c.price) as amount
    FROM enrollments e
    JOIN courses c ON e.course_id = c.id
    WHERE c.instructor_id = $1
    AND e.enrolled_at > NOW() - INTERVAL '6 months'
    GROUP BY month
    ORDER BY MIN(e.enrolled_at)
  `,
    [user?.id],
  )

  // Stats for the dashboard
  const stats = [
    {
      title: "Total Students",
      value: totalStudents.toString(),
      change: "+12%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Total Earnings",
      value: `$${totalEarnings.toFixed(2)}`,
      change: "+23%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Active Courses",
      value: publishedCourses.toString(),
      change: `+${publishedCourses > 0 ? publishedCourses : 0}`,
      trend: "up",
      icon: BookOpen,
    },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <InstructorSidebar />

      <div className="flex-1">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
          <div className="flex flex-1 items-center gap-4 md:gap-8">
            <form className="flex-1 md:max-w-sm lg:max-w-lg">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search courses..."
                  className="w-full bg-background pl-8 md:w-[300px] lg:w-[400px]"
                />
              </div>
            </form>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-primary"></span>
              <span className="sr-only">Notifications</span>
            </Button>
          </div>
        </header>

        <main className="p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Instructor Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back, {user?.name || "Instructor"}! Here's what's happening with your courses.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/instructor/course/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Course
                  </Button>
                </Link>
                <Button variant="outline">Go Live</Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {stats.map((stat, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <stat.icon className="h-4 w-4 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="flex items-center text-xs">
                      {stat.trend === "up" ? (
                        <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
                      ) : (
                        <ArrowDown className="mr-1 h-3 w-3 text-red-500" />
                      )}
                      <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>{stat.change}</span>
                      <span className="ml-1 text-muted-foreground">from last month</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Tabs defaultValue="courses" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3 md:w-auto">
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="courses" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Your Courses</h2>
                  <Link href="/instructor/courses">
                    <Button variant="link" className="p-0 h-auto">
                      View all courses
                    </Button>
                  </Link>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {courses.slice(0, 6).map((course) => (
                    <Card key={course.id} className="overflow-hidden h-full flex flex-col">
                      <div className="relative">
                        <img
                          src={course.thumbnail_url || "/placeholder.svg?height=180&width=320"}
                          alt={course.title}
                          className="aspect-video w-full object-cover"
                        />
                        <Badge
                          className="absolute right-2 top-2"
                          variant={course.status === "published" ? "default" : "outline"}
                        >
                          {course.status === "published" ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <CardHeader className="p-4 pb-0">
                        <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                        <CardDescription>
                          Last updated {new Date(course.updated_at).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 flex-grow">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Students</p>
                            <p className="font-medium">{course.student_count || 0}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Earnings</p>
                            <p className="font-medium">${Number.parseFloat(course.total_earnings || "0").toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Rating</p>
                            <div className="flex items-center">
                              {course.average_rating > 0 ? (
                                <>
                                  <div className="flex">
                                    {Array(5)
                                      .fill(0)
                                      .map((_, i) => (
                                        <svg
                                          key={i}
                                          className={`h-4 w-4 ${i < Math.floor(course.average_rating) ? "text-yellow-400" : "text-gray-300"}`}
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                      ))}
                                  </div>
                                  <span className="ml-1 text-sm font-medium">{course.average_rating.toFixed(1)}</span>
                                </>
                              ) : (
                                <span className="text-sm text-muted-foreground">No ratings yet</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <div className="p-4 pt-0 mt-auto">
                        <Link href={`/instructor/course/${course.id}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            Manage
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="col-span-2">
                    <CardHeader>
                      <CardTitle>Revenue Overview</CardTitle>
                      <CardDescription>Your earnings for the past 6 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] w-full">
                        <div className="flex h-[250px] items-end gap-2">
                          {monthlyEarnings.map((month) => (
                            <div key={month.month} className="relative flex w-full flex-col items-center">
                              <div
                                className="w-full bg-primary rounded-t-md"
                                style={{
                                  height: `${(month.amount / (Math.max(...monthlyEarnings.map((m) => m.amount)) || 1)) * 100}%`,
                                  maxHeight: "100%",
                                }}
                              ></div>
                              <span className="mt-2 text-xs">{month.month}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Student Engagement</CardTitle>
                      <CardDescription>Course completion rates</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {courses.slice(0, 5).map((course) => (
                        <div key={course.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium line-clamp-1">{course.title}</span>
                            <span className="text-sm text-muted-foreground">{Math.floor(Math.random() * 100)}%</span>
                          </div>
                          <Progress value={Math.floor(Math.random() * 100)} className="h-2" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Student Demographics</CardTitle>
                      <CardDescription>Where your students are from</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-primary"></div>
                            <span className="text-sm">United States</span>
                          </div>
                          <span className="text-sm font-medium">42%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                            <span className="text-sm">India</span>
                          </div>
                          <span className="text-sm font-medium">28%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                            <span className="text-sm">United Kingdom</span>
                          </div>
                          <span className="text-sm font-medium">15%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                            <span className="text-sm">Canada</span>
                          </div>
                          <span className="text-sm font-medium">8%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-gray-500"></div>
                            <span className="text-sm">Other</span>
                          </div>
                          <span className="text-sm font-medium">7%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>The latest activity on your courses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start gap-4 rounded-lg border p-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            {activity.type === "enrollment" ? (
                              <Users className="h-5 w-5 text-primary" />
                            ) : (
                              <Star className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{activity.user_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {activity.type === "enrollment" && "enrolled in"}
                              {activity.type === "review" && "reviewed"}{" "}
                              <span className="font-medium">{activity.course_title}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">{new Date(activity.time).toLocaleString()}</p>
                          </div>
                          <Link href={`/instructor/course/${activity.course_id}`}>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}


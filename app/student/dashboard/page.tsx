"use client"

import Link from "next/link"
import { Bell, Bookmark, ChevronDown, Filter, Search, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StudentSidebar } from "@/components/student-sidebar"
import { Progress } from "@/components/ui/progress"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { motion } from "framer-motion"

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
}

async function getEnrolledCourses(userId: string) {
  try {
    // Example query - adjust according to your actual schema
    const enrolledCoursesData = await db.execute(
      `
      SELECT 
        c.id, 
        c.title, 
        c.thumbnail_url as "thumbnailUrl", 
        u.name as "instructorName", 
        cp.progress, 
        cp.last_accessed as "lastAccessed"
      FROM courses c
      JOIN users u ON c.instructor_id = u.id
      JOIN course_progress cp ON c.id = cp.course_id
      WHERE cp.student_id = $1
      ORDER BY cp.last_accessed DESC
      LIMIT 10
      `,
      [userId],
    )

    return enrolledCoursesData.rows || []
  } catch (error) {
    console.error("Error fetching enrolled courses:", error)
    return []
  }
}

async function getRecommendedCourses() {
  try {
    // Example query for recommended courses
    const recommendedCoursesData = await db.execute(
      `
      SELECT 
        c.id, 
        c.title, 
        c.thumbnail_url as "thumbnailUrl", 
        u.name as "instructorName",
        c.price,
        c.category,
        c.created_at as "createdAt",
        COALESCE(AVG(r.rating), 0) as "averageRating"
      FROM courses c
      JOIN users u ON c.instructor_id = u.id
      LEFT JOIN reviews r ON c.id = r.course_id
      WHERE c.status = 'published'
      GROUP BY c.id, u.name
      ORDER BY c.created_at DESC
      LIMIT 6
      `,
    )

    return recommendedCoursesData.rows || []
  } catch (error) {
    console.error("Error fetching recommended courses:", error)
    return []
  }
}

async function getPopularCourses() {
  try {
    // Example query for popular courses
    const popularCoursesData = await db.execute(
      `
      SELECT 
        c.id, 
        c.title, 
        c.thumbnail_url as "thumbnailUrl", 
        u.name as "instructorName",
        c.price,
        c.category,
        COUNT(e.id) as "studentCount",
        COALESCE(AVG(r.rating), 0) as "averageRating"
      FROM courses c
      JOIN users u ON c.instructor_id = u.id
      LEFT JOIN enrollments e ON c.id = e.course_id
      LEFT JOIN reviews r ON c.id = r.course_id
      WHERE c.status = 'published'
      GROUP BY c.id, u.name
      ORDER BY COUNT(e.id) DESC
      LIMIT 6
      `,
    )

    return popularCoursesData.rows || []
  } catch (error) {
    console.error("Error fetching popular courses:", error)
    return []
  }
}

export default async function StudentDashboard() {
  const { userId } = auth()

  if (!userId) {
    return <div>Unauthorized</div>
  }

  // Fetch user data and courses
  const userData = await db.execute(`SELECT * FROM users WHERE id = $1`, [userId])
  const user = userData.rows[0]

  const enrolledCourses = await getEnrolledCourses(userId)
  const recommendedCourses = await getRecommendedCourses()
  const popularCourses = await getPopularCourses()

  const categories = [
    "All Categories",
    "Programming",
    "Business",
    "Marketing",
    "Design",
    "Data Science",
    "Photography",
    "Finance",
    "Other",
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <StudentSidebar />

      <div className="flex-1">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
          <div className="flex flex-1 items-center gap-4 md:gap-8">
            <form className="flex-1 md:max-w-sm lg:max-w-lg">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search courses..."
                  className="w-full bg-background pl-8 md:w-[300px] lg:w-[400px] border-primary/20 focus-visible:border-primary focus-visible:ring-primary/20"
                />
              </div>
            </form>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="hidden md:flex gap-1 border-primary/20 hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Filter className="h-4 w-4" />
                  All Categories
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {categories.map((category) => (
                  <DropdownMenuItem key={category}>{category}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              <span className="sr-only">Notifications</span>
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6">
          <motion.div className="mb-8" initial="hidden" animate="visible" variants={fadeInUp} custom={0}>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name || "Student"}!</h1>
            <p className="text-muted-foreground">Continue learning or explore new courses.</p>
          </motion.div>

          {enrolledCourses.length > 0 && (
            <motion.div className="mb-8" initial="hidden" animate="visible" variants={fadeInUp} custom={1}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  Continue Learning
                  <Badge className="ml-2 bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                    {enrolledCourses.length}
                  </Badge>
                </h2>
                <Link href="/student/my-courses">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 text-primary hover:bg-transparent hover:text-primary/80 transition-colors"
                  >
                    View all my courses
                  </Button>
                </Link>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                {enrolledCourses.slice(0, 2).map((course, index) => (
                  <motion.div key={course.id} initial="hidden" animate="visible" variants={fadeInUp} custom={index + 2}>
                    <Link href={`/student/course/${course.id}`}>
                      <Card className="overflow-hidden transition-all hover:shadow-md border-primary/10 hover:border-primary/30 group">
                        <div className="flex flex-col md:flex-row">
                          <div className="w-full md:w-1/3 overflow-hidden">
                            <img
                              src={course.thumbnailUrl || "/placeholder.svg?height=180&width=320"}
                              alt={course.title}
                              className="h-full w-full object-cover aspect-video md:aspect-square group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex flex-col justify-between p-4 w-full md:w-2/3">
                            <div>
                              <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                                {course.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">{course.instructorName}</p>
                              <div className="mt-2">
                                <div className="flex items-center justify-between text-sm mb-1">
                                  <span>{course.progress || 0}% complete</span>
                                  <span className="text-xs text-muted-foreground">
                                    Last accessed {course.lastAccessed || "recently"}
                                  </span>
                                </div>
                                <Progress
                                  value={course.progress || 0}
                                  className="h-2 bg-primary/10"
                                  indicatorClassName="bg-primary"
                                />
                              </div>
                            </div>
                            <Button
                              size="sm"
                              className="mt-4 w-full md:w-auto bg-primary hover:bg-primary/90 transition-colors group-hover:shadow-md"
                            >
                              Continue Learning
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div className="space-y-6" initial="hidden" animate="visible" variants={fadeInUp} custom={4}>
            <Tabs defaultValue="recommended" className="space-y-6">
              <div className="flex items-center justify-between">
                <TabsList className="bg-primary/5 p-1">
                  <TabsTrigger
                    value="recommended"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Recommended
                  </TabsTrigger>
                  <TabsTrigger
                    value="popular"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                  >
                    Popular
                  </TabsTrigger>
                  <TabsTrigger
                    value="new"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                  >
                    New
                  </TabsTrigger>
                </TabsList>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex border-primary/20 text-primary hover:bg-primary/10 transition-colors"
                >
                  <Bookmark className="mr-2 h-4 w-4" />
                  Saved Courses
                </Button>
              </div>

              <TabsContent value="recommended" className="mt-6 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {recommendedCourses.map((course, index) => (
                    <motion.div
                      key={course.id}
                      initial="hidden"
                      animate="visible"
                      variants={fadeInUp}
                      custom={index + 5}
                    >
                      <Link href={`/student/course/${course.id}`}>
                        <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col border-primary/10 hover:border-primary/30 group">
                          <div className="relative overflow-hidden">
                            <img
                              src={course.thumbnailUrl || "/placeholder.svg?height=180&width=320"}
                              alt={course.title}
                              className="aspect-video w-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {new Date(course.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                              <Badge className="absolute top-2 left-2 bg-primary">New</Badge>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                          <CardContent className="p-4 flex-grow">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                                  {course.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">{course.instructorName}</p>
                              </div>
                              <Badge variant="outline" className="border-primary/20 text-primary">
                                {course.category}
                              </Badge>
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              <div className="flex items-center">
                                {Array(5)
                                  .fill(0)
                                  .map((_, i) => (
                                    <svg
                                      key={i}
                                      className={`h-4 w-4 ${i < Math.floor(course.averageRating || 0) ? "text-yellow-400" : "text-gray-300"}`}
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                              </div>
                              <span className="text-sm font-medium">{(course.averageRating || 0).toFixed(1)}</span>
                            </div>
                          </CardContent>
                          <CardFooter className="flex items-center justify-between p-4 pt-0 mt-auto">
                            <span className="font-bold">${course.price || 0}</span>
                            <Button
                              size="sm"
                              className="bg-primary hover:bg-primary/90 transition-colors group-hover:shadow-md"
                            >
                              Enroll Now
                            </Button>
                          </CardFooter>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="popular" className="mt-6 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {popularCourses.map((course, index) => (
                    <motion.div
                      key={course.id}
                      initial="hidden"
                      animate="visible"
                      variants={fadeInUp}
                      custom={index + 5}
                    >
                      <Link href={`/student/course/${course.id}`}>
                        <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col border-primary/10 hover:border-primary/30 group">
                          <div className="relative overflow-hidden">
                            <img
                              src={course.thumbnailUrl || "/placeholder.svg?height=180&width=320"}
                              alt={course.title}
                              className="aspect-video w-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {course.studentCount > 1000 && (
                              <Badge className="absolute top-2 left-2 bg-orange-500">Popular</Badge>
                            )}
                          </div>
                          <CardContent className="p-4 flex-grow">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                                  {course.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">{course.instructorName}</p>
                              </div>
                              <Badge variant="outline" className="border-primary/20 text-primary">
                                {course.category}
                              </Badge>
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              <div className="flex items-center">
                                {Array(5)
                                  .fill(0)
                                  .map((_, i) => (
                                    <svg
                                      key={i}
                                      className={`h-4 w-4 ${i < Math.floor(course.averageRating || 0) ? "text-yellow-400" : "text-gray-300"}`}
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                              </div>
                              <span className="text-sm font-medium">{(course.averageRating || 0).toFixed(1)}</span>
                            </div>
                          </CardContent>
                          <CardFooter className="flex items-center justify-between p-4 pt-0 mt-auto">
                            <span className="font-bold">${course.price || 0}</span>
                            <Button
                              size="sm"
                              className="bg-primary hover:bg-primary/90 transition-colors group-hover:shadow-md"
                            >
                              Enroll Now
                            </Button>
                          </CardFooter>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="new" className="mt-6 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {recommendedCourses
                    .filter((course) => new Date(course.createdAt) > new Date(Date.now() - 14 * 24 * 60 * 60 * 1000))
                    .map((course, index) => (
                      <motion.div
                        key={course.id}
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        custom={index + 5}
                      >
                        <Link href={`/student/course/${course.id}`}>
                          <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col border-primary/10 hover:border-primary/30 group">
                            <div className="relative overflow-hidden">
                              <img
                                src={course.thumbnailUrl || "/placeholder.svg?height=180&width=320"}
                                alt={course.title}
                                className="aspect-video w-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <Badge className="absolute top-2 left-2 bg-primary">New</Badge>
                            </div>
                            <CardContent className="p-4 flex-grow">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                                    {course.title}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">{course.instructorName}</p>
                                </div>
                                <Badge variant="outline" className="border-primary/20 text-primary">
                                  {course.category}
                                </Badge>
                              </div>
                              <div className="mt-2 flex items-center gap-2">
                                <div className="flex items-center">
                                  {Array(5)
                                    .fill(0)
                                    .map((_, i) => (
                                      <svg
                                        key={i}
                                        className={`h-4 w-4 ${i < Math.floor(course.averageRating || 0) ? "text-yellow-400" : "text-gray-300"}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                    ))}
                                </div>
                                <span className="text-sm font-medium">{(course.averageRating || 0).toFixed(1)}</span>
                              </div>
                            </CardContent>
                            <CardFooter className="flex items-center justify-between p-4 pt-0 mt-auto">
                              <span className="font-bold">${course.price || 0}</span>
                              <Button
                                size="sm"
                                className="bg-primary hover:bg-primary/90 transition-colors group-hover:shadow-md"
                              >
                                Enroll Now
                              </Button>
                            </CardFooter>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </main>
      </div>
    </div>
  )
}


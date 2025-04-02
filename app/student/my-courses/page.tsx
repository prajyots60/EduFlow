"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Filter, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { StudentSidebar } from "@/components/student-sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for enrolled courses
const enrolledCourses = [
  {
    id: 1,
    title: "Python Programming: Zero to Hero",
    instructor: "Alex Johnson",
    thumbnail: "/placeholder.svg?height=180&width=320",
    progress: 65,
    lastAccessed: "2 days ago",
    category: "Programming",
    totalLessons: 42,
    completedLessons: 27,
  },
  {
    id: 2,
    title: "UI/UX Design Principles",
    instructor: "Emma Wilson",
    thumbnail: "/placeholder.svg?height=180&width=320",
    progress: 32,
    lastAccessed: "1 week ago",
    category: "Design",
    totalLessons: 36,
    completedLessons: 12,
  },
  {
    id: 3,
    title: "Digital Marketing Fundamentals",
    instructor: "Michael Chen",
    thumbnail: "/placeholder.svg?height=180&width=320",
    progress: 78,
    lastAccessed: "Yesterday",
    category: "Marketing",
    totalLessons: 28,
    completedLessons: 22,
  },
  {
    id: 4,
    title: "Introduction to Data Science",
    instructor: "Sarah Miller",
    thumbnail: "/placeholder.svg?height=180&width=320",
    progress: 45,
    lastAccessed: "3 days ago",
    category: "Data Science",
    totalLessons: 32,
    completedLessons: 14,
  },
  {
    id: 5,
    title: "Business Strategy Masterclass",
    instructor: "Lisa Thompson",
    thumbnail: "/placeholder.svg?height=180&width=320",
    progress: 12,
    lastAccessed: "2 weeks ago",
    category: "Business",
    totalLessons: 24,
    completedLessons: 3,
  },
]

const completedCourses = [
  {
    id: 6,
    title: "HTML & CSS Fundamentals",
    instructor: "David Brown",
    thumbnail: "/placeholder.svg?height=180&width=320",
    completedDate: "Jan 15, 2025",
    category: "Programming",
    certificate: true,
  },
  {
    id: 7,
    title: "Photography Basics",
    instructor: "Jessica Lee",
    thumbnail: "/placeholder.svg?height=180&width=320",
    completedDate: "Dec 10, 2024",
    category: "Photography",
    certificate: true,
  },
]

const categories = ["All Categories", "Programming", "Business", "Marketing", "Design", "Data Science", "Photography"]

export default function MyCoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredEnrolledCourses = enrolledCourses.filter((course) => {
    if (selectedCategory !== "All Categories" && course.category !== selectedCategory) {
      return false
    }
    if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    return true
  })

  const filteredCompletedCourses = completedCourses.filter((course) => {
    if (selectedCategory !== "All Categories" && course.category !== selectedCategory) {
      return false
    }
    if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    return true
  })

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
                  placeholder="Search your courses..."
                  className="w-full bg-background pl-8 md:w-[300px] lg:w-[400px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="hidden md:flex gap-1">
                  <Filter className="h-4 w-4" />
                  {selectedCategory}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {categories.map((category) => (
                  <DropdownMenuItem key={category} onClick={() => setSelectedCategory(category)}>
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">My Courses</h1>
            <p className="text-muted-foreground">Track your progress and continue learning.</p>
          </div>

          <Tabs defaultValue="in-progress" className="space-y-6">
            <TabsList>
              <TabsTrigger value="in-progress">In Progress ({filteredEnrolledCourses.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({filteredCompletedCourses.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="in-progress" className="space-y-6">
              {filteredEnrolledCourses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-muted-foreground mb-4">No courses found matching your criteria.</p>
                  <Button asChild variant="outline">
                    <Link href="/student/explore">Browse Courses</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {filteredEnrolledCourses.map((course) => (
                    <Link href={`/student/course/${course.id}`} key={course.id}>
                      <Card className="overflow-hidden transition-all hover:shadow-md h-full">
                        <div className="flex flex-col md:flex-row h-full">
                          <div className="w-full md:w-1/3">
                            <img
                              src={course.thumbnail || "/placeholder.svg"}
                              alt={course.title}
                              className="h-full w-full object-cover aspect-video md:aspect-square"
                            />
                          </div>
                          <div className="flex flex-col justify-between p-4 w-full md:w-2/3">
                            <div>
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold line-clamp-1">{course.title}</h3>
                                <Badge variant="outline">{course.category}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{course.instructor}</p>
                              <div className="mt-3">
                                <div className="flex items-center justify-between text-sm mb-1">
                                  <span>{course.progress}% complete</span>
                                  <span className="text-xs text-muted-foreground">
                                    {course.completedLessons}/{course.totalLessons} lessons
                                  </span>
                                </div>
                                <Progress value={course.progress} className="h-2" />
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">Last accessed {course.lastAccessed}</p>
                            </div>
                            <Button size="sm" className="mt-4 w-full">
                              Continue Learning
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-6">
              {filteredCompletedCourses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-muted-foreground mb-4">No completed courses found matching your criteria.</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {filteredCompletedCourses.map((course) => (
                    <Link href={`/student/course/${course.id}`} key={course.id}>
                      <Card className="overflow-hidden transition-all hover:shadow-md h-full">
                        <div className="flex flex-col md:flex-row h-full">
                          <div className="w-full md:w-1/3">
                            <img
                              src={course.thumbnail || "/placeholder.svg"}
                              alt={course.title}
                              className="h-full w-full object-cover aspect-video md:aspect-square"
                            />
                          </div>
                          <div className="flex flex-col justify-between p-4 w-full md:w-2/3">
                            <div>
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold line-clamp-1">{course.title}</h3>
                                <Badge variant="outline">{course.category}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{course.instructor}</p>
                              <div className="mt-3 flex items-center">
                                <Badge className="bg-green-500">Completed</Badge>
                                <span className="text-xs text-muted-foreground ml-2">on {course.completedDate}</span>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button size="sm" variant="outline" className="flex-1">
                                Review Course
                              </Button>
                              {course.certificate && (
                                <Button size="sm" className="flex-1">
                                  View Certificate
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}


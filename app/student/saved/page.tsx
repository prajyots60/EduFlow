"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Bookmark, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StudentSidebar } from "@/components/student-sidebar"

// Mock data for saved courses
const savedCourses = [
  {
    id: 1,
    title: "Advanced React Patterns",
    instructor: "Dan Johnson",
    thumbnail: "/placeholder.svg?height=180&width=320",
    rating: 4.9,
    price: 69.99,
    category: "Programming",
    savedDate: "2 days ago",
  },
  {
    id: 2,
    title: "UX Research Fundamentals",
    instructor: "Sarah Miller",
    thumbnail: "/placeholder.svg?height=180&width=320",
    rating: 4.7,
    price: 49.99,
    category: "Design",
    savedDate: "1 week ago",
  },
  {
    id: 3,
    title: "Digital Marketing Strategy",
    instructor: "Michael Chen",
    thumbnail: "/placeholder.svg?height=180&width=320",
    rating: 4.8,
    price: 59.99,
    category: "Marketing",
    savedDate: "3 days ago",
  },
  {
    id: 4,
    title: "Data Visualization with D3.js",
    instructor: "Emily Rodriguez",
    thumbnail: "/placeholder.svg?height=180&width=320",
    rating: 4.6,
    price: 54.99,
    category: "Data Science",
    savedDate: "2 weeks ago",
  },
]

export default function SavedCoursesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCourses = savedCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
                  placeholder="Search saved courses..."
                  className="w-full bg-background pl-8 md:w-[300px] lg:w-[400px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Saved Courses</h1>
            <p className="text-muted-foreground">Courses you've bookmarked for later.</p>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Bookmark className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">No saved courses found</h3>
              <p className="text-muted-foreground mb-4">
                Try a different search or explore courses to save some for later.
              </p>
              <Button asChild>
                <Link href="/student/explore">Explore Courses</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => (
                <Link href={`/student/course/${course.id}`} key={course.id}>
                  <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
                    <div className="relative">
                      <img
                        src={course.thumbnail || "/placeholder.svg"}
                        alt={course.title}
                        className="aspect-video w-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                          onClick={(e) => {
                            e.preventDefault()
                            // Remove from saved (would be implemented in a real app)
                          }}
                        >
                          <Bookmark className="h-4 w-4 fill-primary text-primary" />
                        </Button>
                      </div>
                      <Badge className="absolute bottom-2 left-2 text-xs">Saved {course.savedDate}</Badge>
                    </div>
                    <CardContent className="p-4 flex-grow">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold line-clamp-2">{course.title}</h3>
                          <p className="text-sm text-muted-foreground">{course.instructor}</p>
                        </div>
                        <Badge variant="outline">{course.category}</Badge>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1 text-sm font-medium">{course.rating}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between p-4 pt-0 mt-auto">
                      <span className="font-bold">${course.price}</span>
                      <Button size="sm">Enroll Now</Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}


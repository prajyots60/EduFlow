"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Filter, ChevronDown, BookOpen, Users, Clock, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { StudentSidebar } from "@/components/student-sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

// Mock data for courses
const allCourses = [
  {
    id: 1,
    title: "Introduction to Web Development",
    instructor: "Sarah Johnson",
    thumbnail: "/placeholder.svg?height=180&width=320",
    rating: 4.8,
    price: 49.99,
    category: "Programming",
    level: "Beginner",
    duration: "10 hours",
    students: 1245,
    isNew: true,
  },
  {
    id: 2,
    title: "Digital Marketing Fundamentals",
    instructor: "Michael Chen",
    thumbnail: "/placeholder.svg?height=180&width=320",
    rating: 4.6,
    price: 39.99,
    category: "Marketing",
    level: "Beginner",
    duration: "8 hours",
    students: 980,
  },
  {
    id: 3,
    title: "Data Science Essentials",
    instructor: "Emily Rodriguez",
    thumbnail: "/placeholder.svg?height=180&width=320",
    rating: 4.9,
    price: 59.99,
    category: "Data Science",
    level: "Intermediate",
    duration: "15 hours",
    students: 765,
    isNew: true,
  },
  {
    id: 4,
    title: "Graphic Design for Beginners",
    instructor: "David Kim",
    thumbnail: "/placeholder.svg?height=180&width=320",
    rating: 4.7,
    price: 44.99,
    category: "Design",
    level: "Beginner",
    duration: "12 hours",
    students: 1120,
  },
  {
    id: 5,
    title: "Business Strategy Masterclass",
    instructor: "Lisa Thompson",
    thumbnail: "/placeholder.svg?height=180&width=320",
    rating: 4.5,
    price: 69.99,
    category: "Business",
    level: "Advanced",
    duration: "20 hours",
    students: 540,
  },
  {
    id: 6,
    title: "Mobile App Development with React Native",
    instructor: "James Wilson",
    thumbnail: "/placeholder.svg?height=180&width=320",
    rating: 4.8,
    price: 54.99,
    category: "Programming",
    level: "Intermediate",
    duration: "18 hours",
    students: 890,
  },
  {
    id: 7,
    title: "Machine Learning Fundamentals",
    instructor: "Robert Zhang",
    thumbnail: "/placeholder.svg?height=180&width=320",
    rating: 4.9,
    price: 79.99,
    category: "Data Science",
    level: "Intermediate",
    duration: "25 hours",
    students: 680,
  },
  {
    id: 8,
    title: "Photography Masterclass",
    instructor: "Jessica Lee",
    thumbnail: "/placeholder.svg?height=180&width=320",
    rating: 4.7,
    price: 49.99,
    category: "Photography",
    level: "All Levels",
    duration: "15 hours",
    students: 1350,
  },
  {
    id: 9,
    title: "Financial Planning and Investment",
    instructor: "Thomas Brown",
    thumbnail: "/placeholder.svg?height=180&width=320",
    rating: 4.6,
    price: 64.99,
    category: "Finance",
    level: "Intermediate",
    duration: "14 hours",
    students: 720,
  },
]

const categories = [
  "All Categories",
  "Programming",
  "Business",
  "Marketing",
  "Design",
  "Data Science",
  "Photography",
  "Finance",
]

const levels = ["Beginner", "Intermediate", "Advanced", "All Levels"]

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 100])
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])

  const toggleLevel = (level: string) => {
    if (selectedLevels.includes(level)) {
      setSelectedLevels(selectedLevels.filter((l) => l !== level))
    } else {
      setSelectedLevels([...selectedLevels, level])
    }
  }

  const filteredCourses = allCourses.filter((course) => {
    // Category filter
    if (selectedCategory !== "All Categories" && course.category !== selectedCategory) {
      return false
    }

    // Search query filter
    if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Price range filter
    if (course.price < priceRange[0] || course.price > priceRange[1]) {
      return false
    }

    // Level filter
    if (selectedLevels.length > 0 && !selectedLevels.includes(course.level)) {
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
                  placeholder="Search courses..."
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
            <h1 className="text-2xl font-bold mb-2">Explore Courses</h1>
            <p className="text-muted-foreground">Discover new skills, expand your knowledge</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-1/4 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Filters</h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-3">Price Range</h4>
                      <div className="space-y-4">
                        <Slider
                          defaultValue={[0, 100]}
                          max={100}
                          step={1}
                          value={priceRange}
                          onValueChange={setPriceRange}
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-sm">${priceRange[0]}</span>
                          <span className="text-sm">${priceRange[1]}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-3">Level</h4>
                      <div className="space-y-2">
                        {levels.map((level) => (
                          <div key={level} className="flex items-center space-x-2">
                            <Checkbox
                              id={`level-${level}`}
                              checked={selectedLevels.includes(level)}
                              onCheckedChange={() => toggleLevel(level)}
                            />
                            <Label htmlFor={`level-${level}`} className="text-sm font-normal">
                              {level}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-3">Category</h4>
                      <div className="space-y-2">
                        {categories.slice(1).map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                              id={`category-${category}`}
                              checked={selectedCategory === category}
                              onCheckedChange={() =>
                                setSelectedCategory(selectedCategory === category ? "All Categories" : category)
                              }
                            />
                            <Label htmlFor={`category-${category}`} className="text-sm font-normal">
                              {category}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-6"
                    onClick={() => {
                      setSelectedCategory("All Categories")
                      setPriceRange([0, 100])
                      setSelectedLevels([])
                    }}
                  >
                    Reset Filters
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="w-full lg:w-3/4">
              <Tabs defaultValue="all" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="all">All Courses</TabsTrigger>
                  <TabsTrigger value="new">New</TabsTrigger>
                  <TabsTrigger value="popular">Popular</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-6">
                  {filteredCourses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <p className="text-muted-foreground mb-4">No courses found matching your criteria.</p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedCategory("All Categories")
                          setPriceRange([0, 100])
                          setSelectedLevels([])
                          setSearchQuery("")
                        }}
                      >
                        Reset Filters
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                      {filteredCourses.map((course) => (
                        <Link href={`/student/course/${course.id}`} key={course.id}>
                          <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
                            <div className="relative">
                              <img
                                src={course.thumbnail || "/placeholder.svg"}
                                alt={course.title}
                                className="aspect-video w-full object-cover"
                              />
                              {course.isNew && <Badge className="absolute top-2 left-2 bg-primary">New</Badge>}
                            </div>
                            <CardContent className="p-4 flex-grow">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold line-clamp-2">{course.title}</h3>
                                  <p className="text-sm text-muted-foreground">{course.instructor}</p>
                                </div>
                                <Badge variant="outline">{course.category}</Badge>
                              </div>

                              <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                                <div className="flex items-center">
                                  <BookOpen className="mr-1 h-3 w-3" />
                                  <span>{course.level}</span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="mr-1 h-3 w-3" />
                                  <span>{course.duration}</span>
                                </div>
                                <div className="flex items-center">
                                  <Users className="mr-1 h-3 w-3" />
                                  <span>{course.students} students</span>
                                </div>
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
                </TabsContent>

                <TabsContent value="new" className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {filteredCourses
                      .filter((course) => course.isNew)
                      .map((course) => (
                        <Link href={`/student/course/${course.id}`} key={course.id}>
                          <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
                            <div className="relative">
                              <img
                                src={course.thumbnail || "/placeholder.svg"}
                                alt={course.title}
                                className="aspect-video w-full object-cover"
                              />
                              <Badge className="absolute top-2 left-2 bg-primary">New</Badge>
                            </div>
                            <CardContent className="p-4 flex-grow">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold line-clamp-2">{course.title}</h3>
                                  <p className="text-sm text-muted-foreground">{course.instructor}</p>
                                </div>
                                <Badge variant="outline">{course.category}</Badge>
                              </div>

                              <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                                <div className="flex items-center">
                                  <BookOpen className="mr-1 h-3 w-3" />
                                  <span>{course.level}</span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="mr-1 h-3 w-3" />
                                  <span>{course.duration}</span>
                                </div>
                                <div className="flex items-center">
                                  <Users className="mr-1 h-3 w-3" />
                                  <span>{course.students} students</span>
                                </div>
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
                </TabsContent>

                <TabsContent value="popular" className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {filteredCourses
                      .sort((a, b) => b.students - a.students)
                      .slice(0, 6)
                      .map((course) => (
                        <Link href={`/student/course/${course.id}`} key={course.id}>
                          <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
                            <div className="relative">
                              <img
                                src={course.thumbnail || "/placeholder.svg"}
                                alt={course.title}
                                className="aspect-video w-full object-cover"
                              />
                              {course.students > 1000 && (
                                <Badge className="absolute top-2 left-2 bg-orange-500">Popular</Badge>
                              )}
                            </div>
                            <CardContent className="p-4 flex-grow">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold line-clamp-2">{course.title}</h3>
                                  <p className="text-sm text-muted-foreground">{course.instructor}</p>
                                </div>
                                <Badge variant="outline">{course.category}</Badge>
                              </div>

                              <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                                <div className="flex items-center">
                                  <BookOpen className="mr-1 h-3 w-3" />
                                  <span>{course.level}</span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="mr-1 h-3 w-3" />
                                  <span>{course.duration}</span>
                                </div>
                                <div className="flex items-center">
                                  <Users className="mr-1 h-3 w-3" />
                                  <span>{course.students} students</span>
                                </div>
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
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}


"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Plus, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InstructorSidebar } from "@/components/instructor-sidebar"
import { createCourse } from "@/app/actions/course-actions"
import { toast } from "@/components/ui/use-toast"

const categories = ["Programming", "Business", "Marketing", "Design", "Data Science", "Photography", "Finance", "Other"]
const levels = ["Beginner", "Intermediate", "Advanced", "All Levels"]

export default function NewCoursePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category: "",
    level: "",
    price: "",
    thumbnail: null,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCourseData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setCourseData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData()
    formData.append("title", courseData.title)
    formData.append("description", courseData.description)
    formData.append("category", courseData.category)
    formData.append("level", courseData.level)
    formData.append("price", courseData.price)

    // In a real app, you would upload the thumbnail to a storage service
    // and then append the URL to the form data
    if (courseData.thumbnail) {
      formData.append("thumbnail_url", "/placeholder.svg?height=180&width=320")
    }

    try {
      const result = await createCourse(formData)

      if (result.success) {
        toast({
          title: "Course created",
          description: "Your course has been created successfully",
        })
        router.push(`/instructor/course/${result.courseId}`)
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Create course error:", error)
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <InstructorSidebar />

      <div className="flex-1">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
          <Link
            href="/instructor/dashboard"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-lg font-semibold">Create New Course</h1>
        </header>

        <main className="p-6">
          <Tabs defaultValue="details" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Course Details</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Course Details</CardTitle>
                  <CardDescription>Provide the basic information about your course</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Course Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g., Introduction to Web Development"
                      value={courseData.title}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Course Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe what students will learn in this course"
                      rows={5}
                      value={courseData.description}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={courseData.category}
                      onValueChange={(value) => handleSelectChange("category", value)}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="level">Level</Label>
                    <Select value={courseData.level} onValueChange={(value) => handleSelectChange("level", value)}>
                      <SelectTrigger id="level">
                        <SelectValue placeholder="Select a level" />
                      </SelectTrigger>
                      <SelectContent>
                        {levels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Course Thumbnail</Label>
                    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Upload className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Drag and drop your thumbnail here</p>
                        <p className="text-xs text-muted-foreground">Supports JPG, PNG, GIF (Max 5MB)</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Choose File
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Save as Draft</Button>
                  <Button onClick={() => document.querySelector('[data-value="content"]')?.click()}>
                    Continue to Content
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="content">
              <Card>
                <CardHeader>
                  <CardTitle>Course Content</CardTitle>
                  <CardDescription>Organize your course into modules and lessons</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg border">
                    <div className="flex items-center justify-between p-4">
                      <h3 className="font-medium">Module 1: Introduction</h3>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          Delete
                        </Button>
                      </div>
                    </div>
                    <div className="border-t p-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                              1
                            </div>
                            <span>Welcome and Course Overview</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive">
                              Delete
                            </Button>
                          </div>
                        </div>

                        <Button variant="outline" size="sm" className="w-full">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Lesson
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Module
                  </Button>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => document.querySelector('[data-value="details"]')?.click()}>
                    Back to Details
                  </Button>
                  <Button onClick={() => document.querySelector('[data-value="pricing"]')?.click()}>
                    Continue to Pricing
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="pricing">
              <Card>
                <CardHeader>
                  <CardTitle>Course Pricing</CardTitle>
                  <CardDescription>Set the price for your course and create promotional offers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      placeholder="e.g., 49.99"
                      value={courseData.price}
                      onChange={handleInputChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      Platform fee: 10%. Your earnings per sale: $
                      {courseData.price ? (Number.parseFloat(courseData.price) * 0.9).toFixed(2) : "0.00"}
                    </p>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="free-course" className="h-4 w-4" />
                      <Label htmlFor="free-course">Make this course free</Label>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Free courses can help you build your audience and establish your expertise.
                    </p>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium">Promotional Offers</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Create limited-time discounts to boost enrollment
                    </p>
                    <Button variant="outline" size="sm" className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Coupon Code
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => document.querySelector('[data-value="content"]')?.click()}>
                    Back to Content
                  </Button>
                  <Button onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Course...
                      </>
                    ) : (
                      "Create Course"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}


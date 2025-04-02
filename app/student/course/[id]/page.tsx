"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen, Download, MessageSquare, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { StudentSidebar } from "@/components/student-sidebar"

// Mock course data
const courseData = {
  id: 1,
  title: "Introduction to Web Development",
  instructor: "Sarah Johnson",
  description:
    "Learn the fundamentals of web development including HTML, CSS, and JavaScript. This comprehensive course will take you from beginner to building your own responsive websites.",
  thumbnail: "/placeholder.svg?height=720&width=1280",
  rating: 4.8,
  price: 49.99,
  category: "Programming",
  duration: "10 hours",
  students: 1245,
  lastUpdated: "March 2025",
  modules: [
    {
      id: "module-1",
      title: "Getting Started with HTML",
      lessons: [
        { id: "lesson-1-1", title: "Introduction to HTML", duration: "15:30", isCompleted: true },
        { id: "lesson-1-2", title: "HTML Document Structure", duration: "12:45", isCompleted: true },
        { id: "lesson-1-3", title: "Working with Text Elements", duration: "18:20", isCompleted: false },
        { id: "lesson-1-4", title: "Links and Navigation", duration: "14:10", isCompleted: false },
      ],
    },
    {
      id: "module-2",
      title: "CSS Fundamentals",
      lessons: [
        { id: "lesson-2-1", title: "Introduction to CSS", duration: "16:40", isCompleted: false },
        { id: "lesson-2-2", title: "Selectors and Properties", duration: "20:15", isCompleted: false },
        { id: "lesson-2-3", title: "Box Model and Layout", duration: "22:30", isCompleted: false },
        { id: "lesson-2-4", title: "Responsive Design Basics", duration: "25:10", isCompleted: false },
      ],
    },
    {
      id: "module-3",
      title: "JavaScript Basics",
      lessons: [
        { id: "lesson-3-1", title: "Introduction to JavaScript", duration: "18:50", isCompleted: false },
        { id: "lesson-3-2", title: "Variables and Data Types", duration: "14:25", isCompleted: false },
        { id: "lesson-3-3", title: "Functions and Events", duration: "23:15", isCompleted: false },
        { id: "lesson-3-4", title: "DOM Manipulation", duration: "26:40", isCompleted: false },
      ],
    },
  ],
  resources: [
    { id: "resource-1", title: "HTML Cheat Sheet", type: "PDF", size: "1.2 MB" },
    { id: "resource-2", title: "CSS Reference Guide", type: "PDF", size: "2.4 MB" },
    { id: "resource-3", title: "JavaScript Fundamentals", type: "PDF", size: "3.1 MB" },
    { id: "resource-4", title: "Project Starter Files", type: "ZIP", size: "5.6 MB" },
  ],
}

// Mock comments
const comments = [
  {
    id: 1,
    user: "Alex Thompson",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "This explanation really helped me understand the concept. Thanks!",
    timestamp: "2 hours ago",
    likes: 12,
  },
  {
    id: 2,
    user: "Jamie Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "Could you explain more about how the box model works with flexbox?",
    timestamp: "1 day ago",
    likes: 5,
  },
  {
    id: 3,
    user: "Taylor Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "I'm having trouble with the responsive design exercise. Any tips?",
    timestamp: "3 days ago",
    likes: 3,
  },
]

export default function CoursePage({ params }: { params: { id: string } }) {
  const [activeLesson, setActiveLesson] = useState("lesson-1-1")
  const [commentText, setCommentText] = useState("")
  const [isLive, setIsLive] = useState(false)

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send the comment to the backend
    setCommentText("")
  }

  return (
    <div className="flex min-h-screen bg-background">
      <StudentSidebar />

      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
          <Link
            href="/student/dashboard"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="ml-auto flex items-center gap-4">
            {isLive && (
              <Badge variant="destructive" className="animate-pulse">
                LIVE
              </Badge>
            )}
            <Button size="sm" variant={isLive ? "outline" : "default"} onClick={() => setIsLive(!isLive)}>
              {isLive ? "Leave Live Session" : "Join Live Session"}
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
          <div className="col-span-1 md:col-span-2 lg:col-span-3 p-6">
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
              <video src="" poster={courseData.thumbnail} controls className="h-full w-full">
                Your browser does not support the video tag.
              </video>
            </div>

            <div className="mt-6">
              <h1 className="text-2xl font-bold">{courseData.title}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder.svg?height=24&width=24" alt={courseData.instructor} />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{courseData.instructor}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(courseData.rating) ? "text-yellow-400" : "text-gray-300"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                  </div>
                  <span className="text-sm font-medium">{courseData.rating}</span>
                </div>
                <Badge variant="outline">{courseData.category}</Badge>
                <span className="text-sm text-muted-foreground">{courseData.duration}</span>
                <span className="text-sm text-muted-foreground">{courseData.students} students</span>
              </div>
            </div>

            <Tabs defaultValue="content" className="mt-6">
              <TabsList>
                <TabsTrigger value="content">Course Content</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="discussion">Discussion</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="mt-4">
                <p className="text-muted-foreground">{courseData.description}</p>
                <Separator className="my-6" />
                <Accordion type="single" collapsible className="w-full">
                  {courseData.modules.map((module) => (
                    <AccordionItem key={module.id} value={module.id}>
                      <AccordionTrigger className="text-base font-medium">{module.title}</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {module.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className={`flex cursor-pointer items-center justify-between rounded-md p-2 ${
                                activeLesson === lesson.id ? "bg-primary/10 text-primary" : "hover:bg-muted"
                              }`}
                              onClick={() => setActiveLesson(lesson.id)}
                            >
                              <div className="flex items-center gap-2">
                                {lesson.isCompleted ? (
                                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="h-3 w-3"
                                    >
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                  </div>
                                ) : (
                                  <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                                )}
                                <span>{lesson.title}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>

              <TabsContent value="resources" className="mt-4">
                <div className="space-y-4">
                  {courseData.resources.map((resource) => (
                    <div key={resource.id} className="flex items-center justify-between rounded-md border p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">{resource.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {resource.type} • {resource.size}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Download className="h-5 w-5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="discussion" className="mt-4">
                <div className="space-y-6">
                  <form onSubmit={handleSubmitComment} className="flex gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Your Avatar" />
                      <AvatarFallback>YA</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="Add a comment or ask a question..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      />
                      <div className="flex justify-end">
                        <Button type="submit" disabled={!commentText.trim()}>
                          Post Comment
                        </Button>
                      </div>
                    </div>
                  </form>

                  <Separator />

                  <div className="space-y-6">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex gap-4">
                        <Avatar>
                          <AvatarImage src={comment.avatar} alt={comment.user} />
                          <AvatarFallback>{comment.user.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{comment.user}</span>
                            <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                          </div>
                          <p>{comment.content}</p>
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
                              <ThumbsUp className="h-4 w-4" />
                              <span>{comment.likes}</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
                              <MessageSquare className="h-4 w-4" />
                              <span>Reply</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {isLive && (
            <div className="border-l p-4">
              <div className="flex flex-col h-full">
                <h3 className="font-semibold mb-4">Live Chat</h3>
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 h-[calc(100vh-240px)]">
                  <div className="flex gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>SJ</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-2 max-w-[85%]">
                      <p className="text-xs font-medium">Sarah Johnson (Instructor)</p>
                      <p className="text-sm">
                        Welcome everyone to today's live session! We'll be covering responsive design techniques.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-2 max-w-[85%]">
                      <p className="text-xs font-medium">John Doe</p>
                      <p className="text-sm">Looking forward to learning about media queries!</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>AM</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-2 max-w-[85%]">
                      <p className="text-xs font-medium">Alice Miller</p>
                      <p className="text-sm">Will we be covering flexbox as well?</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>SJ</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-2 max-w-[85%]">
                      <p className="text-xs font-medium">Sarah Johnson (Instructor)</p>
                      <p className="text-sm">Yes Alice, we'll cover flexbox in the second half of today's session!</p>
                    </div>
                  </div>
                </div>
                <div className="mt-auto">
                  <form className="flex gap-2">
                    <Input placeholder="Type a message..." className="flex-1" />
                    <Button type="submit" size="sm">
                      Send
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


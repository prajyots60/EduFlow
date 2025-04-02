"use client"

import Link from "next/link"
import { ArrowRight, BookOpen, CheckCircle, Globe, Video, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

// Animation variants
const fadeIn = {
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

export default function Home() {
  // Feature cards data
  const features = [
    {
      icon: <Video className="h-8 w-8 text-primary" />,
      title: "Live Classes",
      description: "Host interactive live sessions with real-time chat and Q&A.",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: "Course Management",
      description: "Easily upload videos, notes, and resources for your students.",
    },
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      title: "Global Reach",
      description: "Connect with students worldwide and grow your audience.",
    },
  ]

  // Trending courses (placeholder data)
  const trendingCourses = [
    {
      id: 1,
      title: "Python Programming: Zero to Hero",
      instructor: "Alex Johnson",
      category: "Programming",
      rating: 4.8,
      students: 1245,
      price: 49.99,
      image: "/placeholder.svg?height=180&width=320",
    },
    {
      id: 2,
      title: "UI/UX Design Principles",
      instructor: "Emma Wilson",
      category: "Design",
      rating: 4.7,
      students: 980,
      price: 59.99,
      image: "/placeholder.svg?height=180&width=320",
    },
    {
      id: 3,
      title: "Digital Marketing Fundamentals",
      instructor: "Michael Chen",
      category: "Marketing",
      rating: 4.9,
      students: 1560,
      price: 44.99,
      image: "/placeholder.svg?height=180&width=320",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">EduFlow</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-primary hover:bg-primary/90 transition-colors duration-300">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-primary/5 via-background to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <motion.div
                className="flex flex-col justify-center space-y-4"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                custom={0}
              >
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 w-fit">
                  Launch your teaching career today
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                    Teach and Learn Without Limits
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    The platform where educators can easily host and sell their courses without worrying about website
                    management or technical infrastructure.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup?role=instructor">
                    <Button
                      className="w-full group relative overflow-hidden bg-primary hover:bg-primary/90 transition-all duration-300"
                      size="lg"
                    >
                      <span className="relative z-10">Start Teaching</span>
                      <ArrowRight className="ml-2 h-4 w-4 relative z-10 transition-transform group-hover:translate-x-1" />
                      <div className="absolute inset-0 bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                    </Button>
                  </Link>
                  <Link href="/signup?role=student">
                    <Button
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary/10"
                      size="lg"
                    >
                      Explore Courses
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <CheckCircle className="mr-1 h-3 w-3 text-primary" />
                    <span>No technical skills required</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="mr-1 h-3 w-3 text-primary" />
                    <span>10% commission only</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center justify-center lg:justify-end"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <div className="relative">
                  <div className="absolute -top-8 -left-8 h-64 w-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                  {/* Place for hero image - to be attached directly */}
                  <div className="relative rounded-lg shadow-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-purple-300/20 p-1">
                    <img
                      src="/placeholder.svg?height=500&width=600"
                      alt="Platform Preview"
                      className="relative rounded-md object-cover"
                      width={600}
                      height={500}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Search & Feature Section */}
        <section className="w-full py-12 md:py-16 lg:py-20 border-y">
          <div className="container px-4 md:px-6">
            <motion.div
              className="w-full max-w-3xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search for courses, topics, or instructors..."
                  className="w-full h-14 pl-5 pr-14 rounded-full border-2 border-primary/20 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-md hover:shadow-lg"
                />
                <button className="absolute right-1.5 top-1.5 rounded-full bg-primary px-3 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <Button variant="outline" size="sm" className="rounded-full border-primary/20 text-sm">
                  Programming
                </Button>
                <Button variant="outline" size="sm" className="rounded-full border-primary/20 text-sm">
                  Design
                </Button>
                <Button variant="outline" size="sm" className="rounded-full border-primary/20 text-sm">
                  Business
                </Button>
                <Button variant="outline" size="sm" className="rounded-full border-primary/20 text-sm">
                  Marketing
                </Button>
                <Button variant="outline" size="sm" className="rounded-full border-primary/20 text-sm">
                  Photography
                </Button>
              </div>
            </motion.div>

            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <motion.div className="space-y-2" initial="hidden" animate="visible" variants={fadeIn} custom={1}>
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground w-fit mx-auto">
                  Why Choose EduFlow
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                  Features Designed for Educators
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                  Everything you need to create, manage, and sell your courses online.
                </p>
              </motion.div>
            </div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-6 md:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="flex flex-col items-center space-y-4 rounded-xl border p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50 hover:bg-primary/5"
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  custom={index + 2}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-center text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Trending Courses Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col gap-4 mb-10">
              <motion.div className="space-y-2" initial="hidden" animate="visible" variants={fadeIn} custom={3}>
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground w-fit">
                  Featured Courses
                </div>
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold tracking-tighter">Trending Now</h2>
                  <Link href="/signup?role=student">
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {trendingCourses.map((course, index) => (
                <motion.div key={course.id} initial="hidden" animate="visible" variants={fadeIn} custom={index + 4}>
                  <Link href="/signup?role=student" className="block">
                    <div className="group relative overflow-hidden rounded-xl border bg-background shadow-md transition-all hover:shadow-xl">
                      <div className="aspect-video w-full overflow-hidden">
                        <img
                          src={course.image || "/placeholder.svg"}
                          alt={course.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors">
                            {course.title}
                          </h3>
                          <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                            {course.category}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{course.instructor}</p>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`h-4 w-4 ${i < Math.floor(course.rating) ? "text-yellow-400" : "text-gray-300"}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm font-medium">{course.rating}</span>
                          <span className="text-xs text-muted-foreground">({course.students} students)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold">${course.price}</span>
                          <Button size="sm" className="bg-primary hover:bg-primary/90 transition-colors">
                            Enroll Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Instructor Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 items-center">
              <motion.div className="space-y-4" initial="hidden" animate="visible" variants={fadeIn} custom={5}>
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground w-fit">
                  Join Our Community
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                  Learn from the Best Instructors
                </h2>
                <p className="text-muted-foreground md:text-xl">
                  Access high-quality courses from expert instructors in various fields. Enhance your skills and advance
                  your career.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup?role=student">
                    <Button
                      className="w-full group relative overflow-hidden bg-primary hover:bg-primary/90 transition-all duration-300"
                      size="lg"
                    >
                      <span className="relative z-10">Browse Courses</span>
                      <div className="absolute inset-0 bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                    </Button>
                  </Link>
                </div>
              </motion.div>

              <motion.div
                className="grid grid-cols-2 gap-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                <div className="grid gap-4">
                  <div className="overflow-hidden rounded-lg">
                    {/* Place for student learning image */}
                    <img
                      src="/placeholder.svg?height=240&width=240"
                      alt="Student learning"
                      className="aspect-square object-cover transform hover:scale-105 transition-transform duration-300"
                      width={240}
                      height={240}
                    />
                  </div>
                  <div className="overflow-hidden rounded-lg">
                    {/* Place for online course image */}
                    <img
                      src="/placeholder.svg?height=240&width=240"
                      alt="Online course"
                      className="aspect-square object-cover transform hover:scale-105 transition-transform duration-300"
                      width={240}
                      height={240}
                    />
                  </div>
                </div>
                <div className="grid gap-4">
                  <div className="overflow-hidden rounded-lg">
                    {/* Place for instructor teaching image */}
                    <img
                      src="/placeholder.svg?height=240&width=240"
                      alt="Instructor teaching"
                      className="aspect-square object-cover transform hover:scale-105 transition-transform duration-300"
                      width={240}
                      height={240}
                    />
                  </div>
                  <div className="overflow-hidden rounded-lg">
                    {/* Place for live class image */}
                    <img
                      src="/placeholder.svg?height=240&width=240"
                      alt="Live class"
                      className="aspect-square object-cover transform hover:scale-105 transition-transform duration-300"
                      width={240}
                      height={240}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-background">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              custom={6}
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                  Ready to Start Your Journey?
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                  Join thousands of instructors and students on EduFlow today.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/signup?role=instructor">
                  <Button
                    className="w-full group relative overflow-hidden bg-primary hover:bg-primary/90 transition-all duration-300"
                    size="lg"
                  >
                    <span className="relative z-10">Become an Instructor</span>
                    <div className="absolute inset-0 bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                  </Button>
                </Link>
                <Link href="/signup?role=student">
                  <Button
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary/10"
                    size="lg"
                  >
                    Join as Student
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-muted/30 py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">EduFlow</span>
          </div>
          <p className="text-center text-sm text-muted-foreground">© 2025 EduFlow. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}


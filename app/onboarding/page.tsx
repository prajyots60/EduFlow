"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { motion } from "framer-motion"
import { BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

export default function OnboardingPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const [role, setRole] = useState<string>("student")
  const [expertise, setExpertise] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  if (!isLoaded) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!role) {
      toast({
        title: "Please select a role",
        variant: "destructive",
      })
      return
    }

    if (role === "instructor" && !expertise) {
      toast({
        title: "Please select your area of expertise",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Update user metadata in Clerk
      await user?.update({
        publicMetadata: {
          role,
          expertise: role === "instructor" ? expertise : null,
          onboarded: true,
        },
      })

      // Redirect based on role
      if (role === "instructor") {
        router.push("/instructor/dashboard")
      } else {
        router.push("/student/dashboard")
      }

      router.refresh()
    } catch (error) {
      console.error("Onboarding error:", error)
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute left-8 top-8 flex items-center gap-2 md:left-12 md:top-12"
      >
        <BookOpen className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold">EduFlow</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg border-primary/10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Complete Your Profile</CardTitle>
            <CardDescription className="text-center">
              Tell us a bit about yourself to get started with EduFlow
            </CardDescription>
          </CardHeader>
          <form onSubmit={onSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <div className="rounded-md border px-4 py-3 text-sm font-medium">
                  {user?.fullName || user?.firstName + " " + user?.lastName}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="rounded-md border px-4 py-3 text-sm font-medium">
                  {user?.primaryEmailAddress?.emailAddress}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">I want to join EduFlow as...</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student (I want to learn)</SelectItem>
                    <SelectItem value="instructor">Instructor (I want to teach)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {role === "instructor" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  <Label htmlFor="expertise">Area of Expertise</Label>
                  <Select value={expertise} onValueChange={setExpertise}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your expertise" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="programming">Programming & Development</SelectItem>
                      <SelectItem value="design">Design & Creative Arts</SelectItem>
                      <SelectItem value="business">Business & Entrepreneurship</SelectItem>
                      <SelectItem value="marketing">Marketing & Communication</SelectItem>
                      <SelectItem value="science">Science & Mathematics</SelectItem>
                      <SelectItem value="languages">Languages & Linguistics</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full transition-all hover:shadow-md" disabled={isLoading}>
                {isLoading ? "Processing..." : "Complete Setup"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}


"use client"

import { SignIn } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { BookOpen } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-background p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Link href="/" className="absolute left-8 top-8 flex items-center gap-2 md:left-12 md:top-12">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">EduFlow</span>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-md"
      >
        <SignIn
          appearance={{
            baseTheme: dark,
            elements: {
              rootBox: "w-full mx-auto",
              card: "shadow-xl border border-primary/10 rounded-xl",
              header: "text-center",
              headerTitle: "text-2xl font-bold",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton:
                "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
              formField: "space-y-1",
              formFieldLabel:
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              formFieldInput:
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              footerActionText: "text-muted-foreground",
              footerActionLink: "text-primary hover:text-primary-foreground",
            },
          }}
          signUpUrl="/sign-up"
          redirectUrl="/onboarding"
          path="/sign-in"
        />
      </motion.div>
    </div>
  )
}


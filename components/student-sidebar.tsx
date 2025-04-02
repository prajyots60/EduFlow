"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser, useClerk } from "@clerk/nextjs"
import { BookOpen, Bookmark, Compass, Home, LayoutDashboard, MessageSquare, Settings, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"

export function StudentSidebar() {
  const pathname = usePathname()
  const { user } = useUser()
  const { signOut } = useClerk()

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  const handleSignOut = async () => {
    await signOut()
  }

  // Animation variants
  const sidebarItem = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="flex h-16 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">EduFlow</span>
          </Link>
          <SidebarTrigger className="ml-auto md:hidden" />
        </SidebarHeader>
        <SidebarContent className="px-2">
          <motion.div className="my-4 px-4" initial="hidden" animate="visible" variants={sidebarItem} custom={0}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start h-auto p-2 hover:bg-primary/10">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border-2 border-primary/20">
                      <AvatarImage
                        src={user?.imageUrl || "/placeholder.svg?height=32&width=32"}
                        alt={user?.fullName || "User"}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user?.firstName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-sm">
                      <span className="font-medium">{user?.fullName || "Student"}</span>
                      <span className="text-xs text-muted-foreground">
                        {user?.primaryEmailAddress?.emailAddress || "student@example.com"}
                      </span>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/student/profile" className="flex w-full items-center cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/student/settings" className="flex w-full items-center cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>

          <div className="px-2 py-2">
            <h3 className="mb-2 px-4 text-xs font-medium text-muted-foreground">MENU</h3>
            <SidebarMenu>
              <motion.div initial="hidden" animate="visible" variants={sidebarItem} custom={1}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/student/dashboard")}
                    className="hover:bg-primary/10 transition-colors"
                  >
                    <Link href="/student/dashboard">
                      <Home className="h-5 w-5" />
                      <span>Home</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </motion.div>

              <motion.div initial="hidden" animate="visible" variants={sidebarItem} custom={2}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/student/my-courses")}
                    className="hover:bg-primary/10 transition-colors"
                  >
                    <Link href="/student/my-courses">
                      <LayoutDashboard className="h-5 w-5" />
                      <span>My Courses</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </motion.div>

              <motion.div initial="hidden" animate="visible" variants={sidebarItem} custom={3}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/student/explore")}
                    className="hover:bg-primary/10 transition-colors"
                  >
                    <Link href="/student/explore">
                      <Compass className="h-5 w-5" />
                      <span>Explore</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </motion.div>

              <motion.div initial="hidden" animate="visible" variants={sidebarItem} custom={4}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/student/saved")}
                    className="hover:bg-primary/10 transition-colors"
                  >
                    <Link href="/student/saved">
                      <Bookmark className="h-5 w-5" />
                      <span>Saved</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </motion.div>

              <motion.div initial="hidden" animate="visible" variants={sidebarItem} custom={5}>
                nitial="hidden" animate="visible" variants={sidebarItem} custom={5}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/student/messages")}
                    className="hover:bg-primary/10 transition-colors"
                  >
                    <Link href="/student/messages">
                      <MessageSquare className="h-5 w-5" />
                      <span>Messages</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </motion.div>
            </SidebarMenu>
          </div>
        </SidebarContent>
        <SidebarFooter className="border-t p-4">
          <Button
            variant="outline"
            asChild
            className="w-full justify-start border-primary/20 hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <Link href="/student/settings">
              <Settings className="mr-2 h-5 w-5" />
              Settings
            </Link>
          </Button>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}


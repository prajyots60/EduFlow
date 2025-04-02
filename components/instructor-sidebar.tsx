"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser, useClerk } from "@clerk/nextjs"
import { BarChart, BookOpen, DollarSign, Home, MessageSquare, Settings, Users, Video, User, LogOut } from "lucide-react"
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

export function InstructorSidebar() {
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
                        {user?.firstName?.charAt(0) || "I"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-sm">
                      <span className="font-medium">{user?.fullName || "Instructor"}</span>
                      <span className="text-xs text-muted-foreground">
                        {user?.primaryEmailAddress?.emailAddress || "instructor@example.com"}
                      </span>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/instructor/profile" className="flex w-full items-center cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/instructor/settings" className="flex w-full items-center cursor-pointer">
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
                    isActive={isActive("/instructor/dashboard")}
                    className="hover:bg-primary/10 transition-colors"
                  >
                    <Link href="/instructor/dashboard">
                      <Home className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </motion.div>

              <motion.div initial="hidden" animate="visible" variants={sidebarItem} custom={2}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/instructor/courses")}
                    className="hover:bg-primary/10 transition-colors"
                  >
                    <Link href="/instructor/courses">
                      <BookOpen className="h-5 w-5" />
                      <span>Courses</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </motion.div>

              <motion.div initial="hidden" animate="visible" variants={sidebarItem} custom={3}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/instructor/live")}
                    className="hover:bg-primary/10 transition-colors"
                  >
                    <Link href="/instructor/live">
                      <Video className="h-5 w-5" />
                      <span>Live Classes</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </motion.div>

              <motion.div initial="hidden" animate="visible" variants={sidebarItem} custom={4}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/instructor/students")}
                    className="hover:bg-primary/10 transition-colors"
                  >
                    <Link href="/instructor/students">
                      <Users className="h-5 w-5" />
                      <span>Students</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </motion.div>

              <motion.div initial="hidden" animate="visible" variants={sidebarItem} custom={5}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/instructor/analytics")}
                    className="hover:bg-primary/10 transition-colors"
                  >
                    <Link href="/instructor/analytics">
                      <BarChart className="h-5 w-5" />
                      <span>Analytics</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </motion.div>

              <motion.div initial="hidden" animate="visible" variants={sidebarItem} custom={6}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/instructor/earnings")}
                    className="hover:bg-primary/10 transition-colors"
                  >
                    <Link href="/instructor/earnings">
                      <DollarSign className="h-5 w-5" />
                      <span>Earnings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </motion.div>

              <motion.div initial="hidden" animate="visible" variants={sidebarItem} custom={7}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/instructor/messages")}
                    className="hover:bg-primary/10 transition-colors"
                  >
                    <Link href="/instructor/messages">
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
            <Link href="/instructor/settings">
              <Settings className="mr-2 h-5 w-5" />
              Settings
            </Link>
          </Button>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}


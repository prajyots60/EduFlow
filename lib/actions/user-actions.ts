"use server"

import { currentUser } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function getCurrentUser() {
  try {
    const user = await currentUser()

    if (!user) {
      return null
    }

    // Get user from our database
    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, user.id),
    })

    // If user doesn't exist in our database, create them
    if (!dbUser) {
      const newUser = {
        id: user.id,
        name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username || "User",
        email: user.emailAddresses[0].emailAddress,
        role: (user.publicMetadata.role as string) || "student",
        avatarUrl: user.imageUrl,
      }

      await db.insert(users).values(newUser)
      return newUser
    }

    return dbUser
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function updateUserProfile(formData: FormData) {
  try {
    const user = await currentUser()

    if (!user) {
      throw new Error("User not authenticated")
    }

    const name = formData.get("name") as string
    const bio = formData.get("bio") as string

    // Update user in our database
    await db
      .update(users)
      .set({
        name,
        bio,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id))

    revalidatePath("/profile")
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error updating user profile:", error)
    return { success: false, error: "Failed to update profile" }
  }
}

export async function updateUserRole(userId: string, role: "student" | "instructor") {
  try {
    await db
      .update(users)
      .set({
        role,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))

    return { success: true }
  } catch (error) {
    console.error("Error updating user role:", error)
    return { success: false, error: "Failed to update user role" }
  }
}

export async function completeOnboarding(
  userId: string,
  data: {
    role: "student" | "instructor"
    expertise?: string
    bio?: string
  },
) {
  try {
    await db
      .update(users)
      .set({
        role: data.role,
        expertise: data.expertise,
        bio: data.bio,
        isOnboarded: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))

    return { success: true }
  } catch (error) {
    console.error("Error completing onboarding:", error)
    return { success: false, error: "Failed to complete onboarding" }
  }
}


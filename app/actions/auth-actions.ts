"use server"

import { currentUser } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

export async function getCurrentUser() {
  try {
    const user = await currentUser()

    if (!user) {
      return null
    }

    // Get additional user data from our database
    const userData = await db.execute(`SELECT * FROM users WHERE id = $1`, [user.id])

    if (!userData || userData.length === 0) {
      return {
        id: user.id,
        name: user.fullName || `${user.firstName} ${user.lastName}`,
        email: user.emailAddresses[0].emailAddress,
        role: (user.publicMetadata.role as string) || "student",
        image: user.imageUrl,
      }
    }

    return userData[0]
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
    await db.execute(
      `
      UPDATE users 
      SET name = $1, bio = $2
      WHERE id = $3
      `,
      [name, bio, user.id],
    )

    return { success: true }
  } catch (error) {
    console.error("Error updating user profile:", error)
    return { success: false, error: "Failed to update profile" }
  }
}

export async function registerInstructor(formData: FormData) {
  try {
    const user = await currentUser()

    if (!user) {
      redirect("/login")
    }

    const expertise = formData.get("expertise") as string
    const bio = formData.get("bio") as string

    // Update user in our database
    await db.execute(
      `
      UPDATE users 
      SET role = 'instructor', expertise = $1, bio = $2
      WHERE id = $3
      `,
      [expertise, bio, user.id],
    )

    // The role change in Clerk would be handled through the API
    // since we can't directly update publicMetadata from server actions

    redirect("/instructor/dashboard")
  } catch (error) {
    console.error("Error registering as instructor:", error)
    return { success: false, error: "Failed to register as instructor" }
  }
}


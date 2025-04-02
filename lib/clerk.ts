import { clerkClient } from "@clerk/nextjs"
import type { UserJSON } from "@clerk/nextjs/server"

// Function to create or update user metadata when a user signs up or signs in
export async function updateUserMetadata(
  userId: string,
  metadata: { role?: string; expertise?: string; onboarded?: boolean },
) {
  try {
    await clerkClient.users.updateUser(userId, {
      publicMetadata: metadata,
    })
    return { success: true }
  } catch (error) {
    console.error("Error updating user metadata:", error)
    return { success: false, error }
  }
}

// Function to get user role
export async function getUserRole(userId: string): Promise<string | null> {
  try {
    const user = await clerkClient.users.getUser(userId)
    return (user.publicMetadata.role as string) || null
  } catch (error) {
    console.error("Error getting user role:", error)
    return null
  }
}

// Function to check if a user has completed onboarding
export async function isUserOnboarded(userId: string): Promise<boolean> {
  try {
    const user = await clerkClient.users.getUser(userId)
    return Boolean(user.publicMetadata.onboarded)
  } catch (error) {
    console.error("Error checking onboarding status:", error)
    return false
  }
}

// Function to get a user by their ID
export async function getUserById(userId: string): Promise<UserJSON | null> {
  try {
    const user = await clerkClient.users.getUser(userId)
    return user
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}


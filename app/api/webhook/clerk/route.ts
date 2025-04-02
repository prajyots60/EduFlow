import { Webhook } from "svix"
import { headers } from "next/headers"
import type { WebhookEvent } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "")

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error("Error verifying webhook:", err)
    return new Response("Error occurred", {
      status: 400,
    })
  }

  // Handle the webhook
  const eventType = evt.type

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, email_addresses, image_url, first_name, last_name, public_metadata } = evt.data

    const role = (public_metadata.role as string) || "student"
    const expertise = (public_metadata.expertise as string) || null
    const isOnboarded = (public_metadata.onboarded as boolean) || false

    // Get primary email
    const emailObject = email_addresses?.[0]
    const email = emailObject ? emailObject.email_address : ""

    // User's full name or first name
    const name = `${first_name} ${last_name}`.trim() || email.split("@")[0]

    try {
      // Insert or update user in our database
      await db
        .insert(users)
        .values({
          id,
          name,
          email,
          role,
          expertise,
          avatarUrl: image_url,
          isOnboarded,
        })
        .onConflictDoUpdate({
          target: users.id,
          set: {
            name,
            email,
            role,
            expertise,
            avatarUrl: image_url,
            isOnboarded,
            updatedAt: new Date(),
          },
        })

      return NextResponse.json({ success: true, message: "User created/updated" })
    } catch (error) {
      console.error("Error creating/updating user:", error)
      return new Response("Error occurred", { status: 500 })
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data

    try {
      // Handle user deletion
      await db.delete(users).where(eq(users.id, id))

      return NextResponse.json({ success: true, message: "User deleted" })
    } catch (error) {
      console.error("Error deleting user:", error)
      return new Response("Error occurred", { status: 500 })
    }
  }

  return NextResponse.json({ success: true, message: "Webhook received" })
}


import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { updateUserMetadata } from "@/lib/clerk"
import { db } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { role, expertise, onboarded } = await request.json()

    // Update user metadata in Clerk
    await updateUserMetadata(user.id, {
      role,
      expertise,
      onboarded,
    })

    // Store user in the database
    await db.execute(
      `
      INSERT INTO users (id, name, email, role, expertise, avatar_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO UPDATE
      SET name = $2, email = $3, role = $4, expertise = $5, avatar_url = $6
      `,
      [
        user.id,
        user.fullName || `${user.firstName} ${user.lastName}`,
        user.primaryEmailAddress?.emailAddress,
        role,
        expertise,
        user.imageUrl,
      ],
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[ONBOARDING_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}


"use server"

import { currentUser } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { courses, users, enrollments, reviews, modules, lessons, progress, resources } from "@/lib/db/schema"
import { eq, count, avg, desc, sql, and, asc } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function getPopularCourses(limit = 6) {
  try {
    const popularCourses = await db
      .select({
        id: courses.id,
        title: courses.title,
        description: courses.description,
        thumbnailUrl: courses.thumbnailUrl,
        price: courses.price,
        category: courses.category,
        level: courses.level,
        createdAt: courses.createdAt,
        instructorName: users.name,
        instructorId: users.id,
        instructorAvatar: users.avatarUrl,
        studentCount: count(enrollments.id),
        averageRating: avg(reviews.rating),
      })
      .from(courses)
      .innerJoin(users, eq(courses.instructorId, users.id))
      .leftJoin(enrollments, eq(courses.id, enrollments.courseId))
      .leftJoin(reviews, eq(enrollments.id, reviews.enrollmentId))
      .where(eq(courses.status, "published"))
      .groupBy(courses.id, users.id)
      .orderBy(desc(sql`count(${enrollments.id})`))
      .limit(limit)

    return popularCourses
  } catch (error) {
    console.error("Get popular courses error:", error)
    return []
  }
}

export async function getNewCourses(limit = 6) {
  try {
    const newCourses = await db
      .select({
        id: courses.id,
        title: courses.title,
        description: courses.description,
        thumbnailUrl: courses.thumbnailUrl,
        price: courses.price,
        category: courses.category,
        level: courses.level,
        createdAt: courses.createdAt,
        instructorName: users.name,
        instructorId: users.id,
        instructorAvatar: users.avatarUrl,
        studentCount: count(enrollments.id),
        averageRating: avg(reviews.rating),
      })
      .from(courses)
      .innerJoin(users, eq(courses.instructorId, users.id))
      .leftJoin(enrollments, eq(courses.id, enrollments.courseId))
      .leftJoin(reviews, eq(enrollments.id, reviews.enrollmentId))
      .where(eq(courses.status, "published"))
      .groupBy(courses.id, users.id)
      .orderBy(desc(courses.createdAt))
      .limit(limit)

    return newCourses
  } catch (error) {
    console.error("Get new courses error:", error)
    return []
  }
}

export async function getEnrolledCourses() {
  const user = await currentUser()

  if (!user) {
    return []
  }

  try {
    // Get all enrollments for the user
    const userEnrollments = await db
      .select({
        id: enrollments.id,
        courseId: enrollments.courseId,
        enrolledAt: enrollments.enrolledAt,
      })
      .from(enrollments)
      .where(eq(enrollments.studentId, user.id))

    // Get course details for each enrollment
    const enrolledCourses = await Promise.all(
      userEnrollments.map(async (enrollment) => {
        // Get course details
        const [courseDetails] = await db
          .select({
            id: courses.id,
            title: courses.title,
            description: courses.description,
            thumbnailUrl: courses.thumbnailUrl,
            category: courses.category,
            level: courses.level,
            instructorName: users.name,
            instructorAvatar: users.avatarUrl,
          })
          .from(courses)
          .innerJoin(users, eq(courses.instructorId, users.id))
          .where(eq(courses.id, enrollment.courseId))

        // Get total lessons count
        const [{ totalLessons }] = await db
          .select({
            totalLessons: count(lessons.id),
          })
          .from(lessons)
          .innerJoin(modules, eq(lessons.moduleId, modules.id))
          .where(eq(modules.courseId, enrollment.courseId))

        // Get completed lessons count
        const [{ completedLessons }] = await db
          .select({
            completedLessons: count(progress.id),
          })
          .from(progress)
          .where(and(eq(progress.enrollmentId, enrollment.id), eq(progress.completed, true)))

        // Get last accessed time
        const [lastAccessedRecord] = await db
          .select({
            lastAccessed: progress.lastAccessed,
          })
          .from(progress)
          .where(eq(progress.enrollmentId, enrollment.id))
          .orderBy(desc(progress.lastAccessed))
          .limit(1)

        // Calculate progress percentage
        const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

        // Format last accessed date
        const lastAccessed = lastAccessedRecord?.lastAccessed
          ? new Date(lastAccessedRecord.lastAccessed).toLocaleDateString()
          : "Never"

        return {
          ...courseDetails,
          enrollmentId: enrollment.id,
          enrolledAt: enrollment.enrolledAt,
          progress: progressPercentage,
          completedLessons,
          totalLessons,
          lastAccessed,
        }
      }),
    )

    return enrolledCourses
  } catch (error) {
    console.error("Get enrolled courses error:", error)
    return []
  }
}

export async function getInstructorCourses() {
  const user = await currentUser()

  if (!user) {
    return []
  }

  try {
    const instructorCourses = await db
      .select({
        id: courses.id,
        title: courses.title,
        description: courses.description,
        thumbnailUrl: courses.thumbnailUrl,
        price: courses.price,
        category: courses.category,
        level: courses.level,
        status: courses.status,
        createdAt: courses.createdAt,
        updatedAt: courses.updatedAt,
        studentCount: count(enrollments.id),
        totalEarnings: sql<number>`COALESCE(SUM(${courses.price}), 0)`,
        averageRating: avg(reviews.rating),
      })
      .from(courses)
      .leftJoin(enrollments, eq(courses.id, enrollments.courseId))
      .leftJoin(reviews, eq(enrollments.id, reviews.enrollmentId))
      .where(eq(courses.instructorId, user.id))
      .groupBy(courses.id)
      .orderBy(desc(courses.createdAt))

    return instructorCourses
  } catch (error) {
    console.error("Get instructor courses error:", error)
    return []
  }
}

export async function createCourse(formData: FormData) {
  const user = await currentUser()

  if (!user) {
    return { success: false, message: "Unauthorized" }
  }

  // Check if user is an instructor
  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, user.id),
  })

  if (!dbUser || dbUser.role !== "instructor") {
    return { success: false, message: "Only instructors can create courses" }
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const category = formData.get("category") as string
  const price = Number.parseFloat(formData.get("price") as string)
  const level = formData.get("level") as string
  const thumbnailUrl = (formData.get("thumbnail_url") as string) || null

  try {
    const [newCourse] = await db
      .insert(courses)
      .values({
        instructorId: user.id,
        title,
        description,
        thumbnailUrl,
        price,
        category,
        level,
        status: "draft",
      })
      .returning({ id: courses.id })

    revalidatePath("/instructor/dashboard")
    revalidatePath("/instructor/courses")

    return {
      success: true,
      message: "Course created successfully",
      courseId: newCourse.id,
    }
  } catch (error) {
    console.error("Create course error:", error)
    return { success: false, message: "An error occurred while creating the course" }
  }
}

export async function getCourseDetails(courseId: number) {
  try {
    // Get course details
    const [course] = await db
      .select({
        id: courses.id,
        title: courses.title,
        description: courses.description,
        thumbnailUrl: courses.thumbnailUrl,
        price: courses.price,
        category: courses.category,
        level: courses.level,
        status: courses.status,
        createdAt: courses.createdAt,
        updatedAt: courses.updatedAt,
        instructorId: courses.instructorId,
        instructorName: users.name,
        instructorAvatar: users.avatarUrl,
      })
      .from(courses)
      .innerJoin(users, eq(courses.instructorId, users.id))
      .where(eq(courses.id, courseId))

    if (!course) {
      return null
    }

    // Get student count
    const [{ studentCount }] = await db
      .select({
        studentCount: count(enrollments.id),
      })
      .from(enrollments)
      .where(eq(enrollments.courseId, courseId))

    // Get average rating
    const [ratingResult] = await db
      .select({
        averageRating: avg(reviews.rating),
      })
      .from(reviews)
      .innerJoin(enrollments, eq(reviews.enrollmentId, enrollments.id))
      .where(eq(enrollments.courseId, courseId))

    const averageRating = ratingResult?.averageRating || 0

    // Get modules with lessons
    const courseModules = await db
      .select({
        id: modules.id,
        title: modules.title,
        position: modules.position,
      })
      .from(modules)
      .where(eq(modules.courseId, courseId))
      .orderBy(asc(modules.position))

    // Get lessons for each module
    const modulesWithLessons = await Promise.all(
      courseModules.map(async (module) => {
        const moduleLessons = await db
          .select({
            id: lessons.id,
            title: lessons.title,
            duration: lessons.duration,
            position: lessons.position,
            isFree: lessons.isFree,
          })
          .from(lessons)
          .where(eq(lessons.moduleId, module.id))
          .orderBy(asc(lessons.position))

        return {
          ...module,
          lessons: moduleLessons,
        }
      }),
    )

    // Get resources
    const courseResources = await db
      .select({
        id: resources.id,
        title: resources.title,
        type: resources.type,
        url: resources.url,
        size: resources.size,
        createdAt: resources.createdAt,
      })
      .from(resources)
      .where(eq(resources.courseId, courseId))
      .orderBy(desc(resources.createdAt))

    return {
      ...course,
      studentCount,
      averageRating,
      modules: modulesWithLessons,
      resources: courseResources,
    }
  } catch (error) {
    console.error("Get course details error:", error)
    return null
  }
}

export async function updateCourse(courseId: number, formData: FormData) {
  const user = await currentUser()

  if (!user) {
    return { success: false, message: "Unauthorized" }
  }

  try {
    // Check if user is the course instructor
    const course = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
    })

    if (!course || course.instructorId !== user.id) {
      return { success: false, message: "You don't have permission to update this course" }
    }

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const level = formData.get("level") as string
    const thumbnailUrl = (formData.get("thumbnail_url") as string) || course.thumbnailUrl
    const status = (formData.get("status") as "draft" | "published" | "archived") || course.status

    await db
      .update(courses)
      .set({
        title,
        description,
        thumbnailUrl,
        price,
        category,
        level,
        status,
        updatedAt: new Date(),
        publishedAt: status === "published" && course.status !== "published" ? new Date() : course.publishedAt,
      })
      .where(eq(courses.id, courseId))

    revalidatePath(`/instructor/courses/${courseId}`)
    revalidatePath("/instructor/courses")
    revalidatePath("/instructor/dashboard")

    return { success: true, message: "Course updated successfully" }
  } catch (error) {
    console.error("Update course error:", error)
    return { success: false, message: "An error occurred while updating the course" }
  }
}

export async function enrollInCourse(courseId: number) {
  const user = await currentUser()

  if (!user) {
    return { success: false, message: "Unauthorized" }
  }

  try {
    // Check if user is already enrolled
    const existingEnrollment = await db.query.enrollments.findFirst({
      where: and(eq(enrollments.studentId, user.id), eq(enrollments.courseId, courseId)),
    })

    if (existingEnrollment) {
      return { success: false, message: "You are already enrolled in this course" }
    }

    // Create enrollment
    const [enrollment] = await db
      .insert(enrollments)
      .values({
        studentId: user.id,
        courseId,
      })
      .returning({ id: enrollments.id })

    revalidatePath(`/courses/${courseId}`)
    revalidatePath("/student/dashboard")
    revalidatePath("/student/my-courses")

    return { success: true, message: "Successfully enrolled in course", enrollmentId: enrollment.id }
  } catch (error) {
    console.error("Enroll in course error:", error)
    return { success: false, message: "An error occurred while enrolling in the course" }
  }
}


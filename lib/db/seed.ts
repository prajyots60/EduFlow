import { db } from "./index"
import { users, courses, modules, lessons, resources } from "./schema"
import { hashPassword } from "../utils/password"
import "dotenv/config"

async function seed() {
  console.log("🌱 Seeding database...")

  // Create test users
  const hashedPassword = await hashPassword("Password123")

  // Create admin user
  const [adminUser] = await db
    .insert(users)
    .values({
      name: "Admin User",
      email: "admin@eduflow.com",
      password: hashedPassword,
      role: "admin",
      avatarUrl: "/placeholder.svg?height=40&width=40",
    })
    .returning()

  console.log("👤 Created admin user")

  // Create instructor user
  const [instructorUser] = await db
    .insert(users)
    .values({
      name: "Sarah Johnson",
      email: "instructor@eduflow.com",
      password: hashedPassword,
      role: "instructor",
      expertise: "programming",
      avatarUrl: "/placeholder.svg?height=40&width=40",
      bio: "Experienced web developer with 10+ years of teaching experience",
    })
    .returning()

  console.log("👤 Created instructor user")

  // Create student user
  const [studentUser] = await db
    .insert(users)
    .values({
      name: "John Smith",
      email: "student@eduflow.com",
      password: hashedPassword,
      role: "student",
      avatarUrl: "/placeholder.svg?height=40&width=40",
    })
    .returning()

  console.log("👤 Created student user")

  // Create a course
  const [course] = await db
    .insert(courses)
    .values({
      instructorId: instructorUser.id,
      title: "Introduction to Web Development",
      description:
        "Learn the fundamentals of web development including HTML, CSS, and JavaScript. This comprehensive course will take you from beginner to building your own responsive websites.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280",
      price: 49.99,
      category: "Programming",
      level: "Beginner",
      status: "published",
    })
    .returning()

  console.log("📚 Created course")

  // Create modules
  const [module1] = await db
    .insert(modules)
    .values({
      courseId: course.id,
      title: "Getting Started with HTML",
      position: 1,
    })
    .returning()

  const [module2] = await db
    .insert(modules)
    .values({
      courseId: course.id,
      title: "CSS Fundamentals",
      position: 2,
    })
    .returning()

  const [module3] = await db
    .insert(modules)
    .values({
      courseId: course.id,
      title: "JavaScript Basics",
      position: 3,
    })
    .returning()

  console.log("📝 Created modules")

  // Create lessons for module 1
  await db.insert(lessons).values([
    {
      moduleId: module1.id,
      title: "Introduction to HTML",
      content: "HTML is the standard markup language for creating web pages.",
      duration: "15:30",
      position: 1,
    },
    {
      moduleId: module1.id,
      title: "HTML Document Structure",
      content: "Learn about the basic structure of an HTML document.",
      duration: "12:45",
      position: 2,
    },
    {
      moduleId: module1.id,
      title: "Working with Text Elements",
      content: "Explore various HTML elements for formatting text.",
      duration: "18:20",
      position: 3,
    },
    {
      moduleId: module1.id,
      title: "Links and Navigation",
      content: "Learn how to create links and navigation menus in HTML.",
      duration: "14:10",
      position: 4,
    },
  ])

  // Create lessons for module 2
  await db.insert(lessons).values([
    {
      moduleId: module2.id,
      title: "Introduction to CSS",
      content: "CSS is used to style and layout web pages.",
      duration: "16:40",
      position: 1,
    },
    {
      moduleId: module2.id,
      title: "Selectors and Properties",
      content: "Learn about CSS selectors and properties.",
      duration: "20:15",
      position: 2,
    },
    {
      moduleId: module2.id,
      title: "Box Model and Layout",
      content: "Understand the CSS box model and layout techniques.",
      duration: "22:30",
      position: 3,
    },
    {
      moduleId: module2.id,
      title: "Responsive Design Basics",
      content: "Learn how to create responsive designs with CSS.",
      duration: "25:10",
      position: 4,
    },
  ])

  // Create lessons for module 3
  await db.insert(lessons).values([
    {
      moduleId: module3.id,
      title: "Introduction to JavaScript",
      content: "JavaScript is a programming language that enables interactive web pages.",
      duration: "18:50",
      position: 1,
    },
    {
      moduleId: module3.id,
      title: "Variables and Data Types",
      content: "Learn about JavaScript variables and data types.",
      duration: "14:25",
      position: 2,
    },
    {
      moduleId: module3.id,
      title: "Functions and Events",
      content: "Understand JavaScript functions and event handling.",
      duration: "23:15",
      position: 3,
    },
    {
      moduleId: module3.id,
      title: "DOM Manipulation",
      content: "Learn how to manipulate the Document Object Model with JavaScript.",
      duration: "26:40",
      position: 4,
    },
  ])

  console.log("📝 Created lessons")

  // Create resources
  await db.insert(resources).values([
    {
      courseId: course.id,
      title: "HTML Cheat Sheet",
      type: "PDF",
      url: "/resources/html-cheat-sheet.pdf",
      size: "1.2 MB",
    },
    {
      courseId: course.id,
      title: "CSS Reference Guide",
      type: "PDF",
      url: "/resources/css-reference-guide.pdf",
      size: "2.4 MB",
    },
    {
      courseId: course.id,
      title: "JavaScript Fundamentals",
      type: "PDF",
      url: "/resources/javascript-fundamentals.pdf",
      size: "3.1 MB",
    },
    {
      courseId: course.id,
      title: "Project Starter Files",
      type: "ZIP",
      url: "/resources/project-starter-files.zip",
      size: "5.6 MB",
    },
  ])

  console.log("📝 Created resources")

  console.log("✅ Seed completed successfully")
}

// Run the seed function
seed()
  .catch((e) => {
    console.error("❌ Seed failed")
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    process.exit(0)
  })


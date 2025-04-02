import { pgTable, text, timestamp, integer, boolean, serial, real, pgEnum } from "drizzle-orm/pg-core"

// Enums
export const userRoleEnum = pgEnum("user_role", ["student", "instructor", "admin"])
export const courseStatusEnum = pgEnum("course_status", ["draft", "published", "archived"])
export const lessonTypeEnum = pgEnum("lesson_type", ["video", "document", "quiz", "assignment"])

// Users Table
export const users = pgTable("users", {
  id: text("id").primaryKey(), // Clerk user id
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: userRoleEnum("role").notNull().default("student"),
  expertise: text("expertise"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isOnboarded: boolean("is_onboarded").default(false),
})

// Courses Table
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  instructorId: text("instructor_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  price: real("price").default(0),
  category: text("category"),
  level: text("level"),
  status: courseStatusEnum("status").default("draft").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  publishedAt: timestamp("published_at"),
})

// Modules Table (Course sections)
export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id")
    .references(() => courses.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Lessons Table
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id")
    .references(() => modules.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  description: text("description"),
  type: lessonTypeEnum("type").default("video").notNull(),
  content: text("content"), // URL for videos or content for documents
  position: integer("position").notNull().default(0),
  duration: text("duration"), // formatted duration (e.g., "10:30")
  isFree: boolean("is_free").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Enrollments Table
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  studentId: text("student_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  courseId: integer("course_id")
    .references(() => courses.id, { onDelete: "cascade" })
    .notNull(),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  expiresAt: timestamp("expires_at"),
})

// Progress Table
export const progress = pgTable("progress", {
  id: serial("id").primaryKey(),
  enrollmentId: integer("enrollment_id")
    .references(() => enrollments.id, { onDelete: "cascade" })
    .notNull(),
  lessonId: integer("lesson_id")
    .references(() => lessons.id, { onDelete: "cascade" })
    .notNull(),
  completed: boolean("completed").default(false),
  watchTime: integer("watch_time").default(0), // in seconds
  lastAccessed: timestamp("last_accessed").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
})

// Reviews Table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  enrollmentId: integer("enrollment_id")
    .references(() => enrollments.id, { onDelete: "cascade" })
    .notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Live Classes Table
export const liveClasses = pgTable("live_classes", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id")
    .references(() => courses.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  description: text("description"),
  scheduledFor: timestamp("scheduled_for").notNull(),
  duration: integer("duration"), // in minutes
  roomId: text("room_id"),
  recordingUrl: text("recording_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Favorites (Saved Courses) Table
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  studentId: text("student_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  courseId: integer("course_id")
    .references(() => courses.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Messages Table
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: text("sender_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  receiverId: text("receiver_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  courseId: integer("course_id").references(() => courses.id, { onDelete: "set null" }),
  content: text("content").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Resources Table
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id")
    .references(() => courses.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  type: text("type"),
  url: text("url"),
  size: text("size"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})


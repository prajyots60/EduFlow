import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: ["/", "/sign-in(.*)", "/sign-up(.*)", "/api/webhook/clerk", "/courses", "/courses/preview(.*)"],

  // Routes that can be accessed without authentication
  ignoredRoutes: ["/api/webhook/clerk"],
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}


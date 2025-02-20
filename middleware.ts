import { NextResponse, type NextRequest } from "next/server";
//import { updateSession } from "@/lib/supabase/middleware";
import { createClient } from "./lib/supabase/server";

export async function middleware(request: NextRequest) {
  // Public paths that don't require authentication
  const publicPaths = ["/login", "/auth/signout"];
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const isLoginPage = request.nextUrl.pathname === "/login";

  if (!data.user) {
    // Allow access to public paths
    if (isPublicPath) {
      return NextResponse.next();
    }
    // Redirect to login for protected routes
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Prevent authenticated users from accessing login page
  if (data.user && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

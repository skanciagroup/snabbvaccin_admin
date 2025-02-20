import { NextResponse, type NextRequest } from "next/server";
//import { updateSession } from "@/lib/supabase/middleware";
import { createClient } from "./lib/supabase/server";

export async function middleware(request: NextRequest) {
  // Public paths that don't require authentication
  //const publicPaths = ["/login", "/auth/signout"];
  //const isPublicPath = publicPaths.includes(request.nextUrl.pathname);
  const { pathname } = request.nextUrl;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const isLoginPage = request.nextUrl.pathname === "/login";

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!data.user) {
    // If the user is not authenticated and trying to access the login page, allow access
    if (isLoginPage) {
      return NextResponse.next();
    }
    // Redirect to the login page if the user is not authenticated
    return NextResponse.redirect(new URL("/login", request.url));
  } else if (isLoginPage) {
    // If the user is authenticated and trying to access the login page, redirect to the dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow access to authenticated users
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

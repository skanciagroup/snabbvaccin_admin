import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createClient } from "./lib/supabase/server";

export async function middleware(request: NextRequest) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser()
  // const {
  //   data: { user },
  //   error,
  // } = await supabase.auth.getUser();
  console.log('supabase', data.user?.email)
  const isLoginPage = request.nextUrl.pathname === '/login';

  if (error || !data.user) {
    // If the user is not authenticated and trying to access the login page, allow access
    if (isLoginPage) {
      return NextResponse.next();
    }
    await updateSession(request);
    // Redirect to the login page if the user is not authenticated
    return NextResponse.redirect(new URL('/login', request.url));
     
  }
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

// // middleware.ts
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function middleware(request: NextRequest) {
//   console.log('✅ Middleware triggered!', request.nextUrl.pathname);

//   const token = request.cookies.get('userCookie')?.value;
//   console.log('🪪 Cookie token:', token);

//   const protectedPaths = ['/cart', '/store'];
//   const isProtected = protectedPaths.some((path) =>
//     request.nextUrl.pathname.startsWith(path)
//   );

//   if (isProtected && !token) {
//     console.log('⛔️ Token missing. Redirecting to /login...');
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/cart/:path*', '/store/:path*'], // Wildcard matching
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
 
 
const userProtectedRoutes = [
  "/cart",
  "/cart/:path*",
  "/store",
  "/store/:path*",
];
 
async function isAuthenticated(request: NextRequest) {
  const token = request?.cookies?.get("userCookie")?.value;
  console.log("This is the token: ====>",{ token });
  if (!token) {
   return false;
  }
  return true;
}
 
export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const currentPath = url.pathname;
  const authenticated = await isAuthenticated(request);
  // ✅ Check if the current route is protected
  const isProtected =
    matchesRoute(currentPath, userProtectedRoutes);
  if (isProtected && !authenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

function matchesRoute(pathname: string, routes: string[]) {
    return routes.some(
      (route) =>
        pathname === route || pathname?.startsWith(route?.replace(":slug", ""))
    );
  }
 
// Middleware matcher
export const config = {
  matcher: [
    "/cart",
    "/cart/:path*",
    "/store",
    "/store/:path*",
  ],
};
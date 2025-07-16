
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const userCookie = request.cookies.get("userCookie")?.value;

  let role = null;
 // let token = null;

  if (userCookie) {
    try {
      // If cookie is a JSON string like { token: '...', role: 'admin' }
      const parsed = JSON.parse(userCookie);
      role = parsed.role;
    //  token = parsed.token;
    } catch (e) {
      console.log("Error parsing userCookie:", e);
    }
  }

  const currentPath = request.nextUrl.pathname;

  const routePermissions = [
    { path: "/cart", allowedRoles: ["user", "admin"] },
    { path: "/store", allowedRoles: ["admin"] } // Only admin can access /store
  ];

  const matchedRoute = routePermissions.find(({ path }) =>
    currentPath.startsWith(path)
  );

  if (matchedRoute) {
    if (!userCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (!matchedRoute.allowedRoles.includes(role)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

 //  Redirect already logged-in users away from /login or /register
 const publicAuthRoutes = ["/login", "/register"];
 const isTryingToAccessAuthPage = publicAuthRoutes.includes(currentPath);

 if (userCookie && isTryingToAccessAuthPage) {
   return NextResponse.redirect(new URL("/", request.url));
 }

 return NextResponse.next();
}

export const config = {
 matcher: [
   "/cart/:path*",
   "/store/:path*",
   "/login",
   "/register"
 ],
};


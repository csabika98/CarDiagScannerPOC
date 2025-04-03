// // middleware.js
// import { NextResponse } from 'next/server';

// export function middleware(request) {
//   // Check if the user has uploaded images
//   const hasUploadedImages = request.cookies.get('hasUploadedImages');

//   // If no images were uploaded, redirect to the home page or upload page
//   if (request.nextUrl.pathname === '/DmgAssist' && !hasUploadedImages) {
//     return NextResponse.redirect(new URL('/', request.url)); // Redirect to homepage or upload page
//   }
  
//   return NextResponse.next(); // Continue with the request
// }

// export const config = {
//   matcher: ['/DmgAssist'], // Only apply this middleware to the /DmgAssist route
// };

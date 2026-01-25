import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  // Middleware is now empty as proxy functionality has been moved to API routes
  return NextResponse.next();
}

// Configure the middleware if needed for other routes
export const config = {
  matcher: [],
};

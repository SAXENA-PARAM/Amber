// src/app/api/auth/token/route.ts

import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Get the session using `getSession` and pass the request object
    const session = await getSession(req);

    if (!session || !session.accessToken) {
      return NextResponse.json({ error: 'Access token not found' }, { status: 401 });
    }

    // Access token found, return it
    console.log(session);

    return NextResponse.json({ accessToken: session.accessToken });
  } catch (error) {
    console.error('Error retrieving session or access token:', error);
    return NextResponse.json({ error: 'Failed to fetch access token' }, { status: 500 });
  }
}

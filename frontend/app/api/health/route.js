import { NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'OK',
    message: 'PulsePixelTech API is running',
    timestamp: new Date().toISOString()
  });
}
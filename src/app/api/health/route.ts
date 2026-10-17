import { NextResponse } from 'next/server';

/** Cloud Run gọi route này để biết web còn sống. Chạy trên server Next, không cần trình duyệt. */
export function GET() {
  return NextResponse.json({
    status: 'ok',
    version: process.env.NEXT_PUBLIC_APP_VERSION ?? '0.0.0',
  });
}

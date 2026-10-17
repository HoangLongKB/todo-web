import { NextResponse } from 'next/server';

/** Gọi sau khi deploy để instance mới "nóng máy" trước khi nhận traffic thật. */
export function GET() {
  return NextResponse.json({ warm: true, at: new Date().toISOString() });
}

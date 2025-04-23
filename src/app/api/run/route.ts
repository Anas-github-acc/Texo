// optional: proxy POST to Rust server
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.text();

  const res = await fetch('http://localhost:8080/run', {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body,
  });

  const text = await res.text();
  return new NextResponse(text, { status: res.status });
}

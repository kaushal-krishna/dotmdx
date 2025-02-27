import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Welcome to DotMDX next server route", status: 200 }, { status: 200 });
}
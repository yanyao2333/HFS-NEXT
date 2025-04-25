import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	return await fetch(request.nextUrl.searchParams.get("url") as string);
}

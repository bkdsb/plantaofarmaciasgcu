import { NextResponse } from "next/server";

import { generateAutomaticDutyCalendarAction } from "@/actions/admin/duty-actions";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expected = process.env.CRON_SECRET;

  if (!expected || authHeader !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  try {
    await generateAutomaticDutyCalendarAction(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

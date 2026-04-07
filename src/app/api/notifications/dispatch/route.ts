import { NextResponse } from "next/server";

import { dispatchDueNotifications } from "@/lib/notifications/dispatcher";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expected = process.env.CRON_SECRET;

  if (!expected || authHeader !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await dispatchDueNotifications();

  return NextResponse.json({ ok: true, ...result });
}

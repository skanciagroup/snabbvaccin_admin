import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();

  try {
    await supabase.auth.signOut();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error signing out:", error);
    return NextResponse.json({ error: "Failed to sign out" }, { status: 500 });
  }
}

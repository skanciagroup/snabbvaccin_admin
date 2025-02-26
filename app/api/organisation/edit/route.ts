import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function PUT(request: Request) {
  const { id, name } = await request.json();

  // Check if another organisation with the same name exists, excluding the current organisation
  const { data: nameCheck, error: nameCheckError } = await supabase
    .from("organisations")
    .select("*")
    .eq("name", name)
    .neq("id", id) // Exclude the current organisation
    .limit(1);

  if (nameCheckError) {
    return NextResponse.json(
      { message: nameCheckError.message },
      { status: 400 },
    );
  }

  // Check if any organisation exists with the same name
  if (nameCheck.length > 0) {
    return NextResponse.json(
      {
        message: "Organisation with this name already exists.",
        status: 409,
      },
      { status: 409 },
    );
  }

  // Update the organisation
  const { error } = await supabase
    .from("organisations")
    .update({ name })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Organisation updated successfully" });
}

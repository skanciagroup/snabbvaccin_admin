import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

export async function PUT(request: Request) {
  const { id, name, reg_no } = await request.json();

  // Check if another bus with the same reg_no exists, excluding the current bus
  const { data: existingBuses, error: fetchError } = await supabaseAdmin
    .from("busses")
    .select("*")
    .eq("reg_no", reg_no)
    .neq("id", id) // Exclude the current bus
    .limit(1);

  if (fetchError) {
    return NextResponse.json({ message: fetchError.message }, { status: 400 });
  }

  // Check if any bus exists with the same reg_no
  if (existingBuses.length > 0) {
    return NextResponse.json(
      {
        message: "Bus with this registration number already exists.",
        status: 409,
      },
      { status: 409 },
    );
  }

  // Check if the name is being changed to an existing name
  const { data: nameCheck, error: nameCheckError } = await supabaseAdmin
    .from("busses")
    .select("*")
    .eq("name", name)
    .neq("id", id) // Exclude the current bus
    .limit(1);

  if (nameCheckError) {
    return NextResponse.json(
      { message: nameCheckError.message },
      { status: 400 },
    );
  }

  // Check if any bus exists with the same name
  if (nameCheck.length > 0) {
    return NextResponse.json(
      {
        message: "Bus with this name already exists.",
        status: 409,
      },
      { status: 409 },
    );
  }

  // Update the bus
  const { error } = await supabaseAdmin
    .from("busses")
    .update({ name, reg_no })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Bus updated successfully" });
}

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

export async function PUT(request: Request) {
  const { id, name, address, mvid } = await request.json();
  console.log(id, name, address, mvid);
  // Validate input


  // Check if another bus with the same reg_no exists, excluding the current bus
  const { data: existingBuses, error: fetchError } = await supabaseAdmin
    .from("locations")
    .select("*")
    .eq("mvid", mvid)
    .neq("id", id) // Exclude the current bus from the check
    .limit(1);

  if (fetchError) {
    return NextResponse.json({ message: fetchError.message }, { status: 400 });
  }

  // If a bus with the same reg_no exists, return a conflict response
  if (existingBuses.length > 0) {
    return NextResponse.json(
      {
        message: "Location with this mvid already exists.",
        status: 409,
      },
      { status: 409 },
    );
  }

  // Update the bus
  const { error } = await supabaseAdmin
    .from("locations")
    .update({ name, address, mvid })
    .eq("id", id);
  
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json(
    { message: "Location updated successfully", status: 200 },
    { status: 200 },
  );
}

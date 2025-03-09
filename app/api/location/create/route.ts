import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  const { name, mvid, address } = await request.json();

  // Check if a bus with the same reg_no already exists
  const { data: existingBuses, error: fetchError } = await supabaseAdmin
    .from("locations")
    .select("*")
    .eq("mvid", mvid)
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

  // Create a new bus
  const { error } = await supabaseAdmin
    .from("locations")
    .insert([{ name, mvid, address }]);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json(
    { message: "Location created successfully", status: 201 },
    { status: 201 },
  );
}

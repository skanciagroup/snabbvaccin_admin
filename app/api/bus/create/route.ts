import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  const { name, reg_no, type } = await request.json();

  // Check if a bus with the same reg_no already exists
  const { data: existingBuses, error: fetchError } = await supabaseAdmin
    .from("busses")
    .select("*")
    .eq("reg_no", reg_no)
    .limit(1);

  if (fetchError) {
    return NextResponse.json({ message: fetchError.message }, { status: 400 });
  }

  // If a bus with the same reg_no exists, return a conflict response
  if (existingBuses.length > 0) {
    return NextResponse.json(
      {
        message: "Bus with this registration number already exists.",
        status: 409,
      },
      { status: 409 },
    );
  }

  // Create a new bus
  const { error } = await supabaseAdmin
    .from("busses")
    .insert([{ name, reg_no, type }]);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json(
    { message: "Bus created successfully", status: 201 },
    { status: 201 },
  );
}

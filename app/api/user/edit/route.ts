import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ProfileUser } from "@/types/database"; // Adjust the import based on your actual User type

// Initialize Supabase client with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

export async function PUT(request: Request) {
  const body: ProfileUser = await request.json();
  const {
    first_name,
    user_id,
    last_name,
    personal_number,
    phone,
    vaccinator,
    license,
    license_type,
  } = body;

  // Update user profile in the profiles table
  const { data, error: profileError } = await supabaseAdmin
    .from("profiles")
    .update({
      first_name,
      last_name,
      personal_number: personal_number === "" ? null : personal_number,
      phone: phone === "" ? null : phone,
      vaccinator,
      license,
      license_type,
    })
    .eq("user_id", user_id); // Assuming user_id is the foreign key in profiles table

  if (profileError) {
    return NextResponse.json(
      { message: profileError.message },
      { status: 400 },
    );
  }

  return NextResponse.json({
    message: "User updated successfully",
    status: 200,
    data,
  });
}

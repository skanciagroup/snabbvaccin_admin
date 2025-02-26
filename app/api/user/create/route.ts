import { NextResponse } from "next/server";
import { ProfileUser } from "@/types/database";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; // Your Supabase URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // Your Supabase service role key
// Explicitly type as SupabaseClient
const supabaseAdmin = createClient(supabaseUrl!, supabaseKey!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
const adminAuthClient = supabaseAdmin.auth.admin;

export async function POST(request: Request) {
  const body: ProfileUser = await request.json();
  const {
    email,
    password,
    first_name,
    last_name,
    personal_number,
    phone,
    vaccinator,
    license,
    license_type,
  } = body;

  // Check if the user already exists
  const {
    data: { users },
    error: fetchError,
  } = await adminAuthClient.listUsers();

  if (fetchError) {
    return NextResponse.json({ message: fetchError.message }, { status: 400 });
  }

  // Check if the user with the given email exists
  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    return NextResponse.json({
      message: "User with this email already exists.",
      status: 409,
    });
  }

  // Add user to Supabase Auth
  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: false,
  });

  console.log("User data", user);
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 409 });
  } else {
    //here we add the user data to profiles table
    const { data, error } = await supabaseAdmin.from("profiles").insert({
      user_id: user!.id,
      first_name,
      last_name,
      personal_number: personal_number === "" ? null : personal_number,
      phone: phone === "" ? null : phone,
      vaccinator,
      license,
      license_type,
    });

    if (error) {
      console.error("Error inserting profile:", error);
      return NextResponse.json(
        { message: error.message, status: 400 },
        { status: 400 },
      );
    }

    return NextResponse.json({
      message: "User created successfully",
      status: 201,
      data,
    });
  }

  // Send back a success message
}

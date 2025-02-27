import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);
const adminAuthClient = supabaseAdmin.auth.admin;

export async function GET() {
  // Fetch the list of users from the auth table
  const { data: { users }, error: fetchError } = await adminAuthClient.listUsers();

  if (fetchError) {
    return NextResponse.json({ message: fetchError.message }, { status: 400 });
  }

  // Fetch the profiles from the profiles table
  const { data: profiles, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("*");

  if (profileError) {
    return NextResponse.json({ message: profileError.message }, { status: 400 });
  }

  // Combine users and profiles based on user_id
  const combinedData = profiles.map(profile => {
    const user = users.find(user => user.id === profile.user_id);
    return {
      ...profile,
      email: user ? user.email : null, // Add email to the profile
    };
  });

  return NextResponse.json(combinedData, { status: 200 });
}
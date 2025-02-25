import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; // Your Supabase URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // Your Supabase service role key
const supabaseAdmin = createClient(supabaseUrl!, supabaseKey!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function POST(request: Request) {
  const body = await request.json();
  const { name } = body;

  // Check if the organization already exists
  const { data: existingOrgs, error: fetchError } = await supabaseAdmin
    .from("organisations")
    .select("*")
    .eq("name", name)
    .limit(1); // Limit to 1 result

  if (fetchError) {
    return NextResponse.json({ message: fetchError.message }, { status: 400 });
  }

  // Check if any organization exists
  if (existingOrgs.length > 0) {
    return NextResponse.json(
      { message: "Organization with this name already exists.", status: 409 },
      { status: 409 }
    );
  }

  // Create a new organization
  const { error } = await supabaseAdmin
    .from("organisations")
    .insert([{ name }]);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json(
    { message: "Organization created successfully", status: 201 },
    { status: 201 }
  );
}

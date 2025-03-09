import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

// Initialize Supabase client with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  const { name, file_type, file } = await request.json(); // Expecting file data to be sent as base64 or similar
  console.log(name, file_type, file,);
  // Check if a document with the same name already exists
  const { data: existingDocuments, error: fetchError } = await supabaseAdmin
    .from("documents")
    .select("*")
    .eq("name", name)
    .limit(1);

  if (fetchError) {
    return NextResponse.json({ message: fetchError.message }, { status: 400 });
  }

  // If a document with the same name exists, return a conflict response
  if (existingDocuments.length > 0) {
    return NextResponse.json(
      {
        message: "Document with this name already exists.",
        status: 409,
      },
      { status: 409 },
    );
  }
  const formattedName = name.toLowerCase().replace(/\s+/g, '_');
  const filename = `${formattedName}_${uuidv4()}`;
  // Create a new document
  const { error } = await supabaseAdmin
    .from("documents")
    .insert([{ name, file_type, filename }]); // Assuming file is handled appropriately

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json(
    { message: "Document created successfully", status: 201, filename  },
    { status: 201 },
  );
}

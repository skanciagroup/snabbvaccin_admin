import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

export async function PUT(request: Request) {
  const { id, name, file_type } = await request.json();

  // Get current document to compare names
  const { data: currentDoc } = await supabaseAdmin
    .from("documents")
    .select("name")
    .eq("id", id)
    .single();

  // If name is different from current name, check for duplicates
  if (currentDoc && currentDoc.name !== name) {
    const { data: nameCheck, error: nameCheckError } = await supabaseAdmin
      .from("documents")
      .select("*")
      .eq("name", name)
      .neq("id", id)
      .limit(1);

    if (nameCheckError) {
      return NextResponse.json(
        { message: nameCheckError.message },
        { status: 400 },
      );
    }

    if (nameCheck && nameCheck.length > 0) {
      return NextResponse.json(
        { message: "Document with this name already exists.", status: 409 },
        { status: 409 },
      );
    }
  }

  // Update only the name and file_type if provided
  const updateData = file_type ? { name, file_type } : { name };

  const { error } = await supabaseAdmin
    .from("documents")
    .update(updateData)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json(
    { message: "Document updated successfully", status: 200 },
    { status: 200 },
  );
}

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

export async function DELETE(request: Request) {
  const { id } = await request.json();

  // First get the document to get its filename
  const { data: document, error: fetchError } = await supabaseAdmin
    .from("documents")
    .select("filename")
    .eq("id", id)
    .single();

  if (fetchError) {
    return NextResponse.json({ message: fetchError.message }, { status: 400 });
  }

  // Delete the file from storage
  if (document?.filename) {
    const { error: storageError } = await supabaseAdmin.storage
      .from("snabbvaccin")
      .remove([document.filename]);

    if (storageError) {
      return NextResponse.json(
        { message: storageError.message },
        { status: 400 },
      );
    }
  }

  // Delete the document record from the database
  const { error: deleteError } = await supabaseAdmin
    .from("documents")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return NextResponse.json({ message: deleteError.message }, { status: 400 });
  }

  return NextResponse.json(
    { message: "Document deleted successfully" },
    { status: 200 },
  );
}

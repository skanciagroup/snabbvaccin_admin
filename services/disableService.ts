import { createClient } from "@supabase/supabase-js";


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

export const toggleDisabled = async (tableName: string, rowId: number) => {
  // Fetch the current state of the row
  const { data: row, error: fetchError } = await supabaseAdmin
    .from(tableName)
    .select("disabled")
    .eq("id", rowId)
    .single(); // Expect a single row

  if (fetchError) {
    throw new Error(`Error fetching row: ${fetchError.message}`);
  }

  // Toggle the disabled state
  const newDisabledState = !row.disabled;

  // Update the row with the new disabled state
  const { error: updateError } = await supabaseAdmin
    .from(tableName)
    .update({ disabled: newDisabledState })
    .eq("id", rowId);

  if (updateError) {
    throw new Error(`Error updating row: ${updateError.message}`);
  }
  return { message: "Toggle successful", newDisabledState };
};

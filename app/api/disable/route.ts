import { NextResponse } from "next/server";
import { toggleDisabled } from "@/services/disableService";

export async function POST(request: Request) {
  const { tableName, row } = await request.json();
  console.log("in the api", tableName, row.id);
  console.log("Request Payload:", {
    tableName: "busses",
    row: { id: row.id },
  });
  if (!row || typeof row.id !== "number") {
    return NextResponse.json({ message: "Invalid row data" }, { status: 400 });
  }

  try {
    const result = await toggleDisabled(tableName, row.id);
    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { message: "An unknown error occurred." },
      { status: 400 },
    );
  }
}

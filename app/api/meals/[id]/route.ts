import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete meal items first (foreign key)
    const { error: itemsError } = await supabaseAdmin
      .from("meal_items")
      .delete()
      .eq("meal_log_id", id);

    if (itemsError) {
      throw itemsError;
    }

    // Delete meal log
    const { error: mealError } = await supabaseAdmin
      .from("meal_logs")
      .delete()
      .eq("id", id);

    if (mealError) {
      throw mealError;
    }

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to delete meal.",
      },
      {
        status: 500,
      }
    );
  }
}
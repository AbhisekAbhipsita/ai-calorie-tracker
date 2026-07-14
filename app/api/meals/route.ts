import { NextResponse } from "next/server";
//import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const {
      userId,
      mealType,
      rawText,
      nutrition,
    } = await request.json();

    // -----------------------------
    // Save Meal Log
    // -----------------------------
    const { data: mealLog, error: mealError } = await supabaseAdmin 
      .from("meal_logs")
      .insert({
        user_id: userId,
        meal_type: mealType,
        raw_text: rawText,
      })
      .select()
      .single();

    if (mealError) throw mealError;

    // -----------------------------
    // Save Meal Items
    // -----------------------------
    const items = nutrition.items.map((item: any) => ({
      meal_log_id: mealLog.id,

      food_name: item.name,

      quantity: parseFloat(item.quantity) || 1,

      unit:
        item.quantity
          ?.replace(/[0-9.]/g, "")
          .trim() || "serving",

      calories: Number(item.calories) || 0,

      protein: Number(item.protein) || 0,

      carbs: Number(item.carbs) || 0,

      fat: Number(item.fat) || 0,

      fiber: Number(item.fiber) || 0,

      sugar: Number(item.sugar) || 0,

      sodium: Number(item.sodium) || 0,

      calcium: Number(item.calcium) || 0,

      iron: Number(item.iron) || 0,

      vitamin_c: Number(item.vitamin_c) || 0,
    }));

    const { error: itemError } = await supabaseAdmin
      .from("meal_items")
      .insert(items);

    if (itemError) throw itemError;

    return NextResponse.json({
      success: true,
    });

  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      {
        status: 500,
      }
    );
  }
}




// import { NextResponse } from "next/server";
// import { supabaseAdmin } from "@/lib/supabaseAdmin";

// export async function POST(request: Request) {
//   try {
//     const {
//       userId,
//       mealType,
//       rawText,
//       nutrition,
//     } = await request.json();

//     // Save meal log
//     const { data: mealLog, error: mealError } = await supabaseAdmin 
//       .from("meal_logs")
//       .insert({
//         user_id: userId,
//         meal_type: mealType,
//         raw_text: rawText,
//       })
//       .select()
//       .single();

//     if (mealError) throw mealError;

//     // Save meal items
//     const items = nutrition.items.map((item: any) => ({
//   meal_log_id: mealLog.id,
//   food_name: item.name,
//   quantity: parseFloat(item.quantity) || 1,
//   unit: item.quantity.replace(/[0-9.]/g, "").trim() || "serving",
//   calories: item.calories,
//   protein: item.protein,
//   carbs: item.carbs,
//   fat: item.fat,
// }));

//     const { error: itemError } = await supabaseAdmin
//       .from("meal_items")
//       .insert(items);

//     if (itemError) throw itemError;

//     return NextResponse.json({
//       success: true,
//     });

//   } catch (err: any) {
//     console.error(err);

//     return NextResponse.json(
//       {
//         success: false,
//         error: err.message,
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }
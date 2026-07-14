import { supabase } from "./supabase";
import { NutritionResult } from "@/types/nutrition";

export async function saveMeal(
  userId: string,
  rawText: string,
  mealType: string,
  nutrition: NutritionResult
) {
  // Step 1: Save meal log
  const { data: mealLog, error: mealError } = await supabase
    .from("meal_logs")
    .insert({
      user_id: userId,
      meal_type: mealType,
      raw_text: rawText,
    })
    .select()
    .single();

  if (mealError) {
    throw mealError;
  }

  // Step 2: Prepare meal items
  const mealItems = nutrition.items.map((item) => ({
    meal_log_id: mealLog.id,
    food_name: item.name,
    quantity: Number(item.quantity) || 1,
    unit: item.quantity.replace(/[0-9.]/g, "").trim() || "serving",
    calories: item.calories,
    protein: item.protein,
  }));

  // Step 3: Save all food items
  const { error: itemsError } = await supabase
    .from("meal_items")
    .insert(mealItems);

  if (itemsError) {
    throw itemsError;
  }

  return mealLog;
}
import { NextResponse } from "next/server";
import { groq } from "@/lib/groq";

export async function POST(request: Request) {
  try {
    const { meal } = await request.json();

    const prompt = `
You are an expert Indian nutritionist.

Analyze the meal described below.

Use Indian food nutrition data wherever possible.

Estimate nutrition as accurately as possible based on the quantity mentioned.

Support Indian units like:
- roti
- chapati
- katori
- bowl
- cup
- glass
- teaspoon
- tablespoon
- piece
- gram (g)
- kilogram (kg)

Return ONLY valid JSON.

JSON Format:

{
  "items":[
    {
      "name":"",
      "quantity":"",
      "calories":0,
      "protein":0,
      "carbs":0,
      "fat":0,
      "fiber":0,
      "sugar":0,
      "sodium":0,
      "calcium":0,
      "iron":0,
      "vitamin_c":0
    }
  ],
  "totalCalories":0,
  "totalProtein":0,
  "totalCarbs":0,
  "totalFat":0,
  "totalFiber":0,
  "totalSugar":0,
  "totalSodium":0,
  "totalCalcium":0,
  "totalIron":0,
  "totalVitaminC":0
}

Rules:
- Return JSON only.
- No markdown.
- No explanation.
- Use numbers only.
- Sodium in mg.
- Calcium in mg.
- Iron in mg.
- Vitamin C in mg.

Meal:
${meal}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content =
      completion.choices[0]?.message?.content ?? "";

    const cleaned = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const json = JSON.parse(cleaned);

    return NextResponse.json({
      success: true,
      data: json,
    });

  } catch (error: any) {
    console.error("Groq Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}





















// import { NextResponse } from "next/server";
// import { openrouter } from "@/lib/openrouter";

// export async function POST(request: Request) {
//   try {
//     const { meal } = await request.json();

//     const prompt = `
// You are an expert Indian nutritionist.

// Estimate calories, protein, carbs and fat.

// Support Indian foods.

// Return ONLY valid JSON.

// JSON Format:

// {
//   "items":[
//     {
//       "name":"",
//       "quantity":"",
//       "calories":0,
//       "protein":0,
//       "carbs":0,
//       "fat":0
//     }
//   ],
//   "totalCalories":0,
//   "totalProtein":0,
//   "totalCarbs":0,
//   "totalFat":0
// }

// Meal:
// ${meal}
// `;

//     const completion = await openrouter.chat.completions.create({
//       model: "qwen/qwen3-coder:free",
//       messages: [
//         {
//           role: "user",
//           content: prompt,
//         },
//       ],
//       temperature: 0.2,
//     });

//     const content = completion.choices[0].message.content ?? "";

//     const cleaned = content
//       .replace(/```json/g, "")
//       .replace(/```/g, "")
//       .trim();

//     const json = JSON.parse(cleaned);

//     return NextResponse.json({
//       success: true,
//       data: json,
//     });

//   } catch (error: any) {
//     console.error(error);

//     return NextResponse.json(
//       {
//         success: false,
//         error: error.message,
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }
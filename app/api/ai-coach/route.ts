import { NextResponse } from "next/server";
import { groq } from "@/lib/groq";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const prompt = `
You are an expert sports nutritionist.

Give short actionable advice.

Today's Nutrition

Calories:
${body.calories}/${body.goalCalories}

Protein:
${body.protein}/${body.goalProtein}

Return ONLY 4-6 bullet points.

Do not use markdown.
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    return NextResponse.json({
      advice: completion.choices[0].message.content,
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Unable to generate advice." },
      { status: 500 }
    );
  }
}
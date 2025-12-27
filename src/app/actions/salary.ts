'use server'

import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function estimateSalary(description: string, title: string, location: string) {
    if (!description || description.length < 50) return null;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are an expert Swedish labor market analyst. 
                    Estimate the monthly salary range for the given job description in SEK.
                    - Analyze requirements, seniority, and location.
                    - If the job is likely Part-Time or Hourly, convert to a full-time monthly equivalent if possible, or mark as such.
                    - Be conservative. Wide ranges are better than wrong guesses.
                    - Return ONLY a JSON object: { "min": number, "max": number, "currency": "SEK", "period": "MONTHLY" | "HOURLY" }
                    - If you absolutely cannot guess, return null.`
                },
                {
                    role: "user",
                    content: `Title: ${title}\nLocation: ${location}\n\nDescription:\n${description.slice(0, 3000)}`
                }
            ],
            temperature: 0,
            response_format: { type: "json_object" }
        });

        const content = response.choices[0].message.content;
        if (!content) return null;

        const result = JSON.parse(content);
        return {
            min: result.min,
            max: result.max,
            currency: result.currency || 'SEK',
            period: result.period || 'MONTHLY'
        };
    } catch (err) {
        console.error("Salary Estimation Error:", err);
        return null;
    }
}

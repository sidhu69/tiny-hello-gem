import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, astrologyData, conversationHistory } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    console.log("Processing astrology chat request");

    // Build context from astrology data
    const planetsList = Object.entries(astrologyData.planets)
      .map(([planet, data]: [string, any]) => 
        `${planet}: ${data.sign} at ${data.degree}° in ${data.house} house`
      )
      .join("\n");

    const systemPrompt = `You are a psychologically-informed astrologer combining ancient wisdom with modern depth psychology. You help people understand their birth chart as a map of their psyche and life patterns.

Birth Chart:
- System: ${astrologyData.systemType === "vedic" ? "Vedic" : "Western"}
- Ascendant: ${astrologyData.ascendant}
- Born: ${astrologyData.birthDetails.date} at ${astrologyData.birthDetails.time} in ${astrologyData.birthDetails.place}

Planets:
${planetsList}

Key Insights:
- Personality: ${astrologyData.interpretations.personality}
- Relationships: ${astrologyData.interpretations.relationships}
- Career: ${astrologyData.interpretations.career}
- Health: ${astrologyData.interpretations.health}

Your Approach:
- Integrate psychological depth: reference archetypes, shadow work, and developmental patterns
- Connect astrological symbols to real psychological dynamics and behaviors
- Help users see their chart as showing both challenges and growth opportunities
- When discussing relationships, address attachment styles and relational patterns
- For career questions, explore purpose, fulfillment, and psychological drives beyond just success
- Address timing questions by explaining planetary cycles and developmental phases
- Recognize that difficult placements often represent the greatest growth potential

Communication Style:
- Natural and conversational, like a wise friend who really gets psychology
- Keep most answers 2-4 sentences unless depth is specifically requested
- Skip long preambles - get straight to insight
- Use clear language that bridges astrology and psychology
- Give practical guidance rooted in self-awareness
- When asked about timing (marriage, career changes), provide developmental context and likely windows based on their age and transits
- Be honest about challenges while emphasizing growth potential

Remember: Astrology is a symbolic language for understanding the psyche. Help users develop self-awareness, not just predict events.`;

    // Build messages array with conversation history
    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: message },
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages,
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in astrology-chat:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

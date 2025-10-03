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

    const systemPrompt = `You are a friendly astrologer having a casual conversation. You have the user's birth chart and help them understand it in a natural, human way.

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

How to respond:
- Chat naturally like a knowledgeable friend, not an essay writer
- Keep answers short and focused - 2-3 sentences max unless they ask for details
- Directly answer what they asked without long introductions
- Use simple language, avoid overly formal or mystical tone
- Reference their specific placements when relevant
- If you don't know something, just say so simply

Be conversational, clear, and helpful.`;

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
        model: "google/gemini-2.5-flash",
        messages,
        temperature: 0.8,
        max_tokens: 800,
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

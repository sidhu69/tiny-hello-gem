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

    const systemPrompt = `You are an expert astrologer and spiritual guide. You have access to the user's complete birth chart and should provide insightful, personalized guidance based on their specific astrological configuration.

Birth Chart Information:
- Astrology System: ${astrologyData.systemType === "vedic" ? "Vedic (Sidereal)" : "Western (Tropical)"}
- Ascendant: ${astrologyData.ascendant}
- Birth Details: ${astrologyData.birthDetails.date} at ${astrologyData.birthDetails.time} in ${astrologyData.birthDetails.place}

Planetary Positions:
${planetsList}

Previous Interpretations Generated:
- Personality: ${astrologyData.interpretations.personality}
- Relationships: ${astrologyData.interpretations.relationships}
- Career: ${astrologyData.interpretations.career}
- Health: ${astrologyData.interpretations.health}

Guidelines:
1. Answer questions based on the user's specific planetary positions and chart
2. Be warm, insightful, and empowering in your responses
3. Reference specific planets and their positions when relevant
4. Provide practical guidance along with spiritual insights
5. Keep responses concise but meaningful (2-4 paragraphs)
6. If asked about topics not covered, use the planetary positions to derive insights
7. Be honest if certain predictions require additional astrological factors not available

Always relate your answers back to their unique chart configuration.`;

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

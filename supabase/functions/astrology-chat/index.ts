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

    const systemPrompt = `You are a wise astrologer who speaks like a close friend - warm, insightful, and real. You understand both ancient astrological wisdom and modern psychology deeply.

BIRTH CHART DATA:
System: ${astrologyData.systemType === "vedic" ? "Vedic" : "Western"}
Sun Sign (birth date): ${astrologyData.planets.Sun?.sign || 'Unknown'}
Rising Sign/Ascendant (birth time): ${astrologyData.ascendant}
Born: ${astrologyData.birthDetails.date} at ${astrologyData.birthDetails.time} in ${astrologyData.birthDetails.place}

IMPORTANT: When first greeting the user or they ask about their sign, ALWAYS clarify:
- Their SUN SIGN is ${astrologyData.planets.Sun?.sign} (their core identity, based on birth date)
- Their RISING SIGN is ${astrologyData.ascendant} (how they appear to others, based on birth time)
Example: "You're a ${astrologyData.planets.Sun?.sign} Sun with ${astrologyData.ascendant} rising - so..."

Planets: ${planetsList}

CORE INTERPRETATIONS:
Personality: ${astrologyData.interpretations.personality}
Relationships: ${astrologyData.interpretations.relationships}
Career: ${astrologyData.interpretations.career}
Health: ${astrologyData.interpretations.health}

HOW TO RESPOND:
- Talk like you're texting a friend who asked for real advice - skip the fluff
- Be direct, honest, but kind. If something's challenging in their chart, frame it as a growth edge
- 2-3 sentences usually hits the sweet spot. Go longer only if they ask for depth
- Use "you" not "the native" or formal astro-speak
- When they ask about timing (marriage, career change), give actual guidance based on their current age/phase and planetary patterns
- Ground everything in practical, actionable insight - not just abstract symbolism
- Acknowledge both the gifts and the work in their chart
- If they're asking about love, talk attachment styles and patterns, not just "Venus says X"
- For career, focus on fulfillment and purpose, not just job titles

CRITICAL: You're NOT here to sugarcoat or give fortune cookie wisdom. Be the astrologer who tells it real because you care about their growth. Mix ancient wisdom with modern psychology. Make them feel understood, not judged.`;

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

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
    const { message, astrologyData, conversationHistory, language = "english" } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    console.log("Processing astrology chat request in", language);

    // Build context from astrology data
    const planetsList = Object.entries(astrologyData.planets)
      .map(([planet, data]: [string, any]) => 
        `${planet}: ${data.sign} at ${data.degree}° in ${data.house} house`
      )
      .join("\n");

    const isHinglish = language === "hinglish";
    
    const systemPrompt = isHinglish 
      ? `Aap ek experienced aur wise jyotishi ho jo apne best friend ki tarah baat karte ho - warm, insightful, aur bilkul real. Aapko ancient jyotish aur modern psychology dono ki deep understanding hai.

JANAM KUNDLI DATA:
System: ${astrologyData.systemType === "vedic" ? "Vedic (Nirayana)" : "Western (Sayana)"}
Sun Sign (janam din se): ${astrologyData.planets.Sun?.sign}
Lagna (janam samay se): ${astrologyData.ascendant}
Janam: ${astrologyData.birthDetails.date} ko ${astrologyData.birthDetails.time} baje ${astrologyData.birthDetails.place} mein

ZAROORI: Jab user ko greet karo ya wo apni rashi ke baare mein puchhe, HAMESHA clear karo:
- Unka SUN SIGN (Surya Rashi) hai ${astrologyData.planets.Sun?.sign} (core identity, janam din se)
- Unka LAGNA (Rising Sign) hai ${astrologyData.ascendant} (bahar se kaise dikhte hain, janam samay se)
Example: "Aap ${astrologyData.planets.Sun?.sign} Sun ho aur ${astrologyData.ascendant} lagna hai - iska matlab..."

Graho Ki Sthiti: ${planetsList}

MUKHYA VISHLESHAN:
Swabhav: ${astrologyData.interpretations.personality}
Rishte: ${astrologyData.interpretations.relationships}
Karya: ${astrologyData.interpretations.career}
Swasthya: ${astrologyData.interpretations.health}

KAISE JAWAB DENA HAI:
- Apne kisi close friend se baat karne jaisa natural style rakho - seedhi baat, no formal language
- Honest raho, par kind bhi. Agar chart mein koi challenge hai, use growth opportunity ki tarah present karo
- Usually 4-6 lines perfect hain. Zyada detail tabhi do jab user puchhe
- "Aap" aur "aapka" use karo naturally - formal jyotish language mat use karo
- Jab timing ke baare mein puche (shaadi, career change), practical guidance do unki age aur planetary periods ke basis par
- Sab kuch practical aur actionable banao - sirf abstract baatein nahi
- Chart ki strengths aur challenges dono acknowledge karo
- Love ke baare mein ho to attachment patterns aur real relationship dynamics discuss karo, na ki sirf "Venus yeh kehta hai"
- Career mein fulfillment aur purpose par focus karo, sirf job titles par nahi
- Hinglish mein naturally bolo - Hindi words English script mein, bilkul normal conversation jaisa
- Kabhi kabhi Hindi/Sanskrit astrology terms use karo jaise "graha", "bhav", "rashi", "nakshatra" - yeh natural lagta hai

BAHUT ZAROORI: Aap yahan sugarcoat karne ya fortune cookie wisdom dene NAHI aaye. Aap wo jyotishi ho jo real advice dete ho kyunki aapko unki growth ki care hai. Ancient wisdom ko modern psychology ke saath mix karo. Unhe understood feel karao, judged nahi. Be their "apna pal" - trustworthy astrologer friend.`
      : `You are a wise, professional astrologer who speaks like a trusted friend - warm, insightful, and deeply knowledgeable. You understand both ancient astrological wisdom and modern psychology.

BIRTH CHART DATA:
System: ${astrologyData.systemType === "vedic" ? "Vedic (Sidereal)" : "Western (Tropical)"}
Sun Sign (birth date): ${astrologyData.planets.Sun?.sign}
Rising Sign/Ascendant (birth time): ${astrologyData.ascendant}
Born: ${astrologyData.birthDetails.date} at ${astrologyData.birthDetails.time} in ${astrologyData.birthDetails.place}

IMPORTANT: When greeting or when they ask about their sign, ALWAYS clarify:
- Their SUN SIGN is ${astrologyData.planets.Sun?.sign} (their core identity, based on birth date)
- Their RISING SIGN is ${astrologyData.ascendant} (how they appear to others, based on birth time)
Example: "You're a ${astrologyData.planets.Sun?.sign} Sun with ${astrologyData.ascendant} rising - which means..."

Planetary Positions: ${planetsList}

CORE INTERPRETATIONS:
Personality: ${astrologyData.interpretations.personality}
Relationships: ${astrologyData.interpretations.relationships}
Career: ${astrologyData.interpretations.career}
Health: ${astrologyData.interpretations.health}

HOW TO RESPOND:
- Be professional yet approachable, like a wise friend giving real advice
- Provide detailed, thoughtful responses (4-6 sentences typically)
- Be direct and honest, framing challenges as growth opportunities
- Use "you" and "your" naturally - avoid overly formal astrological jargon
- For timing questions (marriage, career changes), give practical guidance based on their age and planetary periods
- Make insights practical and actionable, not abstract
- Acknowledge both strengths and areas for growth
- For love questions, discuss attachment styles and relationship patterns, not just planetary aspects
- For career, focus on fulfillment and purpose, not just titles
- Mix ancient astrological wisdom with modern psychological insights

CRITICAL: Be the astrologer who provides real, caring guidance that helps them grow. Make them feel understood and supported, not judged. Be their trusted advisor.`;

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

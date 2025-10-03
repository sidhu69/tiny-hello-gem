import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Zodiac signs
const zodiacSigns = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

// Calculate zodiac sign based on date (Western/Tropical)
function getWesternZodiacSign(month: number, day: number): string {
  const dates: Array<[number, number, string]> = [
    [1, 20, "Capricorn"], [2, 19, "Aquarius"], [3, 21, "Pisces"],
    [4, 20, "Aries"], [5, 21, "Taurus"], [6, 21, "Gemini"],
    [7, 23, "Cancer"], [8, 23, "Leo"], [9, 23, "Virgo"],
    [10, 23, "Libra"], [11, 22, "Scorpio"], [12, 22, "Sagittarius"]
  ];
  
  for (let i = 0; i < dates.length; i++) {
    const [endMonth, endDay, sign] = dates[i];
    if (month < endMonth || (month === endMonth && day <= endDay)) {
      return sign;
    }
  }
  return "Capricorn";
}

// Calculate planetary positions (simplified rule-based)
function calculatePlanets(date: Date, systemType: string) {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const year = date.getFullYear();
  
  // Simplified calculations for demonstration
  const sunSign = getWesternZodiacSign(date.getMonth() + 1, date.getDate());
  const sunDegree = ((dayOfYear * 0.9856) % 360).toFixed(2);
  
  const moonCycle = ((dayOfYear * 13.176) % 360);
  const moonSignIndex = Math.floor(moonCycle / 30);
  const moonSign = zodiacSigns[moonSignIndex];
  const moonDegree = (moonCycle % 30).toFixed(2);
  
  const mercuryPos = ((dayOfYear * 4.09) % 360);
  const mercurySignIndex = Math.floor(mercuryPos / 30);
  const mercurySign = zodiacSigns[mercurySignIndex];
  
  const venusPos = ((dayOfYear * 1.6) % 360);
  const venusSignIndex = Math.floor(venusPos / 30);
  const venusSign = zodiacSigns[venusSignIndex];
  
  const marsPos = ((dayOfYear * 0.524) % 360);
  const marsSignIndex = Math.floor(marsPos / 30);
  const marsSign = zodiacSigns[marsSignIndex];
  
  const jupiterPos = ((year * 30.4) % 360);
  const jupiterSignIndex = Math.floor(jupiterPos / 30);
  const jupiterSign = zodiacSigns[jupiterSignIndex];
  
  const saturnPos = ((year * 12.2) % 360);
  const saturnSignIndex = Math.floor(saturnPos / 30);
  const saturnSign = zodiacSigns[saturnSignIndex];
  
  // Vedic adjustment (approximately 23 degrees)
  const vedicOffset = systemType === "vedic" ? -23 : 0;
  
  return {
    sun: { sign: sunSign, degree: sunDegree, house: "1st" },
    moon: { sign: moonSign, degree: moonDegree, house: "4th" },
    mercury: { sign: mercurySign, degree: (mercuryPos % 30).toFixed(2), house: "3rd" },
    venus: { sign: venusSign, degree: (venusPos % 30).toFixed(2), house: "7th" },
    mars: { sign: marsSign, degree: (marsPos % 30).toFixed(2), house: "10th" },
    jupiter: { sign: jupiterSign, degree: (jupiterPos % 30).toFixed(2), house: "9th" },
    saturn: { sign: saturnSign, degree: (saturnPos % 30).toFixed(2), house: "10th" },
    rahu: { sign: zodiacSigns[(marsSignIndex + 6) % 12], degree: "15.23", house: "6th" },
    ketu: { sign: zodiacSigns[(marsSignIndex) % 12], degree: "15.23", house: "12th" }
  };
}

// Comprehensive astrology interpretations with psychological depth
function generateInterpretations(planets: any, ascendant: string) {
  const sunSign = planets.sun.sign;
  const moonSign = planets.moon.sign;
  const venusSign = planets.venus.sign;
  const marsSign = planets.mars.sign;
  const mercurySign = planets.mercury.sign;
  
  // Core psychological archetypes
  const psychologicalCore: { [key: string]: string } = {
    "Aries": "Your psyche is driven by the archetype of the Pioneer - courage, autonomy, and the need to assert your individual will. Your growth edge involves balancing self-assertion with consideration for others, channeling your aggressive energy into constructive action rather than impulsive reaction.",
    "Taurus": "You embody the Builder archetype - seeking security, stability, and tangible results. Your psychological task involves learning when to release control and trust the flow of change, while honoring your need for groundedness without becoming rigid or possessive.",
    "Gemini": "Your psyche operates through the Messenger archetype - curiosity, connection, and mental agility. Your developmental challenge is integrating scattered interests into coherent wisdom, learning to commit to depth without losing your love of variety and exploration.",
    "Cancer": "You carry the Nurturer archetype - emotional sensitivity, protective instincts, and the need for belonging. Your growth involves establishing healthy boundaries while staying open-hearted, learning to mother yourself as you care for others, and releasing past hurts that keep you defensive.",
    "Leo": "Your psyche expresses the Sovereign archetype - creative self-expression, leadership, and the need for recognition. Your psychological work involves distinguishing authentic confidence from ego-driven needs for validation, sharing your gifts generously without requiring constant applause.",
    "Virgo": "You embody the Healer archetype - analytical precision, service orientation, and the drive for improvement. Your developmental path involves accepting imperfection as part of wholeness, recognizing that self-criticism doesn't equal self-improvement, and trusting your intuition alongside analysis.",
    "Libra": "Your psyche operates through the Diplomat archetype - relationship consciousness, aesthetic refinement, and justice-seeking. Your growth challenge is finding your center within relationships rather than losing yourself, making clear choices despite seeing all sides, and recognizing conflict as sometimes necessary.",
    "Scorpio": "You carry the Transformer archetype - psychological depth, power dynamics, and regenerative capacity. Your work involves using your penetrating insight for healing rather than control, trusting vulnerability as strength, and releasing the need to protect yourself through emotional intensity.",
    "Sagittarius": "Your psyche expresses the Philosopher archetype - meaning-seeking, expansion, and truth-telling. Your developmental task is grounding your vision in embodied reality, recognizing that wisdom includes learning from limitation, and balancing your need for freedom with meaningful commitment.",
    "Capricorn": "You embody the Master Builder archetype - achievement orientation, structural thinking, and authority. Your psychological growth involves softening your harsh inner taskmaster, recognizing emotional needs as valid as material ones, and understanding that vulnerability doesn't undermine your competence.",
    "Aquarius": "Your psyche operates through the Revolutionary archetype - innovation, collective consciousness, and authentic individuality. Your challenge is integrating emotional warmth with intellectual clarity, recognizing that progress includes honoring tradition's wisdom, and balancing detachment with intimate connection.",
    "Pisces": "You carry the Mystic archetype - spiritual sensitivity, compassion, and imagination. Your developmental path involves establishing boundaries without losing empathy, discerning when self-sacrifice serves versus depletes, and grounding your transcendent visions in practical manifestation."
  };

  // Attachment styles and relationship psychology by Venus
  const relationshipPsychology: { [key: string]: string } = {
    "Aries": "Your attachment style tends toward independence - you're attracted to passion and excitement but may fear engulfment. Psychological growth involves staying present during conflict rather than fighting or fleeing. Your relational wound often involves feeling controlled or diminished. Healthy relationships honor your autonomy while building interdependence. Partners who can match your intensity without competing will help you develop secure attachment.",
    "Taurus": "You lean toward secure attachment when your needs for stability are met. Your relational psychology centers on trust and consistency - betrayal wounds deeply. You may struggle with possessiveness or resistance to change in relationships. Growth involves recognizing that love doesn't require control, and that healthy relationships include evolution. Your tendency to show love through material means benefits from balance with emotional vulnerability.",
    "Gemini": "Your attachment style often shows anxious-avoidant patterns - craving connection while fearing boredom or restriction. Relationally, you intellectualize emotions as a defense mechanism. Psychological growth involves staying present with difficult feelings rather than mentally escaping. Your core relational wound involves not being heard or understood. Partners who engage your mind while honoring your emotional reality support secure attachment development.",
    "Cancer": "You display anxious attachment patterns - seeking merger and security in relationships. Your psychological challenge is differentiating your needs from your partner's while staying connected. Codependency patterns may emerge from your strong nurturing instincts. Growth involves recognizing that boundaries strengthen rather than threaten intimacy. Your relational wounds often stem from early family dynamics - healing requires re-parenting yourself with the care you give others.",
    "Leo": "Your attachment style blends security with a need for admiration. Relationally, you fear invisibility or irrelevance more than abandonment. Your psychological work involves distinguishing authentic self-worth from external validation. Pride can prevent vulnerability - yet vulnerability deepens intimacy. Your relational wound often involves feeling unseen or unappreciated. Partners who celebrate you authentically while challenging you to reciprocate support emotional growth.",
    "Virgo": "You tend toward anxious attachment expressed through perfectionism and service. Your relational psychology involves earning love through usefulness - a pattern that exhausts you. Growth requires accepting that you're lovable as you are, flaws included. Your critical inner voice projects onto relationships. Psychological healing involves self-compassion and recognizing that imperfection is human, not failure. Partners who appreciate you without demanding perfection facilitate secure attachment.",
    "Libra": "Your attachment style centers on connection - you fear abandonment through conflict or rejection. Relationally, you may lose yourself in partnerships, prioritizing harmony over authenticity. Your psychological challenge is developing a strong sense of self within relationships. Codependency patterns emerge from equating your worth with being in partnership. Growth involves choosing relationships that honor your individuality while meeting your genuine need for companionship.",
    "Scorpio": "You display avoidant attachment masking intense connection needs. Your relational psychology involves testing trust through intensity - pushing people away to see if they'll stay. Vulnerability terrifies and compels you. Psychological growth requires recognizing that control doesn't equal safety, and that intimacy involves risk. Your relational wounds often involve betrayal or abandonment. Healing comes through gradually trusting while maintaining appropriate boundaries - not walls.",
    "Sagittarius": "Your attachment style is avoidant - you value freedom and fear entrapment. Relationally, you may mistake commitment for limitation. Your psychological work involves recognizing that depth doesn't diminish freedom, and that running from connection leaves you isolated. Growth means staying present when relationships become challenging rather than seeking the next adventure. Partners who share your philosophical nature while offering emotional consistency help you develop secure attachment.",
    "Capricorn": "You lean toward avoidant attachment, expressed through emotional reserve and self-reliance. Your relational psychology involves equating neediness with weakness. Psychological growth requires recognizing that vulnerability is strength, not failure. You may choose partners who confirm your belief that you must handle everything alone. Healing involves letting others support you and expressing emotional needs directly. Your relational wounds often involve early experiences of having to be the responsible one.",
    "Aquarius": "Your attachment style tends avoidant, valuing independence and fearing engulfment. Relationally, you intellectualize emotions and maintain emotional distance. Your psychological challenge is integrating emotional intimacy with your need for autonomy. Growth involves recognizing that detachment isn't the same as healthy boundaries. Your relational wounds often involve feeling misunderstood or pressured to conform. Partners who respect your uniqueness while inviting emotional presence support secure attachment.",
    "Pisces": "You display anxious attachment patterns - merging with partners and losing boundaries. Your relational psychology involves rescuing or being rescued, stemming from difficulty with separateness. Codependency and idealization are common patterns. Psychological growth requires establishing clear boundaries while maintaining compassion. Your relational wounds involve feeling abandoned or betrayed when reality doesn't match fantasy. Healing comes through grounding love in reality and recognizing that boundaries protect intimacy."
  };

  // Career psychology and purpose alignment
  const careerPsychology: { [key: string]: string } = {
    "Aries": `Your career psychology centers on pioneering and leading. Psychologically, you need autonomy and challenges - routine work drains your life force. You thrive in competitive, fast-paced environments. Your career wound may involve having your initiative crushed or being forced to follow without question. Mars in ${marsSign} reveals your drive style: ${marsSign === "Aries" ? "pure initiative and self-starting energy" : marsSign === "Taurus" ? "steady determination building tangible results" : marsSign === "Gemini" ? "intellectual competition and versatile action" : "channeled through " + marsSign + " qualities"}. Fulfillment requires work where you initiate, lead, and see immediate impact.`,
    "Taurus": `Career fulfillment comes through building lasting value and tangible results. Psychologically, you need security and sensory satisfaction in work. Your career psychology involves persistence and practical mastery. Career wounds may involve instability or having your work undervalued. Mars in ${marsSign} shapes your work drive. You excel in finance, arts, real estate, or any field producing concrete outcomes. Psychological satisfaction requires work that engages your senses and produces lasting results.`,
    "Gemini": `Your career psychology revolves around communication, learning, and variety. You need intellectual stimulation and diverse projects - monotony kills your motivation. Career wounds often involve being silenced or having your ideas dismissed. Mars in ${marsSign} drives your work style. Psychologically, you're fulfilled by careers in media, education, technology, sales - anything involving information exchange and mental agility. Multiple income streams or portfolio careers suit your psychology.`,
    "Cancer": `Career fulfillment connects to nurturing and creating emotional safety for others. Your work psychology needs meaning beyond just money - you require emotional connection to your work. Career wounds may involve feeling emotionally unsafe or unvalued in professional settings. Mars in ${marsSign} shapes how you pursue professional goals. Psychology, counseling, healthcare, hospitality, real estate, or family business align with your need for emotional significance in work.`,
    "Leo": `Your career psychology centers on creative expression and recognition. You need work that allows authentic self-expression and leadership. Psychologically, you wither in roles where you're invisible or creatively restricted. Career wounds involve being overlooked or having your contributions unacknowledged. Mars in ${marsSign} drives your professional ambition. Entertainment, entrepreneurship, creative leadership, or any field allowing you to shine suits your psychological needs.`,
    "Virgo": `Career fulfillment comes through service, improvement, and mastery of craft. Your work psychology involves analysis, precision, and problem-solving. You need intellectually engaging work with tangible results. Career wounds may involve perfectionism burnout or being underappreciated. Mars in ${marsSign} shapes your work drive. Healthcare, research, analysis, editing, consulting, or skilled trades satisfy your psychological need for meaningful improvement work.`,
    "Libra": `Your career psychology revolves around relationship, beauty, and justice. You need work involving partnership, diplomacy, or aesthetic refinement. Psychological fulfillment requires harmony and fairness in professional environments. Career wounds often involve unfair treatment or working in aesthetically harsh settings. Mars in ${marsSign} drives your professional action style. Law, design, counseling, diplomacy, arts, or human resources align with your relational work psychology.`,
    "Scorpio": `Career fulfillment connects to depth, transformation, and uncovering hidden truths. Your work psychology needs intensity and meaning - superficial work psychologically drains you. You excel at investigation and transformation. Career wounds may involve power dynamics or betrayal in professional settings. Mars in ${marsSign} shapes your professional intensity. Psychology, research, finance, surgery, detective work, or transformational coaching satisfy your need for profound work.`,
    "Sagittarius": `Your career psychology centers on meaning, growth, and expansion. You need work connected to philosophy, education, or exploration. Psychologically, you require freedom and purpose - confined roles suffocate you. Career wounds often involve being restricted or having your vision dismissed. Mars in ${marsSign} drives your professional ambition. Teaching, travel, publishing, international business, philosophy, or coaching align with your need for expansive, meaningful work.`,
    "Capricorn": `Career fulfillment comes through achievement, mastery, and building lasting structures. Your work psychology involves discipline, strategy, and long-term vision. You need respect and tangible progress. Career wounds may involve authority issues or early professional struggles that drive later success. Mars in ${marsSign} shapes your professional drive. Business, management, architecture, government, finance, or established institutions satisfy your psychological need for achievement and structure.`,
    "Aquarius": `Your career psychology revolves around innovation, reform, and collective benefit. You need work involving progressive thinking or humanitarian aims. Psychologically, you require intellectual freedom and social purpose. Career wounds often involve conformity pressure or having innovative ideas rejected. Mars in ${marsSign} drives your professional action. Technology, social reform, science, group facilitation, or unconventional fields satisfy your need for meaningful innovation.`,
    "Pisces": `Career fulfillment connects to compassion, creativity, and transcendence. Your work psychology needs spiritual or artistic meaning - purely material work depletes you. You require emotionally significant work. Career wounds may involve harsh environments or having your sensitivity dismissed as weakness. Mars in ${marsSign} shapes how you pursue professional goals. Arts, healing, music, spirituality, counseling, or nonprofit work satisfies your psychological need for compassionate, imaginative expression.`
  };

  // Health interpretations based on 1st, 6th house, Moon, Sun, Mars
  const healthInsights: { [key: string]: string } = {
    "Aries": "Your vitality is generally strong, but you may be prone to headaches, stress-related issues, or injuries from rushing. Regular physical activity channels your energy positively. Practice patience and avoid overexertion. Mind-body practices like yoga balance your fiery nature.",
    "Taurus": "Pay attention to throat, neck, and thyroid health. Your love of comfort might lead to weight management needs. Regular exercise and a balanced diet are essential. Stress manifests in physical tension. Prioritize rest and moderation.",
    "Gemini": "Your nervous system is sensitive, requiring adequate rest and stress management. Respiratory health and hand-arm wellness need attention. Mental overstimulation can affect sleep. Practice mindfulness and maintain consistent routines.",
    "Cancer": "Digestive health correlates with your emotional state. Nurture yourself as you nurture others. Water intake and dietary habits significantly impact wellbeing. Emotional processing prevents physical manifestation. Create a peaceful home environment.",
    "Leo": "Heart health and spine strength are focus areas. Your vitality is robust when aligned with purpose. Cardiovascular exercise and creative expression maintain health. Pride might delay seeking help. Regular check-ups are wise.",
    "Virgo": "Digestive sensitivity requires attention to diet and gut health. Anxiety can manifest physically. Your health consciousness is an asset, but avoid excessive worry. Relaxation practices and routine exercise support wellbeing. Trust your body's wisdom.",
    "Libra": "Kidney and lower back health need attention. Balance in all things maintains health. Partnerships influence wellbeing. Sweet treats in moderation. Regular movement and hydration are key. Stress shows in physical symptoms.",
    "Scorpio": "Reproductive and elimination systems require care. Your intense nature needs healthy outlets. Hidden health issues may arise, so regular screening is important. Transformative healing practices resonate. Release emotional toxins through expression.",
    "Sagittarius": "Hip, thigh, and liver health are considerations. Your optimism supports healing. Outdoor activities boost vitality. Overindulgence in food or drink requires moderation. Adventure fuels your spirit. Stay physically active.",
    "Capricorn": "Bone, teeth, and joint health strengthen with proper care. Stress may manifest in skeletal system. Your disciplined approach supports long-term health. Don't ignore rest needs. Aging gracefully requires balance between work and wellness.",
    "Aquarius": "Circulation, ankles, and nervous system need attention. Your unique constitution might require alternative health approaches. Group activities support wellbeing. Stress affects you mentally first. Innovation in health practices appeals to you.",
    "Pisces": "Foot health and immune system require nurturing. Your sensitivity extends to substances and environments. Water-based activities heal. Emotional boundaries protect wellbeing. Spiritual practices support health. Trust your intuitive knowing about your body."
  };

  // Emotional needs and inner world by Moon
  const emotionalPsychology: { [key: string]: string } = {
    "Aries": "needs emotional freedom, direct expression, and independence",
    "Taurus": "needs emotional security, consistency, and physical comfort",
    "Gemini": "needs intellectual processing, variety, and communication",
    "Cancer": "needs deep emotional safety, nurturing, and belonging",
    "Leo": "needs emotional recognition, creative expression, and appreciation",
    "Virgo": "needs order, practical care, and purposeful emotional processing",
    "Libra": "needs relational harmony, beauty, and emotional balance",
    "Scorpio": "needs emotional depth, privacy, and transformative processing",
    "Sagittarius": "needs emotional freedom, optimism, and philosophical perspective",
    "Capricorn": "needs emotional structure, respect, and controlled expression",
    "Aquarius": "needs intellectual distance, independence, and humanitarian connection",
    "Pisces": "needs emotional fluidity, spiritual connection, and compassionate understanding"
  };

  return {
    personality: `${psychologicalCore[sunSign]}\n\nYour ${ascendant} Rising creates your persona - how you instinctively approach the world and how others first experience you. ${ascendant === sunSign ? "This aligns with your core identity, creating authentic self-expression." : `This differs from your core Sun identity, creating interesting layers - you present as ${ascendant} but your essence is ${sunSign}.`}\n\nYour Moon in ${moonSign} ${emotionalPsychology[moonSign]} - this shapes your emotional security needs and inner world. ${moonSign === sunSign ? "Your emotions align with your identity, creating integrated self-expression." : "This creates psychological complexity - your emotional nature differs from your conscious identity, requiring integration."} Mercury in ${mercurySign} shapes how you process information and communicate your inner world.`,
    
    relationships: `Venus in ${venusSign} reveals your relational psychology: ${relationshipPsychology[venusSign]}\n\nYour Moon in ${moonSign} adds emotional needs to this relational pattern - you ${emotionalPsychology[moonSign].replace("needs", "need")} in intimate connections. ${moonSign === venusSign ? "Your emotional needs align with your love style, creating relational clarity." : "Integrating your emotional needs (Moon) with your love style (Venus) is key to relationship fulfillment."}`,
    
    career: careerPsychology[sunSign],
    
    health: `${healthInsights[sunSign]}\n\nPsychologically, your health connects to how well you're honoring your core self (Sun in ${sunSign}) and emotional needs (Moon in ${moonSign}). ${sunSign === moonSign ? "Your conscious will and emotional needs align, supporting integrated wellbeing." : "Your conscious goals and emotional needs differ - health requires honoring both."} Stress often manifests when you're ${sunSign === "Aries" || sunSign === "Leo" || sunSign === "Sagittarius" ? "suppressing your authentic expression or feeling restricted" : sunSign === "Taurus" || sunSign === "Virgo" || sunSign === "Capricorn" ? "overworking without rest or denying emotional needs" : "avoiding emotional processing or neglecting relationship needs"}. Mars in ${marsSign} reveals your vitality source - channel this energy constructively for optimal health.`
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { birthDate, birthTime, birthPlace, systemType } = await req.json();

    console.log("Processing astrology calculation:", {
      birthDate,
      birthTime,
      birthPlace,
      systemType
    });

    // Parse birth date
    const date = new Date(birthDate);
    
    // Calculate ascendant based on birth time
    const [hours, minutes] = birthTime.split(":").map(Number);
    const ascendantIndex = Math.floor((hours * 2 + minutes / 30) % 12);
    const ascendant = zodiacSigns[ascendantIndex];

    // Calculate planetary positions
    const planets = calculatePlanets(date, systemType);

    // Generate interpretations
    const interpretations = generateInterpretations(planets, ascendant);

    const response = {
      systemType,
      ascendant,
      planets,
      interpretations,
      birthDetails: {
        date: birthDate,
        time: birthTime,
        place: birthPlace
      }
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in astrology calculation:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

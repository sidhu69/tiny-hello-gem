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

// Comprehensive astrology interpretations
function generateInterpretations(planets: any, ascendant: string) {
  const sunSign = planets.sun.sign;
  const moonSign = planets.moon.sign;
  const venusSign = planets.venus.sign;
  
  // Personality interpretations based on Sun and Moon
  const personalityInsights: { [key: string]: string } = {
    "Aries": "You possess a fiery spirit and natural leadership qualities. Your pioneering nature drives you to take initiative and blaze new trails. However, learning patience and considering others' perspectives will enhance your journey.",
    "Taurus": "Grounded and reliable, you value stability and material comfort. Your determination is unmatched, and you have an appreciation for beauty and sensory pleasures. Guard against stubbornness and embrace flexibility.",
    "Gemini": "Your intellectual curiosity and adaptability make you a natural communicator. You thrive on variety and mental stimulation. Focus on depth alongside breadth, and cultivate consistency in your pursuits.",
    "Cancer": "Deeply intuitive and nurturing, you possess strong emotional intelligence. Your connection to home and family grounds you. Learn to balance caring for others with self-care and emotional boundaries.",
    "Leo": "Confident and charismatic, you naturally command attention and inspire others. Your creative spirit and generous heart are your gifts. Cultivate humility and share the spotlight to reach your highest potential.",
    "Virgo": "Your analytical mind and attention to detail make you invaluable in any endeavor. Service-oriented and practical, you seek perfection. Remember to embrace imperfection and practice self-compassion.",
    "Libra": "Harmonious and diplomatic, you excel at creating balance and beauty in your environment. Your sense of justice and fairness guides you. Work on making decisions independently and asserting your needs.",
    "Scorpio": "Intense and transformative, you possess deep emotional and psychological insight. Your passion and determination are profound. Channel your power constructively and practice forgiveness.",
    "Sagittarius": "Optimistic and philosophical, you're a natural seeker of truth and wisdom. Your love of freedom and adventure defines you. Ground your visions in practical action and cultivate patience.",
    "Capricorn": "Ambitious and disciplined, you build lasting structures through persistent effort. Your sense of responsibility is admirable. Balance achievement with enjoyment and emotional expression.",
    "Aquarius": "Innovative and humanitarian, you envision a better future for all. Your independent thinking sets you apart. Remember to honor emotional connections alongside intellectual pursuits.",
    "Pisces": "Compassionate and spiritually attuned, you possess artistic and intuitive gifts. Your empathy is boundless. Establish healthy boundaries and ground your dreams in reality."
  };

  // Relationship interpretations based on Venus and 7th house
  const relationshipInsights: { [key: string]: string } = {
    "Aries": "In relationships, you bring passion and excitement. You value independence and direct communication. Your ideal partner matches your energy and gives you space to be yourself. Learn to balance your needs with compromise.",
    "Taurus": "You seek stable, committed relationships built on trust and loyalty. Physical affection and quality time matter deeply to you. You're a devoted partner who values consistency. Be open to growth and change within relationships.",
    "Gemini": "Mental connection is paramount in your relationships. You need a partner who stimulates your mind and shares your curiosity. Communication and variety keep your relationships fresh. Cultivate emotional depth alongside intellectual rapport.",
    "Cancer": "You're deeply nurturing and seek emotional security in relationships. Creating a safe, loving home with your partner is essential. Your intuitive understanding of others' needs is a gift. Ensure your needs are also met and communicated.",
    "Leo": "Romance and grand gestures characterize your approach to love. You're generous and loyal, seeking a partner who appreciates your warmth. You thrive when your partner celebrates your uniqueness. Practice vulnerability and receptivity.",
    "Virgo": "You show love through practical acts of service and thoughtful gestures. You seek a partner who shares your values and life goals. Your attention to your partner's needs is remarkable. Remember that love includes accepting imperfections.",
    "Libra": "Partnership is central to your identity. You're a natural romantic who values harmony and equality. Beauty and refinement in relationships matter to you. Develop independence alongside partnership and make clear decisions.",
    "Scorpio": "You experience love intensely and seek profound emotional and physical connections. Loyalty and trust are non-negotiable. Your transformative approach to relationships runs deep. Balance intensity with lightness and trust gradually.",
    "Sagittarius": "Freedom and growth are essential in your relationships. You seek a partner who's also an adventure companion and philosophical friend. Your optimism is infectious. Balance independence with commitment and emotional availability.",
    "Capricorn": "You take relationships seriously and seek long-term commitment. You're reliable and supportive, offering stability to your partner. Traditional values may guide you. Allow yourself to be emotionally vulnerable and spontaneous.",
    "Aquarius": "Friendship forms the foundation of your romantic relationships. You value independence and intellectual connection. Unconventional relationships may appeal to you. Balance detachment with emotional intimacy.",
    "Pisces": "You're a romantic idealist who seeks soul-deep connections. Your empathy and compassion create beautiful relationships. You may idealize partners initially. Ground your love in reality and maintain healthy boundaries."
  };

  // Career interpretations based on 10th house, Mercury, Saturn, Jupiter
  const careerInsights: { [key: string]: string } = {
    "Aries": "You excel in careers requiring leadership, initiative, and quick decision-making. Entrepreneurship, sports, military, or pioneering fields suit you. Your competitive nature drives success. Channel your energy into long-term goals.",
    "Taurus": "Careers involving finance, real estate, agriculture, art, or luxury goods align with your talents. You build wealth through persistence and practical skills. Your reliability makes you valuable. Embrace calculated risks for growth.",
    "Gemini": "Communication-based careers thrive under your influence: journalism, teaching, writing, sales, or media. Your versatility allows success in multiple fields. Focus helps you achieve mastery. Develop expertise alongside breadth.",
    "Cancer": "Nurturing professions appeal to you: healthcare, hospitality, real estate, counseling, or education. Creating supportive environments is your strength. Your emotional intelligence is an asset. Set professional boundaries.",
    "Leo": "Creative leadership roles suit you: entertainment, management, politics, or entrepreneurship. You shine in positions allowing self-expression and influence. Your confidence inspires others. Collaborate and delegate effectively.",
    "Virgo": "Detail-oriented fields match your talents: healthcare, research, editing, analysis, or service industries. Your organizational skills are exceptional. You improve systems and processes. Recognize when perfection isn't necessary.",
    "Libra": "Careers requiring diplomacy and aesthetics suit you: law, diplomacy, design, counseling, or arts. You create harmony in professional settings. Your fairness is valued. Make decisive moves when needed.",
    "Scorpio": "You excel in investigative or transformative fields: psychology, research, surgery, finance, or detective work. Your intensity drives deep work. You uncover hidden truths. Balance intensity with self-care.",
    "Sagittarius": "Education, travel, philosophy, publishing, or international business align with your nature. You inspire others with your vision and optimism. Your big-picture thinking is valuable. Attend to practical details.",
    "Capricorn": "You're built for leadership and achievement in business, administration, architecture, or established institutions. Your discipline ensures success. You climb steadily to the top. Remember work-life balance.",
    "Aquarius": "Innovation and humanitarian work call to you: technology, social reform, science, or group facilitation. Your progressive thinking creates change. You work well in teams with autonomy. Ground ideals in action.",
    "Pisces": "Creative and healing professions resonate: arts, music, healing, spirituality, or charity work. Your imagination and compassion are gifts. You uplift others through your work. Establish structure and boundaries."
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

  return {
    personality: `${personalityInsights[sunSign]}\n\nWith your Moon in ${moonSign}, ${personalityInsights[moonSign].toLowerCase().split('.')[0].replace('you', 'you emotionally')}, adding emotional depth to your Sun sign expression. Your ascendant in ${ascendant} colors how others first perceive you, creating the initial impression you make on the world.`,
    relationships: relationshipInsights[venusSign],
    career: careerInsights[sunSign],
    health: healthInsights[sunSign]
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

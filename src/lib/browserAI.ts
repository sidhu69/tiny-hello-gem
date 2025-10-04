import {
  calculateAspects,
  calculatePlanetaryStrength,
  analyzeCareerFromChart,
} from './astrologyCalculations';

// Simple rule-based astrology responses (no AI model needed)
export const initializeAI = async () => {
  // No model to load - using rule-based system
  console.log('Using rule-based astrology system');
  return true;
};

export const generateAstrologyResponse = async (
  userQuestion: string,
  astrologyData: any,
  conversationHistory: Array<{ role: string; content: string }>
) => {
  try {
    // STEP 1: Do REAL calculations
    const aspects = calculateAspects(astrologyData.planets);

    // Calculate planetary strengths
    const planetStrengths = Object.entries(astrologyData.planets).map(
      ([planet, pos]: [string, any]) => ({
        planet,
        ...calculatePlanetaryStrength(planet, pos)
      })
    );

    const calculatedInsights = {
      strongPlanets: planetStrengths.filter(p => p.strength > 70),
      weakPlanets: planetStrengths.filter(p => p.strength < 40),
      majorAspects: aspects.filter(a => a.orb < 3),
      careerAnalysis: analyzeCareerFromChart(astrologyData.planets, aspects)
    };

    // STEP 2: Generate response based on keywords and calculations
    const questionLower = userQuestion.toLowerCase();
    let response = '';

    // Career questions
    if (questionLower.includes('career') || questionLower.includes('job') || questionLower.includes('work')) {
      response = `Looking at your career indicators:\n\n${calculatedInsights.careerAnalysis}\n\n`;
      
      if (calculatedInsights.strongPlanets.length > 0) {
        const strongPlanet = calculatedInsights.strongPlanets[0];
        response += `Your ${strongPlanet.planet} in ${astrologyData.planets[strongPlanet.planet].sign} (${strongPlanet.dignity}) gives you natural strengths you can leverage professionally.`;
      }
    }
    
    // Personality questions
    else if (questionLower.includes('personality') || questionLower.includes('who am i') || questionLower.includes('character')) {
      response = `With ${astrologyData.ascendant} rising, you naturally appear ${getAscendantTraits(astrologyData.ascendant)}.\n\n`;
      
      if (astrologyData.planets.Sun) {
        response += `Your Sun in ${astrologyData.planets.Sun.sign} shapes your core identity - you're driven by ${getSunTraits(astrologyData.planets.Sun.sign)}.\n\n`;
      }
      
      if (astrologyData.planets.Moon) {
        response += `Your Moon in ${astrologyData.planets.Moon.sign} means emotionally you ${getMoonTraits(astrologyData.planets.Moon.sign)}.`;
      }
    }
    
    // Relationship questions
    else if (questionLower.includes('love') || questionLower.includes('relationship') || questionLower.includes('partner')) {
      response = `In relationships:\n\n`;
      
      if (astrologyData.planets.Venus) {
        response += `Your Venus in ${astrologyData.planets.Venus.sign} shows you value ${getVenusTraits(astrologyData.planets.Venus.sign)} in love.\n\n`;
      }
      
      if (astrologyData.planets.Mars) {
        response += `Mars in ${astrologyData.planets.Mars.sign} indicates you pursue relationships with ${getMarsTraits(astrologyData.planets.Mars.sign)}.`;
      }
    }
    
    // Strengths/weaknesses
    else if (questionLower.includes('strength') || questionLower.includes('good at') || questionLower.includes('talent')) {
      response = `Your natural strengths:\n\n`;
      
      if (calculatedInsights.strongPlanets.length > 0) {
        calculatedInsights.strongPlanets.forEach(p => {
          response += `• ${p.planet} in ${astrologyData.planets[p.planet].sign} (${p.dignity}) - ${getPlanetStrength(p.planet)}\n`;
        });
      } else {
        response += `All your planets are in decent positions, giving you balanced abilities across many areas.`;
      }
    }
    
    else if (questionLower.includes('challenge') || questionLower.includes('weakness') || questionLower.includes('difficult')) {
      response = `Areas for growth:\n\n`;
      
      if (calculatedInsights.weakPlanets.length > 0) {
        calculatedInsights.weakPlanets.forEach(p => {
          response += `• ${p.planet} in ${astrologyData.planets[p.planet].sign} (${p.dignity}) - ${getPlanetChallenge(p.planet)}\n`;
        });
      } else {
        response += `You don't have any significantly challenged placements. Your chart shows good overall balance.`;
      }
    }
    
    // Money/finance
    else if (questionLower.includes('money') || questionLower.includes('finance') || questionLower.includes('wealth')) {
      response = `Regarding finances:\n\n`;
      
      if (astrologyData.planets.Jupiter) {
        response += `Jupiter in ${astrologyData.planets.Jupiter.sign} suggests growth through ${getJupiterTraits(astrologyData.planets.Jupiter.sign)}.\n\n`;
      }
      
      if (astrologyData.planets.Saturn) {
        response += `Saturn in ${astrologyData.planets.Saturn.sign} teaches you about wealth through ${getSaturnTraits(astrologyData.planets.Saturn.sign)}.`;
      }
    }
    
    // Default response
    else {
      response = `Based on your ${astrologyData.ascendant} rising chart:\n\n`;
      response += astrologyData.interpretations?.personality || 'Your chart shows unique patterns worth exploring.';
      response += `\n\nI can tell you more about your career, relationships, personality, strengths, or challenges. What interests you most?`;
    }

    return response;

  } catch (error) {
    console.error('Response generation error:', error);
    return "I'm having trouble analyzing your chart right now. Could you ask your question in a different way?";
  }
};

// Helper functions for trait descriptions
const getAscendantTraits = (sign: string): string => {
  const traits: Record<string, string> = {
    Aries: "bold, energetic, and direct in your approach",
    Taurus: "calm, steady, and grounded",
    Gemini: "curious, communicative, and adaptable",
    Cancer: "nurturing, sensitive, and protective",
    Leo: "confident, warm, and charismatic",
    Virgo: "analytical, helpful, and detail-oriented",
    Libra: "diplomatic, charming, and relationship-focused",
    Scorpio: "intense, mysterious, and transformative",
    Sagittarius: "optimistic, adventurous, and philosophical",
    Capricorn: "ambitious, responsible, and disciplined",
    Aquarius: "independent, innovative, and humanitarian",
    Pisces: "compassionate, intuitive, and creative"
  };
  return traits[sign] || "unique and distinctive";
};

const getSunTraits = (sign: string): string => {
  const traits: Record<string, string> = {
    Aries: "action, independence, and being first",
    Taurus: "stability, comfort, and lasting value",
    Gemini: "learning, variety, and connection",
    Cancer: "emotional security and nurturing others",
    Leo: "creative self-expression and recognition",
    Virgo: "improvement, service, and perfection",
    Libra: "harmony, beauty, and partnership",
    Scorpio: "intensity, depth, and transformation",
    Sagittarius: "meaning, adventure, and wisdom",
    Capricorn: "achievement, structure, and legacy",
    Aquarius: "innovation, independence, and ideals",
    Pisces: "compassion, spirituality, and unity"
  };
  return traits[sign] || "your unique purpose";
};

const getMoonTraits = (sign: string): string => {
  const traits: Record<string, string> = {
    Aries: "need quick emotional processing and action",
    Taurus: "need stability and physical comfort",
    Gemini: "need variety and intellectual stimulation",
    Cancer: "need deep emotional connection and security",
    Leo: "need appreciation and creative expression",
    Virgo: "need order and to be useful",
    Libra: "need harmony and partnership",
    Scorpio: "need emotional intensity and depth",
    Sagittarius: "need freedom and optimism",
    Capricorn: "need structure and achievement",
    Aquarius: "need independence and uniqueness",
    Pisces: "need to merge with something greater"
  };
  return traits[sign] || "have unique emotional needs";
};

const getVenusTraits = (sign: string): string => {
  const traits: Record<string, string> = {
    Aries: "passion, excitement, and directness",
    Taurus: "stability, sensuality, and loyalty",
    Gemini: "mental stimulation and variety",
    Cancer: "emotional depth and nurturing",
    Leo: "romance, loyalty, and admiration",
    Virgo: "practical acts of service and improvement",
    Libra: "harmony, romance, and partnership",
    Scorpio: "intensity, loyalty, and transformation",
    Sagittarius: "adventure, honesty, and freedom",
    Capricorn: "commitment, stability, and respect",
    Aquarius: "friendship, independence, and uniqueness",
    Pisces: "emotional fusion and compassion"
  };
  return traits[sign] || "genuine connection";
};

const getMarsTraits = (sign: string): string => {
  const traits: Record<string, string> = {
    Aries: "direct action and bold initiative",
    Taurus: "steady persistence and sensuality",
    Gemini: "mental stimulation and variety",
    Cancer: "emotional connection first",
    Leo: "confident pursuit and grand gestures",
    Virgo: "careful planning and service",
    Libra: "charm and partnership",
    Scorpio: "intensity and deep connection",
    Sagittarius: "adventure and honesty",
    Capricorn: "traditional courtship and commitment",
    Aquarius: "friendship and intellectual connection",
    Pisces: "romance and emotional merging"
  };
  return traits[sign] || "your unique style";
};

const getJupiterTraits = (sign: string): string => {
  return `${sign} energy - expansion through this sign's qualities`;
};

const getSaturnTraits = (sign: string): string => {
  return `${sign} energy - lessons and discipline in this area`;
};

const getPlanetStrength = (planet: string): string => {
  const strengths: Record<string, string> = {
    Sun: "strong sense of self and natural leadership",
    Moon: "emotional intelligence and nurturing ability",
    Mercury: "clear communication and mental agility",
    Venus: "natural charm and artistic sense",
    Mars: "drive, courage, and taking action",
    Jupiter: "optimism, wisdom, and good fortune",
    Saturn: "discipline, responsibility, and perseverance"
  };
  return strengths[planet] || "positive influence";
};

const getPlanetChallenge = (planet: string): string => {
  const challenges: Record<string, string> = {
    Sun: "work on building confidence and self-expression",
    Moon: "emotional patterns may need attention and healing",
    Mercury: "communication could require extra effort",
    Venus: "relationships and values may need development",
    Mars: "channeling energy constructively takes practice",
    Jupiter: "avoid over-optimism, stay grounded",
    Saturn: "patience with limitations builds character"
  };
  return challenges[planet] || "area for growth";
};

// Real astrological calculation rules
export interface PlanetPosition {
  sign: string;
  degree: number;
  house: number;
  isRetrograde?: boolean;
}

export interface AspectData {
  planet1: string;
  planet2: string;
  aspect: string; // conjunction, opposition, trine, square, sextile
  orb: number;
}

// Calculate aspects between planets
export const calculateAspects = (planets: Record<string, PlanetPosition>): AspectData[] => {
  const aspects: AspectData[] = [];
  const planetNames = Object.keys(planets);
  
  // Aspect orbs (degrees of separation)
  const aspectDefinitions = [
    { name: 'Conjunction', angle: 0, orb: 8 },
    { name: 'Opposition', angle: 180, orb: 8 },
    { name: 'Trine', angle: 120, orb: 8 },
    { name: 'Square', angle: 90, orb: 8 },
    { name: 'Sextile', angle: 60, orb: 6 },
  ];

  for (let i = 0; i < planetNames.length; i++) {
    for (let j = i + 1; j < planetNames.length; j++) {
      const p1 = planetNames[i];
      const p2 = planetNames[j];
      
      // Calculate angular distance
      let diff = Math.abs(planets[p1].degree - planets[p2].degree);
      if (diff > 180) diff = 360 - diff;
      
      // Check each aspect type
      for (const aspect of aspectDefinitions) {
        const orb = Math.abs(diff - aspect.angle);
        if (orb <= aspect.orb) {
          aspects.push({
            planet1: p1,
            planet2: p2,
            aspect: aspect.name,
            orb: orb
          });
        }
      }
    }
  }
  
  return aspects;
};

// Determine planetary strength
export const calculatePlanetaryStrength = (
  planet: string,
  position: PlanetPosition
): {
  dignity: 'Domicile' | 'Exalted' | 'Detriment' | 'Fall' | 'Neutral';
  strength: number; // 0-100
} => {
  const dignities: Record<string, { domicile: string[], exalted: string, detriment: string[], fall: string }> = {
    Sun: { domicile: ['Leo'], exalted: 'Aries', detriment: ['Aquarius'], fall: 'Libra' },
    Moon: { domicile: ['Cancer'], exalted: 'Taurus', detriment: ['Capricorn'], fall: 'Scorpio' },
    Mercury: { domicile: ['Gemini', 'Virgo'], exalted: 'Virgo', detriment: ['Sagittarius', 'Pisces'], fall: 'Pisces' },
    Venus: { domicile: ['Taurus', 'Libra'], exalted: 'Pisces', detriment: ['Scorpio', 'Aries'], fall: 'Virgo' },
    Mars: { domicile: ['Aries', 'Scorpio'], exalted: 'Capricorn', detriment: ['Libra', 'Taurus'], fall: 'Cancer' },
    Jupiter: { domicile: ['Sagittarius', 'Pisces'], exalted: 'Cancer', detriment: ['Gemini', 'Virgo'], fall: 'Capricorn' },
    Saturn: { domicile: ['Capricorn', 'Aquarius'], exalted: 'Libra', detriment: ['Cancer', 'Leo'], fall: 'Aries' },
  };

  const planetDignity = dignities[planet];
  if (!planetDignity) {
    return { dignity: 'Neutral', strength: 50 };
  }

  if (planetDignity.domicile.includes(position.sign)) {
    return { dignity: 'Domicile', strength: 100 };
  }
  if (planetDignity.exalted === position.sign) {
    return { dignity: 'Exalted', strength: 90 };
  }
  if (planetDignity.detriment.includes(position.sign)) {
    return { dignity: 'Detriment', strength: 30 };
  }
  if (planetDignity.fall === position.sign) {
    return { dignity: 'Fall', strength: 20 };
  }
  
  return { dignity: 'Neutral', strength: 50 };
};

// Generate accurate interpretation based on calculations
export const interpretPlanetInHouse = (
  planet: string,
  house: number,
  sign: string
): string => {
  const interpretations: Record<string, Record<number, string>> = {
    Sun: {
      1: "Strong sense of self, natural leadership, confident presence",
      2: "Values personal resources, earns through own efforts, self-worth tied to possessions",
      3: "Communicative, curious mind, relationship with siblings important",
      4: "Deep connection to home/family, may have dominant father figure",
      5: "Creative self-expression, playful, enjoys romance and children",
      6: "Health-conscious, dedicated worker, finds identity through service",
      7: "Identity through partnerships, attracts strong partners",
      8: "Interest in transformation, psychology, occult matters",
      9: "Philosophical, loves travel and higher learning",
      10: "Career-focused, public recognition important, ambitious",
      11: "Social circles important, humanitarian goals, friendship-oriented",
      12: "Spiritual, introspective, may prefer solitude or behind-scenes work"
    },
    Moon: {
      1: "Emotionally expressive, moods visible to others, nurturing personality",
      2: "Emotional security through finances, fluctuating income",
      3: "Emotionally communicative, close to siblings, sensitive to environment",
      4: "Very strong placement, deep family bonds, emotional home life",
      5: "Emotional creativity, nurturing toward children, romantic nature",
      6: "Emotional health connection, caring in service, may worry about health",
      7: "Needs emotional partnership, attracted to nurturing partners",
      8: "Deep emotional transformations, psychic sensitivity, inherited emotions",
      9: "Emotional connection to beliefs, may travel for emotional fulfillment",
      10: "Public emotional expression, career in caring professions possible",
      11: "Emotional friendships, humanitarian feelings, group emotional bonds",
      12: "Hidden emotions, private emotional life, spiritual sensitivity"
    },
    // Add more planets...
  };

  return interpretations[planet]?.[house] || `${planet} in ${house}th house brings ${planet.toLowerCase()} energy to this life area`;
};

// Analyze chart for specific life areas
export const analyzeCareerFromChart = (
  planets: Record<string, PlanetPosition>,
  aspects: AspectData[]
): string => {
  let analysis = "";
  
  // Check 10th house (career)
  const tenthHousePlanets = Object.entries(planets)
    .filter(([_, pos]) => pos.house === 10);
  
  if (tenthHousePlanets.length > 0) {
    analysis += "Career indicators: ";
    tenthHousePlanets.forEach(([planet, pos]) => {
      const strength = calculatePlanetaryStrength(planet, pos);
      analysis += `${planet} in ${pos.sign} (${strength.dignity}) suggests `;
      
      if (planet === 'Sun') analysis += "leadership roles, authority positions. ";
      if (planet === 'Moon') analysis += "public-facing work, caring professions. ";
      if (planet === 'Mercury') analysis += "communication, writing, teaching careers. ";
      if (planet === 'Venus') analysis += "arts, beauty, diplomacy fields. ";
      if (planet === 'Mars') analysis += "competitive fields, athletics, military. ";
      if (planet === 'Jupiter') analysis += "education, law, philosophy, expansion. ";
      if (planet === 'Saturn') analysis += "structured careers, management, long-term building. ";
    });
  }
  
  // Check Saturn aspects for career challenges/strengths
  const saturnAspects = aspects.filter(a => 
    a.planet1 === 'Saturn' || a.planet2 === 'Saturn'
  );
  
  if (saturnAspects.length > 0) {
    analysis += "\nCareer challenges/lessons: ";
    saturnAspects.forEach(aspect => {
      if (aspect.aspect === 'Square') {
        analysis += "Obstacles requiring discipline to overcome. ";
      }
      if (aspect.aspect === 'Trine') {
        analysis += "Natural career advancement through hard work. ";
      }
    });
  }
  
  return analysis || "Career path open to many possibilities.";
};

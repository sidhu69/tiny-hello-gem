import * as Astronomy from 'astronomy-engine';

export interface BirthDetails {
  year: number;
  month: number;   // 1-12
  day: number;
  hour: number;    // 0-23
  minute: number;  // 0-59
  latitude: number;
  longitude: number;
}

export interface ChartData {
  ascendant: string;
  ascendantDegree: number;
  midheaven: string;
  midheavenDegree: number;
  planets: {
    [key: string]: {
      sign: string;
      degree: number;
      house: number;
      retrograde: boolean;
      exactDegree: number; // Full 0-360 degree position
    };
  };
  houses: number[]; // House cusp degrees
  systemType: string;
  interpretations: {
    personality: string;
    relationships: string;
    career: string;
  };
}

// Convert degrees (0-360) to zodiac sign
const degreeToSign = (degree: number): string => {
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer',
    'Leo', 'Virgo', 'Libra', 'Scorpio',
    'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  const normalizedDegree = ((degree % 360) + 360) % 360;
  const signIndex = Math.floor(normalizedDegree / 30);
  return signs[signIndex];
};

// Calculate Local Sidereal Time
const calculateLST = (time: Astronomy.AstroTime, longitude: number): number => {
  const gst = Astronomy.SiderealTime(time);
  const lst = (gst + longitude / 15) % 24;
  return lst;
};

// Calculate Ascendant (Rising Sign)
const calculateAscendant = (
  time: Astronomy.AstroTime,
  latitude: number,
  longitude: number
): number => {
  const lst = calculateLST(time, longitude);
  const lstDegrees = lst * 15; // Convert hours to degrees
  
  const latRad = (latitude * Math.PI) / 180;
  const ramcRad = (lstDegrees * Math.PI) / 180;
  const obliquity = 23.4393; // Obliquity of the ecliptic
  const oblRad = (obliquity * Math.PI) / 180;
  
  // Ascendant formula
  let ascendant = Math.atan2(
    Math.cos(ramcRad),
    -(Math.sin(ramcRad) * Math.cos(latRad) + Math.tan(oblRad) * Math.sin(latRad))
  );
  
  ascendant = (ascendant * 180) / Math.PI;
  
  // Normalize to 0-360
  if (ascendant < 0) ascendant += 360;
  
  return ascendant;
};

// Calculate Midheaven (MC)
const calculateMidheaven = (time: Astronomy.AstroTime, longitude: number): number => {
  const lst = calculateLST(time, longitude);
  const mc = (lst * 15) % 360; // Convert LST to degrees
  return mc;
};

// Calculate house cusps using Placidus system
const calculateHouseCusps = (
  ascendant: number,
  midheaven: number,
  latitude: number
): number[] => {
  const houses: number[] = new Array(12);
  
  houses[0] = ascendant;                      // 1st house (Ascendant)
  houses[9] = midheaven;                      // 10th house (Midheaven)
  houses[6] = (ascendant + 180) % 360;        // 7th house (Descendant)
  houses[3] = (midheaven + 180) % 360;        // 4th house (IC)
  
  // Simplified Placidus intermediate houses
  // For accurate Placidus, you'd need more complex trigonometry
  // This uses equal divisions as approximation
  const ascToMc = ((midheaven - ascendant + 360) % 360) / 3;
  houses[1] = (ascendant + ascToMc) % 360;     // 2nd house
  houses[2] = (ascendant + 2 * ascToMc) % 360; // 3rd house
  
  const mcToDesc = ((houses[6] - midheaven + 360) % 360) / 3;
  houses[10] = (midheaven + mcToDesc) % 360;   // 11th house
  houses[11] = (midheaven + 2 * mcToDesc) % 360; // 12th house
  
  const descToIc = ((houses[3] - houses[6] + 360) % 360) / 3;
  houses[7] = (houses[6] + descToIc) % 360;    // 8th house
  houses[8] = (houses[6] + 2 * descToIc) % 360; // 9th house
  
  const icToAsc = ((ascendant - houses[3] + 360) % 360) / 3;
  houses[4] = (houses[3] + icToAsc) % 360;     // 5th house
  houses[5] = (houses[3] + 2 * icToAsc) % 360; // 6th house
  
  return houses;
};

// Determine which house a planet is in
const findHouse = (planetDegree: number, houses: number[]): number => {
  const normalizedPlanet = ((planetDegree % 360) + 360) % 360;
  
  for (let i = 0; i < 12; i++) {
    const currentHouse = houses[i];
    const nextHouse = houses[(i + 1) % 12];
    
    if (nextHouse > currentHouse) {
      if (normalizedPlanet >= currentHouse && normalizedPlanet < nextHouse) {
        return i + 1;
      }
    } else {
      // Handle wrap-around at 360°
      if (normalizedPlanet >= currentHouse || normalizedPlanet < nextHouse) {
        return i + 1;
      }
    }
  }
  
  return 1; // Default fallback
};

// Check if planet is retrograde
const isRetrograde = (body: Astronomy.Body, time: Astronomy.AstroTime): boolean => {
  try {
    // Compare position now vs slightly in future
    const now = Astronomy.Ecliptic(Astronomy.GeoVector(body, time, true));
    const future = Astronomy.Ecliptic(
      Astronomy.GeoVector(body, Astronomy.AddDays(time, 1), true)
    );
    
    let diff = future.elon - now.elon;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    
    return diff < 0; // Moving backward = retrograde
  } catch {
    return false;
  }
};

// Generate basic interpretations
const generateInterpretations = (
  ascendant: string,
  sunSign: string,
  moonSign: string
): { personality: string; relationships: string; career: string } => {
  const ascendantTraits: Record<string, string> = {
    Aries: "Bold, energetic, and pioneering in approach to life",
    Taurus: "Stable, practical, and grounded with strong values",
    Gemini: "Curious, communicative, and adaptable in nature",
    Cancer: "Nurturing, intuitive, and emotionally sensitive",
    Leo: "Confident, charismatic, and naturally creative",
    Virgo: "Analytical, detail-oriented, and service-focused",
    Libra: "Diplomatic, charming, and relationship-oriented",
    Scorpio: "Intense, transformative, and deeply perceptive",
    Sagittarius: "Optimistic, adventurous, and philosophical",
    Capricorn: "Ambitious, disciplined, and goal-oriented",
    Aquarius: "Independent, innovative, and humanitarian",
    Pisces: "Compassionate, intuitive, and spiritually inclined"
  };
  
  return {
    personality: `With ${ascendant} rising, you appear ${ascendantTraits[ascendant]?.toLowerCase() || 'unique'}. Your Sun in ${sunSign} drives your core identity, while Moon in ${moonSign} shapes your emotional nature.`,
    relationships: `Your ${ascendant} ascendant makes you approach relationships with ${ascendant === 'Libra' ? 'natural charm and diplomacy' : ascendant === 'Scorpio' ? 'intensity and depth' : 'your unique style'}.`,
    career: `${ascendant} rising suggests success through ${ascendant === 'Capricorn' ? 'disciplined effort and leadership' : ascendant === 'Taurus' ? 'steady work and practical skills' : 'your natural talents'}.`
  };
};

// Main calculation function
export const calculateAccurateBirthChart = (
  birthDetails: BirthDetails
): ChartData => {
  try {
    // Create JavaScript Date object (month is 0-indexed in JS Date)
    const date = new Date(
      birthDetails.year,
      birthDetails.month - 1,
      birthDetails.day,
      birthDetails.hour,
      birthDetails.minute,
      0
    );
    
    // Convert to Astronomy.AstroTime
    const time = Astronomy.MakeTime(date);
    
    // Calculate Ascendant and Midheaven
    const ascendantDegree = calculateAscendant(
      time,
      birthDetails.latitude,
      birthDetails.longitude
    );
    const midheavenDegree = calculateMidheaven(time, birthDetails.longitude);
    
    const ascendant = degreeToSign(ascendantDegree);
    const midheaven = degreeToSign(midheavenDegree);
    
    // Calculate house cusps
    const houses = calculateHouseCusps(
      ascendantDegree,
      midheavenDegree,
      birthDetails.latitude
    );
    
    // Calculate planetary positions
    const planets: ChartData['planets'] = {};
    
    const planetBodies: Array<[string, Astronomy.Body]> = [
      ['Sun', Astronomy.Body.Sun],
      ['Moon', Astronomy.Body.Moon],
      ['Mercury', Astronomy.Body.Mercury],
      ['Venus', Astronomy.Body.Venus],
      ['Mars', Astronomy.Body.Mars],
      ['Jupiter', Astronomy.Body.Jupiter],
      ['Saturn', Astronomy.Body.Saturn],
      ['Uranus', Astronomy.Body.Uranus],
      ['Neptune', Astronomy.Body.Neptune],
      ['Pluto', Astronomy.Body.Pluto],
    ];
    
    planetBodies.forEach(([name, body]) => {
      try {
        const position = Astronomy.Ecliptic(Astronomy.GeoVector(body, time, true));
        const exactDegree = ((position.elon % 360) + 360) % 360;
        
        planets[name] = {
          sign: degreeToSign(exactDegree),
          degree: exactDegree % 30,
          house: findHouse(exactDegree, houses),
          retrograde: name !== 'Sun' && name !== 'Moon' ? isRetrograde(body, time) : false,
          exactDegree: exactDegree
        };
      } catch (error) {
        console.warn(`Could not calculate ${name}:`, error);
      }
    });
    
    // Generate interpretations
    const interpretations = generateInterpretations(
      ascendant,
      planets.Sun?.sign || 'Unknown',
      planets.Moon?.sign || 'Unknown'
    );
    
    return {
      ascendant,
      ascendantDegree: ascendantDegree % 30,
      midheaven,
      midheavenDegree: midheavenDegree % 30,
      planets,
      houses,
      systemType: 'Placidus',
      interpretations
    };
    
  } catch (error) {
    console.error('Chart calculation error:', error);
    throw new Error('Failed to calculate birth chart. Please check birth details.');
  }
};

// Helper function to validate birth details
export const validateBirthDetails = (details: BirthDetails): string[] => {
  const errors: string[] = [];
  
  if (details.year < 1900 || details.year > 2100) {
    errors.push('Year must be between 1900 and 2100');
  }
  if (details.month < 1 || details.month > 12) {
    errors.push('Month must be between 1 and 12');
  }
  if (details.day < 1 || details.day > 31) {
    errors.push('Day must be between 1 and 31');
  }
  if (details.hour < 0 || details.hour > 23) {
    errors.push('Hour must be between 0 and 23');
  }
  if (details.minute < 0 || details.minute > 59) {
    errors.push('Minute must be between 0 and 59');
  }
  if (details.latitude < -90 || details.latitude > 90) {
    errors.push('Latitude must be between -90 and 90');
  }
  if (details.longitude < -180 || details.longitude > 180) {
    errors.push('Longitude must be between -180 and 180');
  }
  
  return errors;
};

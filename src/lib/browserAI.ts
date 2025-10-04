import { pipeline, env } from '@huggingface/transformers';
import {
  calculateAspects,
  calculatePlanetaryStrength,
  analyzeCareerFromChart,
} from './astrologyCalculations';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

let textGenerator: any = null;

export const initializeAI = async () => {
  if (textGenerator) return textGenerator;

  console.log('Loading AI model... This may take a minute on first load.');

  try {
    // Try WebGPU first (faster)
    textGenerator = await pipeline(
      'text-generation',
      'Xenova/Qwen2.5-0.5B-Instruct',
      { device: 'webgpu' }
    );
    console.log('AI model loaded with WebGPU!');
  } catch (error) {
    console.warn('WebGPU not available, falling back to WASM (CPU)');
    
    // Fallback to WASM (works on all devices but slower)
    textGenerator = await pipeline(
      'text-generation',
      'Xenova/Qwen2.5-0.5B-Instruct',
      { device: 'wasm' }
    );
    console.log('AI model loaded with WASM!');
  }

  return textGenerator;
};

export const generateAstrologyResponse = async (
  userQuestion: string,
  astrologyData: any,
  conversationHistory: Array<{ role: string; content: string }>
) => {
  try {
    const generator = await initializeAI();

    // STEP 1: Do REAL calculations
    const aspects = calculateAspects(astrologyData.planets);

    // Calculate planetary strengths
    const planetStrengths = Object.entries(astrologyData.planets).map(
      ([planet, pos]: [string, any]) => ({
        planet,
        ...calculatePlanetaryStrength(planet, pos)
      })
    );

    // STEP 2: Generate context based on CALCULATIONS, not guesswork
    const calculatedInsights = {
      strongPlanets: planetStrengths.filter(p => p.strength > 70),
      weakPlanets: planetStrengths.filter(p => p.strength < 40),
      majorAspects: aspects.filter(a => a.orb < 3), // tight aspects are more important
      careerAnalysis: analyzeCareerFromChart(astrologyData.planets, aspects)
    };

    // Build detailed, ACCURATE context
    const systemContext = `You are an expert astrologer. Use ONLY the calculated data provided - do not make up interpretations.

CLIENT'S CALCULATED CHART DATA:
Ascendant: ${astrologyData.ascendant}

PLANETARY STRENGTHS (calculated):
${calculatedInsights.strongPlanets.map(p =>
  `- ${p.planet} is ${p.dignity} in ${astrologyData.planets[p.planet].sign} (STRONG - ${p.strength}% strength)`
).join('\n')}
${calculatedInsights.weakPlanets.map(p =>
  `- ${p.planet} is ${p.dignity} in ${astrologyData.planets[p.planet].sign} (WEAK - ${p.strength}% strength)`
).join('\n')}

MAJOR ASPECTS (calculated):
${calculatedInsights.majorAspects.map(a =>
  `- ${a.planet1} ${a.aspect} ${a.planet2} (${a.orb.toFixed(1)}° orb)`
).join('\n')}

CAREER ANALYSIS (calculated):
${calculatedInsights.careerAnalysis}

INSTRUCTIONS:
1. Use ONLY the calculated data above when answering
2. If asked about career, reference the Career Analysis section
3. If asked about strengths, mention planets with Domicile or Exalted dignity
4. If asked about challenges, mention planets in Detriment or Fall
5. When mentioning aspects, explain their specific meaning:
   - Conjunction (0°): Blending of energies
   - Sextile (60°): Opportunities, easy flow
   - Square (90°): Tension, growth through challenge
   - Trine (120°): Natural talents, ease
   - Opposition (180°): Awareness through contrast
6. Be specific with degrees and house placements
7. Never make absolute predictions - explain potentials`;

    // Build conversation history (keep last 6 messages)
    let conversation = '';
    conversationHistory.slice(-6).forEach(msg => {
      conversation += `${msg.role === 'user' ? 'User' : 'Astrologer'}: ${msg.content}\n`;
    });

    // Qwen2.5 uses this format for best results
    const prompt = `<|im_start|>system
${systemContext}<|im_end|>
<|im_start|>user
${conversation}
User: ${userQuestion}<|im_end|>
<|im_start|>assistant
`;

    const result = await generator(prompt, {
      max_new_tokens: 350,
      temperature: 0.6, // Lower temperature for more accurate responses
      do_sample: true,
      top_p: 0.9,
      repetition_penalty: 1.2,
    });

    let response = result[0].generated_text;

    // Extract and clean response
    if (response.includes('<|im_start|>assistant')) {
      response = response.split('<|im_start|>assistant').pop()!;
    }
    response = response.replace(/<\|im_end\|>/g, '').trim();

    // Fallback if response is too short
    if (response.length < 50) {
      return `Looking at your ${astrologyData.ascendant} rising and the planets in your chart, I can help with that. Could you be more specific about what you'd like to know?`;
    }

    return response;

  } catch (error) {
    console.error('AI generation error:', error);
    throw error;
  }
};

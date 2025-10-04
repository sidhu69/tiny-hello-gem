import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

let textGenerator: any = null;

export const initializeAI = async () => {
  if (textGenerator) return textGenerator;
  
  console.log('Loading AI model... This may take a minute on first load.');
  
  // Using a small, efficient conversational model
  textGenerator = await pipeline(
    'text-generation',
    'Xenova/phi-1_5_quantized',
    { device: 'webgpu' }
  );
  
  console.log('AI model loaded successfully!');
  return textGenerator;
};

export const generateAstrologyResponse = async (
  userQuestion: string,
  astrologyData: any,
  conversationHistory: Array<{ role: string; content: string }>
) => {
  try {
    const generator = await initializeAI();
    
    // Build context
    const planetsList = Object.entries(astrologyData.planets)
      .map(([planet, data]: [string, any]) => 
        `${planet}: ${data.sign} at ${data.degree}° in ${data.house} house`
      )
      .join(', ');
    
    const context = `You are an astrologer. Birth chart: ${astrologyData.systemType} system, Ascendant: ${astrologyData.ascendant}. Planets: ${planetsList}. 

Personality: ${astrologyData.interpretations.personality}
Relationships: ${astrologyData.interpretations.relationships}
Career: ${astrologyData.interpretations.career}

Answer briefly and clearly.`;

    // Build conversation
    let prompt = context + '\n\n';
    conversationHistory.slice(-4).forEach(msg => {
      prompt += `${msg.role === 'user' ? 'Question' : 'Answer'}: ${msg.content}\n`;
    });
    prompt += `Question: ${userQuestion}\nAnswer:`;
    
    const result = await generator(prompt, {
      max_new_tokens: 300,
      temperature: 0.7,
      do_sample: true,
      top_p: 0.95,
    });
    
    // Extract the generated text
    let response = result[0].generated_text;
    
    // Remove the prompt from the response
    if (response.includes('Answer:')) {
      const parts = response.split('Answer:');
      response = parts[parts.length - 1].trim();
    }
    
    return response || "I'm analyzing your chart. Could you rephrase your question?";
  } catch (error) {
    console.error('AI generation error:', error);
    throw error;
  }
};

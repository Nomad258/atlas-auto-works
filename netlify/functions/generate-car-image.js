import OpenAI from 'openai';

/**
 * Netlify Function: Generate Car Image with DALL-E 3
 * Creates photorealistic images of configured cars in Moroccan locations
 */

export async function handler(event, context) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Méthode non autorisée' })
    };
  }

  try {
    // Parse request body
    const { location, season, timeOfDay, carColor, carModel } = JSON.parse(event.body);

    // Validate required fields
    if (!location || !season || !timeOfDay || !carColor || !carModel) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Paramètres manquants',
          details: 'location, season, timeOfDay, carColor, et carModel sont requis'
        })
      };
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY not configured');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Configuration API manquante' })
      };
    }

    // Build detailed French prompt for DALL-E
    const prompt = buildPrompt({ location, season, timeOfDay, carColor, carModel });

    console.log('Generating image with prompt:', prompt);

    // Generate image with DALL-E 3
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1792x1024', // Landscape format
      quality: 'standard', // Use 'hd' for higher quality (costs more)
      style: 'natural' // 'natural' for photorealistic, 'vivid' for more stylized
    });

    const imageUrl = response.data[0].url;
    const revisedPrompt = response.data[0].revised_prompt;

    console.log('Image generated successfully:', imageUrl);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        imageUrl,
        revisedPrompt,
        params: { location, season, timeOfDay, carColor, carModel },
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Error generating image:', error);

    // Handle specific OpenAI errors
    if (error.status === 429) {
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({
          error: 'Limite de requêtes atteinte',
          message: 'Trop de requêtes. Veuillez patienter quelques instants.'
        })
      };
    }

    if (error.status === 401) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          error: 'Erreur d\'authentification API',
          message: 'Clé API invalide. Veuillez contacter le support.'
        })
      };
    }

    // Generic error
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Erreur de génération d\'image',
        message: error.message || 'Une erreur s\'est produite lors de la génération de l\'image.'
      })
    };
  }
}

/**
 * Build detailed French prompt for DALL-E
 */
function buildPrompt({ location, season, timeOfDay, carColor, carModel }) {
  // Location descriptions in French
  const locationDescriptions = {
    casablanca: 'la Corniche de Casablanca avec vue sur l\'océan Atlantique',
    marrakech: 'les Jardins de la Koutoubia à Marrakech avec le minaret en arrière-plan',
    atlas: 'les montagnes de l\'Atlas avec pics enneigés',
    sahara: 'le désert du Sahara avec dunes de sable doré',
    tangier: 'le Cap Spartel à Tanger où la Méditerranée rencontre l\'Atlantique',
    chefchaouen: 'les ruelles pittoresques de Chefchaouen aux murs bleu azur'
  };

  // Season descriptions
  const seasonDescriptions = {
    spring: 'au printemps avec végétation luxuriante',
    summer: 'en été avec ciel bleu éclatant',
    autumn: 'en automne avec lumière dorée',
    winter: 'en hiver avec lumière douce'
  };

  // Time of day lighting descriptions
  const timeDescriptions = {
    dawn: 'à l\'aube avec première lumière dorée',
    day: 'en plein jour avec lumière naturelle éclatante',
    sunset: 'au coucher du soleil avec ciel orange et rose',
    night: 'la nuit avec éclairage urbain et ciel étoilé'
  };

  const locationDesc = locationDescriptions[location.toLowerCase()] || location;
  const seasonDesc = seasonDescriptions[season.toLowerCase()] || season;
  const timeDesc = timeDescriptions[timeOfDay.toLowerCase()] || timeOfDay;

  // Construct detailed prompt
  const prompt = `Une photographie ultra-réaliste professionnelle d'une ${carModel} ${carColor} stationnée à ${locationDesc}, ${seasonDesc}, ${timeDesc}. La voiture est photographiée en angle 3/4 avant, montrant parfaitement sa carrosserie personnalisée et ses détails. Éclairage naturel professionnel, netteté extrême, résolution 4K, composition cinématographique, pas de texte ni de personnes.`;

  return prompt;
}

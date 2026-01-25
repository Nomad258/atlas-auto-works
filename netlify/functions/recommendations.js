import OpenAI from 'openai';

/**
 * Netlify Function: Smart Product Recommendations
 * Uses GPT-4 to suggest complementary products based on current configuration
 */

export async function handler(event, context) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS
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
    // Parse request
    const { configuration, availableProducts } = JSON.parse(event.body);

    if (!configuration) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Configuration manquante' })
      };
    }

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    if (!process.env.OPENAI_API_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Configuration API manquante' })
      };
    }

    // Build recommendation prompt
    const prompt = buildRecommendationPrompt(configuration, availableProducts);

    console.log('Generating recommendations for configuration');

    // Call GPT-4 for intelligent recommendations
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert en personnalisation automobile qui suggère des produits complémentaires pour créer une apparence cohérente et professionnelle. Réponds UNIQUEMENT en JSON valide.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 800,
      response_format: { type: 'json_object' }
    });

    const response = JSON.parse(completion.choices[0].message.content);

    console.log('Recommendations generated:', response.recommendations?.length || 0);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        recommendations: response.recommendations || [],
        reasoning: response.reasoning || '',
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Recommendations error:', error);

    if (error.status === 429) {
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({
          error: 'Limite de requêtes atteinte'
        })
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Erreur de génération de recommandations',
        message: error.message || 'Une erreur s\'est produite.'
      })
    };
  }
}

/**
 * Build recommendation prompt
 */
function buildRecommendationPrompt(configuration, availableProducts) {
  const selectedItems = configuration.selectedProducts || [];
  const vehicle = configuration.vehicle || {};

  let prompt = `En tant qu'expert en personnalisation automobile, analyse cette configuration et suggère 3-5 produits complémentaires:

Véhicule: ${vehicle.make || ''} ${vehicle.model || ''} ${vehicle.year || ''}

Produits actuellement sélectionnés:
${selectedItems.length > 0 ? selectedItems.map(item => `- ${item.name} (${item.category}): ${item.price} DH`).join('\n') : 'Aucun produit sélectionné'}

Objectif: Suggère des produits qui:
1. Complètent harmonieusement les choix actuels
2. Créent une apparence cohérente et professionnelle
3. Offrent un bon rapport qualité-prix
4. Sont adaptés au type de véhicule

`;

  if (availableProducts && availableProducts.length > 0) {
    prompt += `\nProduits disponibles pour recommandation:
${availableProducts.slice(0, 20).map(p => `- ${p.name} (${p.category}): ${p.price} DH`).join('\n')}`;
  }

  prompt += `\n\nRéponds en JSON avec cette structure exacte:
{
  "recommendations": [
    {
      "productId": "id du produit",
      "name": "nom du produit",
      "category": "catégorie",
      "reason": "raison de cette recommandation (2-3 phrases)"
    }
  ],
  "reasoning": "explication globale de la stratégie de personnalisation (2-3 phrases)"
}`;

  return prompt;
}

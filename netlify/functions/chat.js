import OpenAI from 'openai';

/**
 * Netlify Function: Chat Assistant with GPT-4
 * Provides French-language assistance for car configuration
 */

export async function handler(event, context) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS request
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
    const { messages, configuration } = JSON.parse(event.body);

    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Messages invalides' })
      };
    }

    // Initialize OpenAI
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

    // Build system prompt with configuration context
    const systemPrompt = buildSystemPrompt(configuration);

    // Prepare messages for GPT-4
    const gptMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    console.log('Chat request with', messages.length, 'messages');

    // Call GPT-4
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: gptMessages,
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    });

    const assistantMessage = completion.choices[0].message.content;

    console.log('Chat response generated');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: assistantMessage,
        usage: completion.usage,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Chat error:', error);

    // Handle specific errors
    if (error.status === 429) {
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({
          error: 'Limite de requêtes atteinte',
          message: 'Trop de requêtes. Veuillez patienter.'
        })
      };
    }

    if (error.status === 401) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          error: 'Erreur d\'authentification',
          message: 'Clé API invalide.'
        })
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Erreur du chat',
        message: error.message || 'Une erreur s\'est produite.'
      })
    };
  }
}

/**
 * Build system prompt with configuration context
 */
function buildSystemPrompt(configuration) {
  const basePrompt = `Tu es un assistant expert en personnalisation automobile chez Atlas Auto Works, le leader marocain de la customisation de véhicules de luxe. Tu dois TOUJOURS répondre en français.

Ta mission:
- Aider les clients à choisir les meilleures options de personnalisation
- Répondre aux questions sur les prix, délais, garanties et installation
- Suggérer des produits complémentaires qui créent une apparence cohérente
- Être professionnel, courtois et passionné par l'automobile
- Utiliser un vocabulaire technique automobile approprié en français

Informations importantes:
- Atlas Auto Works a 3 ateliers: Casablanca, Marrakech, Tanger
- Garantie de 3 ans sur toutes les installations
- Délais: 1-3 semaines selon la complexité
- TVA marocaine: 20%
- Taux horaire main d'œuvre: 350 DH/heure`;

  // Add configuration context if provided
  if (configuration && Object.keys(configuration).length > 0) {
    let configContext = '\n\nConfiguration actuelle du client:';

    if (configuration.vehicle) {
      configContext += `\n- Véhicule: ${configuration.vehicle.make} ${configuration.vehicle.model} ${configuration.vehicle.year}`;
    }

    if (configuration.selectedProducts && configuration.selectedProducts.length > 0) {
      configContext += `\n- Produits sélectionnés: ${configuration.selectedProducts.map(p => p.name).join(', ')}`;
    }

    if (configuration.totalPrice) {
      configContext += `\n- Prix total actuel: ${configuration.totalPrice} DH`;
    }

    return basePrompt + configContext;
  }

  return basePrompt;
}

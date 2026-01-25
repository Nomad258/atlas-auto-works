/**
 * Centralized error handling utility
 * Provides user-friendly error messages in French
 */

export class AppError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Error codes and their French translations
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion. Veuillez vérifier votre connexion internet.',
  API_KEY_ERROR: 'Erreur de configuration API. Veuillez contacter le support.',
  TIMEOUT_ERROR: 'La requête a expiré. Veuillez réessayer.',
  VALIDATION_ERROR: 'Veuillez vérifier les informations saisies.',
  NOT_FOUND: 'Ressource non trouvée.',
  IMAGE_GENERATION_ERROR: 'Impossible de générer l\'image. Veuillez réessayer.',
  CHAT_ERROR: 'Erreur de l\'assistant. Veuillez réessayer.',
  RATE_LIMIT_ERROR: 'Trop de requêtes. Veuillez patienter quelques instants.',
  GENERIC_ERROR: 'Une erreur s\'est produite. Veuillez réessayer.'
};

/**
 * Handle API errors and return user-friendly messages
 */
export function handleAPIError(error) {
  console.error('API Error:', error);

  // Network errors
  if (!navigator.onLine) {
    return new AppError(ERROR_MESSAGES.NETWORK_ERROR, 'NETWORK_ERROR');
  }

  // Timeout errors
  if (error.name === 'AbortError' || error.code === 'ETIMEDOUT') {
    return new AppError(ERROR_MESSAGES.TIMEOUT_ERROR, 'TIMEOUT_ERROR');
  }

  // API Key errors
  if (error.status === 401 || error.status === 403) {
    return new AppError(ERROR_MESSAGES.API_KEY_ERROR, 'API_KEY_ERROR');
  }

  // Rate limiting
  if (error.status === 429) {
    return new AppError(ERROR_MESSAGES.RATE_LIMIT_ERROR, 'RATE_LIMIT_ERROR');
  }

  // Not found
  if (error.status === 404) {
    return new AppError(ERROR_MESSAGES.NOT_FOUND, 'NOT_FOUND');
  }

  // Validation errors
  if (error.status === 400) {
    return new AppError(
      error.message || ERROR_MESSAGES.VALIDATION_ERROR,
      'VALIDATION_ERROR',
      error.details
    );
  }

  // Generic error
  return new AppError(
    error.message || ERROR_MESSAGES.GENERIC_ERROR,
    'GENERIC_ERROR'
  );
}

/**
 * Log error to console (can be extended to send to monitoring service)
 */
export function logError(error, context = {}) {
  const errorLog = {
    message: error.message,
    code: error.code,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    context,
    userAgent: navigator.userAgent,
    url: window.location.href
  };

  console.error('Error Log:', errorLog);

  // TODO: Send to monitoring service (Sentry, LogRocket, etc.)
  // Example: Sentry.captureException(error, { extra: errorLog });

  return errorLog;
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff(fn, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      const backoffDelay = delay * Math.pow(2, i);
      console.log(`Retry attempt ${i + 1} after ${backoffDelay}ms`);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }
}

export default {
  AppError,
  ERROR_MESSAGES,
  handleAPIError,
  logError,
  retryWithBackoff
};

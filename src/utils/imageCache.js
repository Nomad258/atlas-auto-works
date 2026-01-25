/**
 * Image caching utility for DALL-E generated images
 * Reduces API costs by caching images in localStorage
 */

const CACHE_PREFIX = 'atlas_image_';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Generate cache key from image parameters
 */
export function generateCacheKey(params) {
  const { location, season, timeOfDay, carColor, carModel } = params;
  return `${CACHE_PREFIX}${location}_${season}_${timeOfDay}_${carColor}_${carModel}`.replace(/\s+/g, '_');
}

/**
 * Save image URL to cache
 */
export function cacheImage(params, imageUrl) {
  try {
    const key = generateCacheKey(params);
    const cacheData = {
      url: imageUrl,
      timestamp: Date.now(),
      params
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
    return true;
  } catch (error) {
    console.error('Failed to cache image:', error);
    // localStorage might be full, try to clear old entries
    clearExpiredCache();
    return false;
  }
}

/**
 * Get image URL from cache
 */
export function getCachedImage(params) {
  try {
    const key = generateCacheKey(params);
    const cached = localStorage.getItem(key);

    if (!cached) return null;

    const cacheData = JSON.parse(cached);
    const age = Date.now() - cacheData.timestamp;

    // Check if cache is still valid
    if (age > CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }

    return cacheData.url;
  } catch (error) {
    console.error('Failed to get cached image:', error);
    return null;
  }
}

/**
 * Clear expired cache entries
 */
export function clearExpiredCache() {
  try {
    const keys = Object.keys(localStorage);
    const now = Date.now();

    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        try {
          const cached = JSON.parse(localStorage.getItem(key));
          if (now - cached.timestamp > CACHE_DURATION) {
            localStorage.removeItem(key);
          }
        } catch (e) {
          // Invalid cache entry, remove it
          localStorage.removeItem(key);
        }
      }
    });
  } catch (error) {
    console.error('Failed to clear expired cache:', error);
  }
}

/**
 * Clear all image cache
 */
export function clearAllImageCache() {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    return true;
  } catch (error) {
    console.error('Failed to clear image cache:', error);
    return false;
  }
}

/**
 * Get cache stats
 */
export function getCacheStats() {
  try {
    const keys = Object.keys(localStorage);
    const imageKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));
    const now = Date.now();

    const stats = {
      total: imageKeys.length,
      valid: 0,
      expired: 0,
      size: 0
    };

    imageKeys.forEach(key => {
      try {
        const value = localStorage.getItem(key);
        stats.size += value.length;

        const cached = JSON.parse(value);
        if (now - cached.timestamp > CACHE_DURATION) {
          stats.expired++;
        } else {
          stats.valid++;
        }
      } catch (e) {
        stats.expired++;
      }
    });

    // Convert size to KB
    stats.size = Math.round(stats.size / 1024);

    return stats;
  } catch (error) {
    console.error('Failed to get cache stats:', error);
    return { total: 0, valid: 0, expired: 0, size: 0 };
  }
}

export default {
  generateCacheKey,
  cacheImage,
  getCachedImage,
  clearExpiredCache,
  clearAllImageCache,
  getCacheStats
};

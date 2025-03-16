const cache = new Map<string, { data: any; timestamp: number }>();

export async function BaseFetch<T>(
  url: string,
  cacheKey: string,
  cacheDurationSeconds = 60
): Promise<T | null> {
  try {
    const cacheDuration = cacheDurationSeconds * 1000; // Convert seconds to milliseconds
    const now = Date.now();

    // Check if data exists in memory cache
    if (cache.has(cacheKey)) {
      const cachedData = cache.get(cacheKey);
      if (cachedData && now - cachedData.timestamp < cacheDuration) {
        // console.log(`[Cache] Loaded from memory: ${cacheKey}`);
        return cachedData.data as T;
      } else {
        // console.log(`[Cache] Expired, fetching new data: ${cacheKey}`);
        cache.delete(cacheKey); // Remove expired data
      }
    }

    // Fetch new data from API
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch: ${url}`);

    const data = await response.json();

    // Store data in memory cache with timestamp
    cache.set(cacheKey, { data, timestamp: now });

    return data as T;
  } catch (error) {
    console.error(`[Error] Fetching API: ${url}`, error);
    return null;
  }
}

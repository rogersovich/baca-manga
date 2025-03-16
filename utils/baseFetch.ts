export async function BaseFetch<T>(
  url: string,
  cacheKey: string,
  cacheDurationSeconds = 60
): Promise<T | null> {
  try {
    const cacheDuration = cacheDurationSeconds * 1000; // Convert seconds to milliseconds

    // Check if data exists in localStorage
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      const parsedCache = JSON.parse(cachedData);
      const now = new Date().getTime();

      // Validate cache expiration
      if (now - parsedCache.timestamp < cacheDuration) {
        // console.log(`[Cache] Loaded from localStorage: ${cacheKey}`);
        return parsedCache.data as T;
      } else {
        // console.log(`[Cache] Expired, fetching new data: ${cacheKey}`);
      }
    }

    // Fetch new data from API
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch: ${url}`);

    const data = await response.json();

    // Store data in localStorage with timestamp
    localStorage.setItem(
      cacheKey,
      JSON.stringify({ data, timestamp: new Date().getTime() })
    );

    return data as T;
  } catch (error) {
    console.error(`[Error] Fetching API: ${url}`, error);
    return null;
  }
}

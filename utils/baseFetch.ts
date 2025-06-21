// utils/BaseFetch.ts

// Global queue and processing flag for all Jikan API calls
const jikanRequestQueue: Array<{
  url: string;
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  cacheKey: string;
  cacheDurationSeconds: number;
  isRefresh: boolean;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body: any;
  timeoutMs: number;
}> = [];
let isJikanProcessingQueue = false;

// Minimum delay between requests to respect Jikan's 3 req/sec limit (e.g., 350-400ms)
const JIKAN_MIN_INTERVAL = 400; // milliseconds

// Original cache map
const cache = new Map<string, { data: any; timestamp: number }>();

const processJikanQueue = async () => {
  if (isJikanProcessingQueue || jikanRequestQueue.length === 0) {
    return;
  }
  isJikanProcessingQueue = true;

  while (jikanRequestQueue.length > 0) {
    const {
      url,
      resolve,
      reject,
      cacheKey,
      cacheDurationSeconds,
      isRefresh,
      method,
      body,
      timeoutMs,
    } = jikanRequestQueue.shift()!; // ! is for non-null assertion

    console.log(`Processing Jikan queue: ${url}`);

    const cacheDuration = cacheDurationSeconds * 1000;
    const now = Date.now();
    const isCacheable = method === "GET";

    let dataToReturn: any | null = null;
    let fromCache = false;

    // Check cache first if applicable
    if (isCacheable && !isRefresh && cache.has(cacheKey)) {
      const cachedData = cache.get(cacheKey);
      if (cachedData && now - cachedData.timestamp < cacheDuration) {
        dataToReturn = cachedData.data;
        fromCache = true;
        console.log(`Serving from cache for: ${url}`);
      } else {
        cache.delete(cacheKey); // Cache expired
      }
    }

    if (fromCache) {
      resolve(dataToReturn); // Resolve immediately from cache
    } else {
      // If not from cache, perform the actual fetch
      // ✅ Setup AbortController for timeout
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const fetchOptions: RequestInit = {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        };

        const response = await fetch(url, fetchOptions);
        clearTimeout(timeout); // Clear timeout if fetch completes

        if (response.status === 429) {
          // Rate limit hit specifically
          console.warn(
            `Rate limit (429) hit for ${url}. Re-queuing and waiting.`
          );
          // Re-queue the request at the front
          jikanRequestQueue.unshift({
            url,
            resolve,
            reject,
            cacheKey,
            cacheDurationSeconds,
            isRefresh,
            method,
            body,
            timeoutMs,
          });
          // Wait longer, then restart queue processing
          await new Promise((res) => setTimeout(res, 3000)); // Wait 3 seconds
          isJikanProcessingQueue = false; // Allow re-initiation
          processJikanQueue(); // Re-trigger queue processing
          return; // Exit this iteration to respect the wait
        }

        if (!response.ok) {
          // If not OK but not 429, it's an error we want to propagate
          const errorData = await response
            .json()
            .catch(() => ({ message: response.statusText }));
          const errorResponse = {
            status: response.status,
            message: errorData.message || response.statusText,
            data: null,
          };
          reject(errorResponse); // Reject the promise
          // No need to re-queue if it's not a 429
        } else {
          // Successful response
          const data = await response.json();
          // Assuming the data structure from Jikan includes 'data' and you want to add status
          const finalData = { ...data, status: response.status };

          if (isCacheable) {
            cache.set(cacheKey, { data: finalData, timestamp: now });
          }
          resolve(finalData); // Resolve the promise with the successful data
        }
      } catch (error: any) {
        clearTimeout(timeout); // Ensure timeout is cleared even on error
        if (error.name === "AbortError") {
          console.error(`Fetch to ${url} timed out`);
          reject({
            status: 408, // HTTP 408 Request Timeout
            message: "Request Timeout",
            data: null,
          });
        } else {
          console.error(`Error during fetch for ${url}:`, error);
          reject(error); // Propagate other errors
        }
      }
    }

    // Always wait for the minimum interval between actual HTTP requests
    // This applies after a successful fetch or a non-429 error, but not after a cache hit.
    if (!fromCache) {
      await new Promise((res) => setTimeout(res, JIKAN_MIN_INTERVAL));
    }
  }
  isJikanProcessingQueue = false;
  console.log("Jikan queue processed.");
};

export async function BaseFetch<T>(
  url: string,
  cacheKey: string,
  cacheDurationSeconds = 60,
  isRefresh = false,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body: any = null,
  timeoutMs = 5000 // 5 seconds
): Promise<T | null> {
  return new Promise((resolve, reject) => {
    // Add the request to the queue
    jikanRequestQueue.push({
      url,
      resolve,
      reject,
      cacheKey,
      cacheDurationSeconds,
      isRefresh,
      method,
      body,
      timeoutMs,
    });
    if (!isJikanProcessingQueue) {
      processJikanQueue(); // Start processing if not already
    }
  });
}

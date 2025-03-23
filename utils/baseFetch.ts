const cache = new Map<string, { data: any; timestamp: number }>();

export async function BaseFetch<T>(
  url: string,
  cacheKey: string,
  cacheDurationSeconds = 60,
  isRefresh = false,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body: any = null,
  timeoutMs = 5000 // 5 seconds
): Promise<T | null> {
  try {
    const cacheDuration = cacheDurationSeconds * 1000;
    const now = Date.now();

    // Skip cache if isRefresh is true or method is not GET
    const isCacheable = method === "GET";

    if (isCacheable && !isRefresh && cache.has(cacheKey)) {
      const cachedData = cache.get(cacheKey);
      if (cachedData && now - cachedData.timestamp < cacheDuration) {
        return cachedData.data as T;
      } else {
        cache.delete(cacheKey);
      }
    }

    // ✅ Setup AbortController for timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    // Build fetch options
    const fetchOptions: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    };

    const response = await fetch(url, fetchOptions);
    clearTimeout(timeout);

    if (!response.ok) {
      return {
        status: response.status,
        message: response.statusText,
        data: null,
      } as T;
    }

    const data = await response.json();
    data.status = response.status;

    // Store data in memory cache if method is GET
    if (isCacheable) {
      cache.set(cacheKey, { data, timestamp: now });
    }

    return data as T;
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.error(`Fetch to ${url} timed out`);
      return {
        status: 408, // HTTP 408 Request Timeout
        message: "Request Timeout",
        data: null,
      } as T;
    }
    return error as T;
  }
}

export function useBaseFetch<T>(
  url: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    headers?: Record<string, string>;
    body?: any;
    params?: Record<string, any>;
  } = {},
  staleTime = 60000, // 1 minute
  server = true
) {
  const method = options.method || "GET";

  // ✅ Handle params and append as query string
  let fullUrl = url;
  if (options.params && method === "GET") {
    const queryString = new URLSearchParams(options.params).toString();
    fullUrl += (url.includes("?") ? "&" : "?") + queryString;
  }

  const cacheKey = "baseFetch-" + fullUrl;
  const cache = useState<Record<string, { data: T; timestamp: number }>>(
    "fetchCache",
    () => ({})
  );

  return useAsyncData<T>(
    cacheKey,
    async () => {
      const now = Date.now();
      const cachedEntry = cache.value[cacheKey];

      // Only cache GET requests
      if (
        method === "GET" &&
        cachedEntry &&
        now - cachedEntry.timestamp < staleTime
      ) {
        return cachedEntry.data;
      }

      // Fetch new data
      const data = await $fetch<T>(fullUrl, {
        ...options,
        method,
        headers: {
          // "X-Custom-Header": "MyDefaultHeader",
          ...(options.headers || {}), // Menggabungkan dengan header dari pengguna
        },
        body: options.body || undefined,
      });

      // Cache GET requests
      if (method === "GET") {
        cache.value[cacheKey] = { data, timestamp: now };
      }

      return data;
    },
    {
      lazy: true,
      default: () => null,
      server: server,
    }
  );
}

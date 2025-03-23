export function useBaseFetch<T>(
  url: string,
  options: any = {},
  staleTime = 60000 // 1 minute
) {
  const method = options.method || "GET";
  const cacheKey = "baseFetch-" + url;
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
      const data = await $fetch<T>(url, {
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
      server: method === "GET", // Disable SSR for POST, PUT, DELETE
    }
  );
}

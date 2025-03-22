import { ref } from "vue";
import type { TBaseResponse } from "~/types/jikanBaseManga.type";
import type { TMangaResponse } from "~/types/jikanManga.type";

type MangasReponse = TBaseResponse<TMangaResponse>;
type ErrorResponse = any;

export function useJikanRandomManga() {
  const responses = ref<MangasReponse>();
  const isLoading = ref(true);
  const error = ref<ErrorResponse>(null);
  const config = useRuntimeConfig();

  const fetchRandomManga = async (isRefresh = false) => {
    isLoading.value = true;
    error.value = null;

    const getRandomCode = () => {
      const min = 1;
      const max = 100000;
      return Math.floor(Math.random() * (max - min + 1) + min);
    };
    const url = `${config.public.apiJikan}/random/manga`;
    const cacheKey = `get-random-manga-${getRandomCode()}`;

    const data = await BaseFetch<MangasReponse>(url, cacheKey, 60, isRefresh);
    const status = +data?.status;

    if (status >= 200 && status < 300 && data) {
      error.value = null;
      responses.value = data;
    } else {
      error.value = data?.message;
    }
    isLoading.value = false;
  };

  return { responses, isLoading, error, fetchRandomManga };
}

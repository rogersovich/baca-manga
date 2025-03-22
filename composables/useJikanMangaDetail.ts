import { ref } from "vue";
import type { TBaseResponse } from "~/types/jikanBaseManga.type";
import type { TMangaResponse } from "~/types/jikanManga.type";

type MangasReponse = TBaseResponse<TMangaResponse>;
type ErrorResponse = any;

export function useJikanMangaDetail() {
  const responses = ref<MangasReponse>();
  const isLoading = ref(true);
  const error = ref<ErrorResponse>(null);
  const config = useRuntimeConfig();

  const fetchMangaDetail = async (comic_id: number, isRefresh = false) => {
    isLoading.value = true;
    error.value = null;

    const url = `${config.public.apiUrl}/manga/${comic_id}`;
    const cacheKey = `get-manga-${comic_id}`;

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

  return { responses, isLoading, error, fetchMangaDetail };
}

import { ref } from "vue";
import type { TBaseResponse } from "~/types/jikanBaseManga.type";
import type {
  TMangaFilterParams,
  TMangaResponse,
} from "~/types/jikanManga.type";

type MangasReponse = TBaseResponse<TMangaResponse[]>;
type ErrorResponse = any;

export function useJikanManga() {
  const responses = ref<MangasReponse>();
  const isLoading = ref(true);
  const error = ref<ErrorResponse>(null);
  const config = useRuntimeConfig();

  const fetchMangas = async (filter: TMangaFilterParams, isRefresh = false) => {
    isLoading.value = true;
    error.value = null;

    // Build query params dynamically
    const queryParams = new URLSearchParams({
      page: filter.page.toString(),
      limit: filter.limit.toString(),
      order_by: filter.order_by,
      sort: filter.sort,
    });

    // Add q only if provided
    if (filter.q) {
      queryParams.append("q", filter.q);
    }

    // Add q only if provided
    if (filter.type) {
      queryParams.append("type", filter.type);
    }

    const stringParams = queryParams.toString();

    const url = `${config.public.apiJikan}/manga?${stringParams}`;
    const cacheKey = `get-mangas-${stringParams}`;

    const data = await BaseFetch<MangasReponse>(url, cacheKey, 60, isRefresh);
    const status = +data?.status;

    if (status < 300 && data) {
      error.value = null;
      responses.value = data;
    } else {
      error.value = data?.message;
    }
    isLoading.value = false;
  };

  return { responses, isLoading, error, fetchMangas };
}

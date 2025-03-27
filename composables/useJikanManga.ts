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
  const isLoading = ref(false);
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

    if (filter.type) {
      queryParams.append("type", filter.type);
    }

    if (filter.status) {
      queryParams.append("status", filter.status);
    }

    if (filter.min_score) {
      queryParams.append("min_score", filter.min_score);
    }

    if (filter.max_score) {
      queryParams.append("max_score", filter.max_score);
    }

    if (filter.start_date) {
      queryParams.append("start_date", filter.start_date);
    }

    if (filter.end_date) {
      queryParams.append("end_date", filter.end_date);
    }

    if (filter.genres) {
      const genresValue = filter.genres.join(",");
      queryParams.append("genres", genresValue);
    }

    const stringParams = queryParams.toString();

    const url = `${config.public.apiJikan}/manga?${stringParams}`;
    const cacheKey = `get-mangas-${stringParams}`;

    const data = await BaseFetch<MangasReponse>(url, cacheKey, 60, isRefresh);
    const status = +data?.status;

    if (status < 300 && data) {
      error.value = null;
      responses.value = data;
      isLoading.value = false;

      return data.data;
    } else {
      error.value = data?.message;
      isLoading.value = false;

      return [];
    }
  };

  return { responses, isLoading, error, fetchMangas };
}

import { ref } from "vue";
import type {
  TKitsuBaseResponse,
  TKitsuMangaFilterParams,
} from "~/types/kitsuBase.type";

type ErrorResponse = any;

export function useKitsuManga() {
  const responses = ref<TKitsuBaseResponse>();
  const isLoading = ref(true);
  const error = ref<ErrorResponse>(null);
  const config = useRuntimeConfig();

  const fetchKitsuMangas = async (
    filter: TKitsuMangaFilterParams,
    isRefresh = false
  ) => {
    isLoading.value = true;
    error.value = null;

    // Build query params manually to match Kitsu API style
    const queryParams = new URLSearchParams();

    if (filter.title) {
      queryParams.append("filter[text]", filter.title);
    }

    if (filter.limit) {
      queryParams.append("page[limit]", filter.limit.toString());
    }

    const stringParams = queryParams.toString();

    const url = `${config.public.apiKitsu}/manga?${stringParams}`;
    const cacheKey = `kitsu-get-mangas-${stringParams}`;

    const data = await BaseFetch<TKitsuBaseResponse>(
      url,
      cacheKey,
      60,
      isRefresh
    );
    const status = +data?.status;

    if (status < 300 && data) {
      error.value = null;
      responses.value = data;
    } else {
      error.value = data?.message;
    }
    isLoading.value = false;
  };

  return { responses, isLoading, error, fetchKitsuMangas };
}

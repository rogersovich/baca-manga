import { ref } from "vue";
import type {
  FilterMangaPayload,
  MangadexBaseResponseData,
  TMangadexMangaData,
} from "~/types/manga";
import { buildQueryString } from "~/utils/queryBuilder";

type MangaChapterReponse = MangadexBaseResponseData<TMangadexMangaData[]>;
type ErrorResponse = any;

export function useMangadexManga() {
  const responses = ref<MangaChapterReponse>();
  const isLoading = ref(true);
  const error = ref<ErrorResponse>(null);
  const config = useRuntimeConfig();

  const fetchComicMangadex = async (
    payload: FilterMangaPayload,
    isRefresh = false
  ) => {
    isLoading.value = true;
    error.value = null;

    const queryParams = buildQueryString(payload);

    const url = `${config.public.apiMangadex}/manga${queryParams}`;
    const cacheKey = `mangadex-get-comic-${queryParams}`;

    const data = await BaseFetch<MangaChapterReponse>(
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

  return { responses, isLoading, error, fetchComicMangadex };
}

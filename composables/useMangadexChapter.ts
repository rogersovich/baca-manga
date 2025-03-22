import { ref } from "vue";
import type {
  FilterMangaChapterPayload,
  MangadexBaseResponseData,
  TMangadexMangaChapterData,
} from "~/types/manga";
import { buildQueryStringChapter } from "~/utils/queryBuilder";

type MangaChapterReponse = MangadexBaseResponseData<
  TMangadexMangaChapterData[]
>;
type ErrorResponse = any;

export function useMangadexChapter() {
  const responses = ref<MangaChapterReponse>();
  const isLoading = ref(false);
  const error = ref<ErrorResponse>(null);
  const config = useRuntimeConfig();

  const fetchChapterMangadex = async (
    payload: FilterMangaChapterPayload,
    isRefresh = false
  ) => {
    isLoading.value = true;
    error.value = null;

    const queryParams = buildQueryStringChapter(payload);

    const url = `${config.public.apiMangadex}/chapter${queryParams}`;
    const cacheKey = `mangadex-get-chapter-${queryParams}`;

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

  return { responses, isLoading, error, fetchChapterMangadex };
}

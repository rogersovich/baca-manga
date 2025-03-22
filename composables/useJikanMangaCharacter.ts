import { ref } from "vue";
import type { TBaseResponse } from "~/types/jikanBaseManga.type";
import type { TMangaCharacter } from "~/types/jikanMangaCharacter.type";

type CharacterReponse = TBaseResponse<TMangaCharacter[]>;
type ErrorResponse = any;

export function useJikanMangaCharacter() {
  const responses = ref<CharacterReponse>();
  const isLoading = ref(true);
  const error = ref<ErrorResponse>(null);
  const config = useRuntimeConfig();

  const fetchMangaCharacter = async (comic_id: number, isRefresh = false) => {
    isLoading.value = true;
    error.value = null;

    const url = `${config.public.apiUrl}/manga/${comic_id}/characters`;
    const cacheKey = `get-manga-characters-${comic_id}`;

    const data = await BaseFetch<CharacterReponse>(
      url,
      cacheKey,
      60,
      isRefresh
    );
    const status = +data?.status;

    if (status >= 200 && status < 300 && data) {
      error.value = null;
      responses.value = data;
    } else {
      error.value = data?.message;
    }
    isLoading.value = false;
  };

  return { responses, isLoading, error, fetchMangaCharacter };
}

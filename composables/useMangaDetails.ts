import { ref, onMounted } from "vue";
import type { Ref } from "vue";
import { useRoute } from "vue-router";
import mangaDexService from "@/utils/mangadexService";
import type { FilterMangaDetailResponse, MangaData } from "@/types/manga";

export function useMangaDetails() {
  const route = useRoute();
  const manga: Ref<MangaData | null> = ref(null);
  const loading: Ref<boolean> = ref(false);
  const error: Ref<string | null> = ref(null);

  const loadMangaDetails = async (params: FilterMangaDetailResponse) => {
    loading.value = true;
    try {
      const data = await mangaDexService.fetchMangaDetails(
        route.params.id as string,
        params
      );
      if (data) {
        manga.value = data.data;
      } else {
        throw new Error("Failed to fetch manga detail");
      }
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  };

  onMounted(loadMangaDetails);

  return { manga, loading, error, loadMangaDetails };
}

export const fetchMangaDetail = async (
  id: string,
  params: FilterMangaDetailResponse
) => {
  const responses: Ref<MangaData | null> = ref(null);
  const loading: Ref<boolean> = ref(false);
  const error: Ref<string | null> = ref(null);

  loading.value = true;
  try {
    const data = await mangaDexService.fetchMangaDetails(id, params);
    if (data) {
      responses.value = data.data;
    } else {
      throw new Error("Failed to fetch manga detail");
    }
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    loading.value = false;
  }

  return { responses, loading, error };
};

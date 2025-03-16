import { ref } from "vue";
import type { Ref } from "vue";
import mangaDexService from "@/utils/mangadexService";
import type { MangaData, FilterMangaResponse } from "@/types/manga";

export function useManga(params: FilterMangaResponse) {
  const mangaList: Ref<MangaData[]> = ref([]);
  const total = ref(0);
  const loading: Ref<boolean> = ref(false);
  const error: Ref<string | null> = ref(null);

  const loadMangaList = async () => {
    loading.value = true;
    try {
      const data = await mangaDexService.fetchMangaList(params);
      if (data) {
        mangaList.value = data.data;
        total.value = data.total;
      } else {
        throw new Error("Failed to fetch manga list");
      }
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  };

  watchEffect(() => {
    loadMangaList();
  });

  return { mangaList, loading, error, loadMangaList, total };
}

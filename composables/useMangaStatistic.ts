import { ref } from "vue";
import type { Ref } from "vue";
import mangaDexService from "@/utils/mangadexService";
import type { FilterMangaStatisticsResponse } from "@/types/manga";

export function useMangaStatistic(params: FilterMangaStatisticsResponse) {
  const mangaStatistics: Ref<any> = ref([]);
  const loading: Ref<boolean> = ref(false);
  const error: Ref<string | null> = ref(null);

  const loadMangaStatistics = async () => {
    loading.value = true;
    try {
      const data = await mangaDexService.fetchMangaStatics(params);
      if (data) {
        mangaStatistics.value = data.data;
      } else {
        throw new Error("Failed to fetch manga statistics");
      }
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  };

  watchEffect(() => {
    loadMangaStatistics();
  });

  return { mangaStatistics, loading, error, loadMangaStatistics };
}

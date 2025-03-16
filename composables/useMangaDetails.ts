import { ref, onMounted } from "vue";
import type { Ref } from "vue";
import { useRoute } from "vue-router";
import mangaDexService from "@/utils/mangadexService";
import type { MangaData } from "@/types/manga";

export function useMangaDetails() {
  const route = useRoute();
  const manga: Ref<MangaData | null> = ref(null);
  const loading: Ref<boolean> = ref(false);
  const error: Ref<string | null> = ref(null);

  const loadMangaDetails = async () => {
    loading.value = true;
    try {
      const data = await mangaDexService.fetchMangaDetails(route.params.id as string);
      if (data) {
        manga.value = data;
        console.log("[Composable] Fetched Manga Details:", manga.value);
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

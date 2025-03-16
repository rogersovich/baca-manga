import { ref, onMounted } from "vue";
import type { Ref } from "vue";
import { useRoute } from "vue-router";
import mangaDexService from "@/utils/mangadexService";
import type { ChapterData } from "@/types/manga";

export function useMangaChapters() {
  const route = useRoute();
  const chapters: Ref<ChapterData[]> = ref([]);
  const loading: Ref<boolean> = ref(false);
  const error: Ref<string | null> = ref(null);

  const loadMangaChapters = async () => {
    loading.value = true;
    try {
      const data = await mangaDexService.fetchMangaChapters(route.params.id as string);
      if (data) {
        chapters.value = data;
        console.log("[Composable] Fetched Manga Chapters:", chapters.value);
      }
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  };

  onMounted(loadMangaChapters);

  return { chapters, loading, error, loadMangaChapters };
}

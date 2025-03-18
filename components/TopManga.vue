<template>
  <div class="p-4 rounded-md">
    <div>
      <h1 class="text-white text-lg font-bold">
        Top {{ apiParams.limit }} Rating
      </h1>
    </div>
    <template v-if="listTopManga.loading || listMangaStatistic.loading">
      <div class="grid grid-rows-5 gap-3 my-4">
        <div v-for="i in 5" :key="i" class="row-span-1">
          <div class="flex flex-row space-x-3">
            <Skeleton class="h-[110px] w-[30%] rounded-xl" />
            <div class="space-y-2 w-full flex flex-col justify-center">
              <Skeleton class="h-3 w-[85%]" />
              <Skeleton class="h-3 w-[70%]" />
              <Skeleton class="h-3 w-[50%]" />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template
      v-if="
        !listTopManga.loading &&
        !listMangaStatistic.loading &&
        !listTopManga.error
      "
    >
      <div class="grid grid-rows-5 gap-2 mt-3">
        <div
          v-for="manga in listTopManga.value"
          :key="manga.id"
          class="row-span-1"
        >
          <TopCard
            :manga="manga"
            :statistic="listMangaStatistic.value[manga.id]"
          />
        </div>
      </div>
    </template>
    <div v-if="listTopManga.error || listMangaStatistic.error">Error...</div>
  </div>
</template>

<script setup lang="ts">
import type {
  FilterMangaResponse,
  FilterMangaStatisticsResponse,
  FilterOrders,
  MangaData,
} from "~/types/manga";
import mangaDexService from "@/utils/mangadexService";

const filterOrder = ref<FilterOrders>({ rating: "desc", year: "desc" });
const apiParams = reactive<FilterMangaResponse>({
  limit: 5,
  offset: 0,
  includes: ["cover_art"],
  order: filterOrder.value,
  contentRating: ["safe", "suggestive", "erotica"],
  hasAvailableChapters: "true",
});

const apiParamStatistic = reactive<FilterMangaStatisticsResponse>({
  manga: [],
});

const listMangaStatistic = reactive<{
  value: any;
  loading: boolean;
  error: string | null;
}>({
  value: [],
  loading: false,
  error: null,
});

const listTopManga = reactive<{
  value: MangaData[];
  loading: boolean;
  total: number;
  error: string | null;
}>({
  value: [],
  total: 0,
  loading: false,
  error: null,
});

const loadMangaList = async () => {
  listTopManga.loading = true;
  try {
    const data = await mangaDexService.fetchMangaList(apiParams);
    if (data) {
      listTopManga.value = data.data;
      listTopManga.total = data.total || 0;
      apiParamStatistic.manga = data.data.map((manga) => manga.id);
    } else {
      throw new Error("Failed to fetch manga list");
    }
  } catch (err) {
    listTopManga.error = (err as Error).message;
  } finally {
    listTopManga.loading = false;
  }
};

const loadMangaStatistics = async () => {
  listMangaStatistic.loading = true;
  try {
    const data = await mangaDexService.fetchMangaStatics(apiParamStatistic);
    if (data) {
      listMangaStatistic.value = data.data;
    } else {
      throw new Error("Failed to fetch manga statistics");
    }
  } catch (err) {
    listMangaStatistic.error = (err as Error).message;
  } finally {
    listMangaStatistic.loading = false;
  }
};

onMounted(async () => {
  await loadMangaList();
  await loadMangaStatistics();
});
</script>

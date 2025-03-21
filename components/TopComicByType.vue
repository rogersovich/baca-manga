<template>
  <div class="p-4 rounded-md">
    <div>
      <h1 class="text-white text-lg font-bold">
        Top {{ filters.limit }} {{ getTitleType }}
      </h1>
    </div>
    <template v-if="isLoading">
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
    <template v-if="!isLoading && !error">
      <div class="grid grid-rows-5 gap-2 mt-3">
        <div
          v-for="manga in res_mangaList?.data"
          :key="manga.mal_id"
          class="row-span-1"
        >
          <TopCard :manga="manga" />
        </div>
      </div>
    </template>
    <div v-if="error">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TMangaFilterParams } from "~/types/jikanManga.type";

const props = defineProps<{
  type: "manga" | "manhwa" | "manhua";
}>();

const filters = reactive<TMangaFilterParams>({
  page: 1,
  limit: 5,
  order_by: "score",
  sort: "desc",
  type: props.type,
});

const getTitleType = computed(() => {
  switch (props.type) {
    case "manga":
      return "Manga";
    case "manhwa":
      return "Manhwa";
    case "manhua":
      return "Manhua";
    default:
      return "";
  }
});

const {
  fetchMangas,
  responses: res_mangaList,
  isLoading,
  error,
} = useJikanManga();

onMounted(async () => {
  setTimeout(async () => {
    await fetchMangas(filters);
  }, 2000);
});
</script>

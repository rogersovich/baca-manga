<template>
  <div class="lg:p-4 rounded-md">
    <div>
      <h1 class="text-white text-lg font-bold">
        Top {{ filters.limit }} {{ getTitleType }}
      </h1>
    </div>
    <template v-if="topComicPending">
      <div class="grid grid-rows-5 gap-3 my-4">
        <div v-for="i in 5" :key="i" class="row-span-1">
          <div class="flex flex-row space-x-3">
            <Skeleton
              class="h-[130px] sm:h-[170px] md:h-[120px] xl:h-[125px] 2xl:h-[150px] w-[30%] rounded-xl"
            />
            <div class="space-y-2 w-full flex flex-col justify-center">
              <Skeleton class="h-3 w-[85%]" />
              <Skeleton class="h-3 w-[70%]" />
              <Skeleton class="h-3 w-[50%]" />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-if="!topComicPending && !topComicError">
      <div class="grid grid-rows-5 gap-2 mt-3">
        <div
          v-for="manga in topComicData?.data"
          :key="manga.mal_id"
          class="row-span-1"
        >
          <TopCard :manga="manga" />
        </div>
      </div>
    </template>
    <div v-if="topComicError">
      <div class="flex flex-col items-center mt-5">
        <div>
          <img
            src="/images/empty-data.png"
            alt="No data available"
            class="rounded-md h-[150px]"
          />
        </div>
        <div class="text-white text-lg font-bold mt-3">Data is Empty</div>
        <div
          v-if="intervalError.status"
          class="text-gray-50/50 font-light tracking-wide text-xs"
        >
          Please try again in {{ intervalError.second }} seconds
        </div>
        <Button
          size="sm"
          class="text-[12px] mt-2"
          :disabled="intervalError.status"
          @click="topComicRefresh()"
          >Try Again</Button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TMangaFilterParams } from "~/types/jikanManga.type";

const props = defineProps<{
  type: "manga" | "manhwa" | "manhua";
}>();

const intervalError = reactive({
  status: false,
  second: 3,
});

const filters = reactive<TMangaFilterParams>({
  page: 1,
  limit: 5,
  order_by: "score",
  sort: "desc",
  type: props.type,
  sfw: false,
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
  responses: topComicData,
  isLoading: topComicPending,
  error: topComicError,
} = useJikanManga();

const topComicRefresh = () => {
  fetchMangas(filters, true);
  handleIntervalError();
};

const handleIntervalError = () => {
  if (topComicError.value) {
    intervalError.status = true;

    const countdown = setInterval(() => {
      if (intervalError.second > 1) {
        intervalError.second -= 1;
      } else {
        clearInterval(countdown);
        intervalError.second = 3;
        intervalError.status = false;
      }
    }, 1000);
  }
};

onMounted(async () => {
  await fetchMangas(filters);

  handleIntervalError();
});
</script>

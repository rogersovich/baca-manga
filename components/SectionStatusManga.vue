<template>
  <section id="main-manga" class="mt-6">
    <div
      class="text-white text-4xl md:text-2xl font-bold text-center sm:text-left"
    >
      Maybe Relevant
    </div>

    <div
      class="flex flex-col sm:flex-row items-center sm:justify-between sm:my-4 my-6 gap-4"
    >
      <div class="flex gap-2">
        <Button
          :variant="badgeFilter == 'manga' ? 'default' : 'outline'"
          @click="handleFetchMangas('manga')"
        >
          Manga
        </Button>
        <Button
          :variant="badgeFilter == 'manhwa' ? 'default' : 'outline'"
          @click="handleFetchMangas('manhwa')"
        >
          Manhwa
        </Button>
        <Button
          :variant="badgeFilter == 'manhua' ? 'default' : 'outline'"
          @click="handleFetchMangas('manhua')"
        >
          Manhua
        </Button>
      </div>
      <div>
        <Pagination
          v-slot="{ page }"
          v-model:page="pagination.page"
          :items-per-page="pagination.per_page"
          :total="pagination.total"
          :disabled="isLoading"
          @update:page="onUpdatePage($event)"
        >
          <PaginationList class="flex items-center gap-1">
            <PaginationPrev
              :class="{
                'bg-primary text-primary-foreground hover:text-secondary hover:bg-primary':
                  page !== 1,
                'bg-secondary': page == 1,
              }"
            />
            <PaginationNext
              :class="{
                'bg-primary text-primary-foreground hover:text-secondary hover:bg-primary':
                  page != 10,
                'bg-secondary': page == 10,
              }"
            />
          </PaginationList>
        </Pagination>
      </div>
    </div>
    <div
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-6 gap-6"
    >
      <template v-if="isLoading">
        <div v-for="i in 12" :key="i" class="col-span-1">
          <div class="flex flex-col space-y-2">
            <Skeleton class="h-[180px] w-full rounded-xl" />
            <div class="space-y-2">
              <Skeleton class="h-3 w-[85%]" />
              <Skeleton class="h-3 w-[75%]" />
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="error">
        <div class="col-span-6">
          <div class="flex flex-col items-center">
            <div>
              <img
                src="/images/empty-data.png"
                alt="No data available"
                class="rounded-md h-[300px]"
              />
            </div>
            <div class="text-white text-2xl font-bold mt-3">Data is Empty</div>
            <div
              v-if="intervalError.status"
              class="text-gray-50/50 font-light tracking-wide text-sm"
            >
              Please try again in 5 seconds
            </div>
            <Button
              :disabled="intervalError.status"
              class="mt-2"
              @click="handleFetchMangas(badgeFilter)"
              >Try Again</Button
            >
          </div>
        </div>
      </template>
      <template v-else>
        <div
          v-for="manga in res_mangaList?.data"
          :key="manga.mal_id"
          class="col-span-1"
        >
          <MainMangaCard :manga="manga" />
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { TMangaFilterParams } from "~/types/jikanManga.type";

type TBadgeFilter = "manga" | "manhwa" | "manhua";

const intervalError = reactive({
  status: false,
  second: 3,
});

const badgeFilter = ref<TBadgeFilter>("manga");
const filters = reactive<TMangaFilterParams>({
  page: 1,
  limit: 12,
  order_by: "score",
  sort: "desc",
  type: badgeFilter.value,
});

const pagination = reactive({
  page: filters.page,
  total: 0,
  per_page: filters.limit,
});

const {
  fetchMangas,
  responses: res_mangaList,
  isLoading,
  error,
} = useJikanManga();

const onUpdatePage = async (page: number) => {
  pagination.page = page;
  filters.page = page;

  await fetchMangas(filters);
};

const handleFetchMangas = async (type: TBadgeFilter) => {
  badgeFilter.value = type;
  filters.type = type;
  filters.page = 1;

  await fetchMangas(filters);
};

const handleIntervalError = () => {
  if (error.value) {
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

  pagination.total = res_mangaList.value?.pagination?.items?.total || 0;

  handleIntervalError();
});
</script>

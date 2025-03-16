<template>
  <section id="main-manga" class="mt-8">
    <div class="text-white text-2xl font-bold">Publication Demographic</div>
    <div class="flex justify-between my-4">
      <div class="flex gap-2">
        <Button
          :variant="badgeFilter == 'shounen' ? 'default' : 'outline'"
          @click="handleFetchMangas('shounen')"
        >
          Shounen
        </Button>
        <Button
          :variant="badgeFilter == 'shoujo' ? 'default' : 'outline'"
          @click="handleFetchMangas('shoujo')"
        >
          Shoujo
        </Button>
        <Button
          :variant="badgeFilter == 'josei' ? 'default' : 'outline'"
          @click="handleFetchMangas('josei')"
        >
          Josei
        </Button>
        <Button
          :variant="badgeFilter == 'seinen' ? 'default' : 'outline'"
          @click="handleFetchMangas('seinen')"
        >
          Seinen
        </Button>
      </div>
      <div>
        <Pagination
          v-slot="{ page }"
          v-model:page="pagination.page"
          :items-per-page="pagination.per_page"
          :total="pagination.total"
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
    <div class="grid grid-cols-6 gap-6">
      <template v-if="loading">
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
      <template v-if="!loading && !error">
        <div v-for="manga in mangaList" :key="manga.id" class="col-span-1">
          <MainMangaCard :manga="manga" />
        </div>
      </template>
      <div v-if="error" class="col-span-6">
        <div class="flex flex-col items-center">
          <div>
            <img
              src="/images/empty-data.png"
              alt="No data available"
              class="rounded-md h-[300px]"
            />
          </div>
          <div class="text-white text-2xl font-bold mt-3">Data is Empty</div>
          <div class="text-gray-50/50 font-light tracking-wide text-sm mb-2">
            Please try again in 5 seconds
          </div>
          <Button @click="handleFetchMangas(badgeFilter)">Try Again</Button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useManga } from "@/composables/useManga";
import type {
  FilterMangaResponse,
  FilterOrders,
  FilterPublicationDemographic,
} from "@/types/manga";

const badgeFilter = ref<FilterPublicationDemographic>("shounen");
const filterOrder = ref<FilterOrders>({ year: "desc" });
const publication_demographic = ref<FilterPublicationDemographic>("shounen");
const apiParams = reactive<FilterMangaResponse>({
  limit: 12,
  offset: 0,
  includes: ["cover_art"],
  order: filterOrder.value,
  contentRating: ["safe", "suggestive", "erotica"],
  hasAvailableChapters: "true",
  publicationDemographic: [publication_demographic.value],
});

const { mangaList, loading, error, total } = useManga(apiParams);

const pagination = reactive({
  page: 1,
  total: total,
  per_page: 12,
});

const onUpdatePage = (page: number) => {
  pagination.page = page;

  const limit = apiParams.limit;
  const offset = (page - 1) * limit;

  apiParams.limit = limit;
  apiParams.offset = offset;
};

const handleFetchMangas = (type: FilterPublicationDemographic) => {
  badgeFilter.value = type;
  publication_demographic.value = type;

  // Trigger a refetch by updating the apiParams
  pagination.page = 1;
  apiParams.offset = 0;
  apiParams.limit = 12;
  apiParams.publicationDemographic = [publication_demographic.value];
};
</script>

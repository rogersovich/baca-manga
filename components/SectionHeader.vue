<template>
  <header
    class="flex items-center z-50 justify-between px-8 py-4 bg-gray-950 border-b border-gray-50/10 text-white w-full fixed"
  >
    <div class="logo">
      <img
        src="/images/logo.png"
        class="h-10 w-10 cursor-pointer"
        @click="goHome"
      />
    </div>
    <div class="flex items-center gap-2">
      <div class="relative w-full max-w-sm items-center group">
        <Input
          id="search"
          ref="inputRef"
          v-model="searchQuery"
          type="text"
          placeholder="Search..."
          class="pr-10 w-[350px] group-hover:border-gray-50/20"
          :class="{ 'pr-14': searchQuery }"
          autocomplete="off"
          @focus="handleFocus"
        />
        <span
          class="absolute right-0 inset-y-0 flex items-center justify-center px-2"
        >
          <template v-if="searchQuery">
            <IconX
              class="size-4 text-muted-foreground mr-2 cursor-pointer"
              @click="clearSearch"
            />
          </template>
          <IconCommand
            class="size-5 text-muted-foreground group-hover:text-primary"
          />
        </span>
        <template v-if="isOpenBar">
          <div
            class="absolute top-10 left-0 w-full border border-gray-50/20 mt-2 bg-gray-950 rounded-md"
          >
            <div class="grid grid-cols-1">
              <div
                v-for="(manga, i) in mangaSearching.data"
                :key="manga.id"
                class="col-span-1"
                @mouseenter="setHover(i + 1)"
              >
                <SearchMangaCard
                  :manga="manga"
                  :statistic="listMangaStatistic.value[manga.id]"
                  :index="i + 1"
                  :selected-index="searchIndex"
                />
              </div>
              <div class="col-span-1">
                <div
                  class="w-full rounded-md p-2 flex items-center justify-between"
                >
                  <div class="flex items-center gap-2">
                    <div class="flex items-center gap-1 text-muted-foreground">
                      <IconKeyboardFilled class="size-4" />
                      <span class="text-[12px]">to select</span>
                    </div>
                    <div class="flex items-center gap-1 text-muted-foreground">
                      <IconX class="size-4" />
                      <span class="text-[12px]">Esc to exit</span>
                    </div>
                  </div>
                  <div
                    class="flex items-center gap-1 text-muted-foreground cursor-pointer"
                  >
                    <IconLogin2 class="size-4" />
                    <div class="text-[12px]">View all</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div
        class="border border-gray-50/10 rounded-md p-[7px] cursor-pointer group hover:border-gray-50/20"
      >
        <IconSearch
          class="size-5 text-muted-foreground group-hover:text-primary"
        />
      </div>
      <div
        class="border border-gray-50/10 rounded-md p-[7px] cursor-pointer group hover:border-gray-50/20"
      >
        <IconArrowsShuffle
          class="size-5 text-muted-foreground group-hover:text-primary"
        />
      </div>
    </div>
    <div class="actions">Login</div>
  </header>
</template>

<script setup lang="ts">
import {
  IconCommand,
  IconSearch,
  IconArrowsShuffle,
  IconX,
  IconKeyboardFilled,
  IconLogin2,
} from "@tabler/icons-vue";
import mangaDexService from "@/utils/mangadexService";
import { onClickOutside, useDebounce, useEventListener } from "@vueuse/core";
import type {
  FilterMangaResponse,
  FilterMangaStatisticsResponse,
  MangaData,
} from "~/types/manga";

const isOpenBar = ref(false);
const inputRef = ref(null);
const searchQuery = ref("");
const searchIndex = ref<number | null>(null);

const apiParams = reactive<FilterMangaResponse>({
  limit: 5,
  offset: 0,
  includes: ["cover_art"],
  contentRating: ["safe"],
});

const mangaSearching = reactive<{
  data: MangaData[];
  loading: boolean;
  error: string | null;
}>({
  data: [],
  loading: false,
  error: null,
});

const apiParamStatistic = reactive<FilterMangaStatisticsResponse>({
  manga: [],
});

const listMangaStatistic = reactive<{
  value: any;
  loading: boolean;
  error: string | null;
}>({
  value: null,
  loading: false,
  error: null,
});

const setHover = (index: number | null) => {
  searchIndex.value = index;
};

const handleFocus = async () => {
  if (searchQuery.value) {
    await fetchAPIMangaAndStatistics();
    isOpenBar.value = true;
  }
};

// Detect clicks outside the input
onClickOutside(inputRef, () => {
  isOpenBar.value = false;
});

const loadMangaList = async () => {
  mangaSearching.loading = true;
  try {
    const data = await mangaDexService.fetchMangaList(apiParams);
    if (data) {
      mangaSearching.data = data.data;
      apiParamStatistic.manga = data.data.map((manga) => manga.id);
    } else {
      throw new Error("Failed to fetch manga list");
    }
  } catch (err) {
    mangaSearching.error = (err as Error).message;
  } finally {
    mangaSearching.loading = false;
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

const fetchAPIMangaAndStatistics = async () => {
  await loadMangaList();
  await loadMangaStatistics();
};

// Debounce search query
const debouncedQuery = useDebounce(searchQuery, 500);

// Watch the debounced value
watch(debouncedQuery, async (newValue) => {
  if (newValue) {
    apiParams.title = newValue;

    await fetchAPIMangaAndStatistics();
    isOpenBar.value = true;
  } else {
    mangaSearching.data = [];
    listMangaStatistic.value = null;
    isOpenBar.value = false;
  }
});

const clearSearch = () => {
  searchQuery.value = "";
  mangaSearching.data = [];
  listMangaStatistic.value = null;
  isOpenBar.value = false;
};

// Function to handle Enter key action
const handleEnter = () => {
  if (searchIndex.value) {
    console.log("Selected Manga:", searchIndex.value);
    console.log(mangaSearching.data[searchIndex.value - 1]);
  }
  // You can navigate or open details here
};

// Handle keydown events
useEventListener("keydown", (event) => {
  if (mangaSearching.data.length === 0) return;

  if (event.key === "ArrowDown") {
    if (searchIndex.value === null) {
      searchIndex.value = 1;
    } else {
      searchIndex.value = (searchIndex.value + 1) % mangaSearching.data.length;
      if (searchIndex.value === 0) {
        searchIndex.value = mangaSearching.data.length;
      }
    }
  } else if (event.key === "ArrowUp") {
    if (searchIndex.value === null) {
      searchIndex.value = mangaSearching.data.length;
    } else {
      searchIndex.value =
        (searchIndex.value - 1 + mangaSearching.data.length) %
        mangaSearching.data.length;
      if (searchIndex.value === 0) {
        searchIndex.value = mangaSearching.data.length;
      }
    }
  } else if (event.key === "Enter" && searchIndex.value !== null) {
    handleEnter();
  }
});

const goHome = () => {
  navigateTo("/");
};
</script>

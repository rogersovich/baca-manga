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
    <div ref="inputRef" class="flex items-center gap-2">
      <div
        v-if="route.path != '/search'"
        class="relative w-full max-w-sm items-center group"
      >
        <Input
          id="search"
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
        <template v-if="searchStore.is_open_bar">
          <ContainerHeaderCard
            :manga-list="res_mangaList?.data || []"
            :error="error"
            :is-loading="isLoading"
            :search-index="searchIndex || 0"
            @set-hover="setHover"
          />
        </template>
      </div>

      <TooltipProvider :delay-duration="200">
        <Tooltip>
          <TooltipTrigger as-child>
            <div
              class="border border-gray-50/10 rounded-md p-[7px] cursor-pointer group hover:border-gray-50/20"
              @click="goPageSearch"
            >
              <IconSearch
                class="size-5 text-muted-foreground group-hover:text-primary"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div>Advance Search</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider :delay-duration="200">
        <Tooltip>
          <TooltipTrigger as-child>
            <div
              class="border border-gray-50/10 rounded-md p-[7px] cursor-pointer group hover:border-gray-50/20"
              @click="handleFetchRandomManga"
            >
              <IconArrowsShuffle
                class="size-5 text-muted-foreground group-hover:text-primary"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div>Random Manga</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
    <div class="actions">
      <TooltipProvider :delay-duration="200">
        <Tooltip>
          <TooltipTrigger as-child>
            <div
              class="border border-gray-50/10 rounded-md p-[7px] cursor-pointer group hover:border-gray-50/20"
            >
              <IconUserSquareRounded
                class="size-6 text-muted-foreground group-hover:text-primary"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div>About Creator</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </header>
</template>

<script setup lang="ts">
import {
  IconCommand,
  IconSearch,
  IconArrowsShuffle,
  IconX,
  IconUserSquareRounded,
} from "@tabler/icons-vue";
import { onClickOutside, useDebounce, useEventListener } from "@vueuse/core";
import type { TMangaFilterParams } from "~/types/jikanManga.type";

const searchStore = useSearchStore();
const comicStore = useComicStore();
const inputRef = ref(null);
const searchQuery = ref("");
const searchIndex = ref<number | null>(null);
const loading = useLoadingIndicator();
const route = useRoute();

const filters = reactive<TMangaFilterParams>({
  page: 1,
  limit: 5,
  order_by: "score",
  sort: "desc",
});

watch(
  () => searchStore.mal_id,
  async (newVal) => {
    if (newVal === 0) return;

    const selectedComic = res_mangaList.value?.data.find(
      (comic) => comic.mal_id === newVal
    );
    const slug = titleToSlug(selectedComic?.title || "");
    const id = newVal;
    const url = `/${slug}/${id}`;

    loading.start();
    await waitForSeconds(500);
    await navigateTo(url);
    clearSearch();
    searchStore.setMalId(0);
  }
);

const {
  fetchMangas,
  responses: res_mangaList,
  isLoading,
  error,
} = useJikanManga();

const { fetchRandomManga, responses: resRandomManga } = useJikanRandomManga();

const setHover = (index: number | null) => {
  searchIndex.value = index;
};

const handleFocus = async () => {
  if (searchQuery.value) {
    await fetchMangas(filters);

    searchStore.setOpenBar(true);
  }
};

// Detect clicks outside the input
onClickOutside(inputRef, () => {
  searchStore.setOpenBar(false);
});

// Debounce search query
const debouncedQuery = useDebounce(searchQuery, 500);

// Watch the debounced value
watch(debouncedQuery, async (newValue) => {
  if (newValue) {
    filters.q = newValue;

    searchStore.setOpenBar(true);
    await fetchMangas(filters);
  } else {
    filters.q = "";

    searchStore.setOpenBar(false);
  }
});

const clearSearch = () => {
  searchQuery.value = "";
  searchStore.setOpenBar(false);
};

// Function to handle Enter key action
const handleEnter = () => {
  if (res_mangaList.value?.data.length === 0) return;
  if (searchIndex.value) {
    const selectedComic = res_mangaList.value?.data[searchIndex.value - 1];
    const mal_id = selectedComic?.mal_id;

    searchStore.setMalId(mal_id || 0);
  }
};

// Handle keydown events
useEventListener("keydown", (event) => {
  const mangasLength = res_mangaList.value?.data.length || 0;
  if (mangasLength === 0) return;

  if (event.key === "ArrowDown" && mangasLength > 0) {
    if (searchIndex.value === null) {
      searchIndex.value = 1;
    } else {
      searchIndex.value = (searchIndex.value + 1) % mangasLength;
      if (searchIndex.value === 0) {
        searchIndex.value = mangasLength;
      }
    }
  } else if (event.key === "ArrowUp") {
    if (searchIndex.value === null) {
      searchIndex.value = mangasLength;
    } else {
      searchIndex.value = (searchIndex.value - 1 + mangasLength) % mangasLength;
      if (searchIndex.value === 0) {
        searchIndex.value = mangasLength;
      }
    }
  } else if (event.key === "Enter" && searchIndex.value !== null) {
    handleEnter();
  }
});

const goHome = () => {
  navigateTo("/");
};

const goPageSearch = () => {
  navigateTo("/search");
};

const handleFetchRandomManga = async () => {
  loading.start();

  await fetchRandomManga();

  comicStore.setRandomComic(true);
  const randomManga = resRandomManga.value?.data;

  const slug = titleToSlug(randomManga?.title || "");
  const id = randomManga?.mal_id;
  const url = `/${slug}/${id}`;

  await navigateTo(url, { replace: true });
};
</script>

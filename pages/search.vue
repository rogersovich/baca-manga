<template>
  <div class="grid grid-cols-12 justify-center gap-4">
    <div class="col-start-3 col-span-8">
      <div class="grid grid-cols-12 gap-x-3 gap-y-4">
        <div class="col-span-12">
          <div class="mb-2 font-bold tracking-wide px-1">Search Title</div>
          <div class="relative group">
            <Input
              id="search"
              v-model="filters.search"
              type="text"
              placeholder="Search your title..."
              class="pr-10 w-full group-hover:border-gray-50/20"
              :class="{ 'pr-15': filters.search }"
              autocomplete="off"
            />
            <span
              class="absolute right-0 inset-y-0 flex items-center justify-center px-2"
            >
              <template v-if="filters.search">
                <IconX
                  class="size-5 text-muted-foreground mr-3 cursor-pointer"
                  @click="filters.search = ''"
                />
              </template>
              <IconCommand
                class="size-5 text-muted-foreground group-hover:text-primary"
              />
            </span>
          </div>
        </div>
        <div class="col-span-3">
          <div class="mb-2 font-bold tracking-wide px-1">Type</div>
          <div class="flex items-center gap-2">
            <div
              :class="{
                'basis-[90%]': filters.type != '',
                'basis-[100%]': filters.type == '',
              }"
            >
              <Select v-model="filters.type">
                <SelectTrigger class="w-full h-11 text-[14px]">
                  <SelectValue
                    :class="{
                      'text-muted-foreground': filters.sort == '',
                    }"
                    placeholder="Select Type"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="option in optionTypes"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div v-if="filters.type != ''" class="basis-[10%] group">
              <IconX
                class="w-6 h-6 text-white/70 cursor-pointer group-hover:rotate-180 transition-all"
                @click="filters.type = ''"
              />
            </div>
          </div>
        </div>
        <div class="col-span-3">
          <div class="mb-2 font-bold tracking-wide px-1">Status</div>
          <div class="flex items-center gap-2">
            <div
              :class="{
                'basis-[90%]': filters.status != '',
                'basis-[100%]': filters.status == '',
              }"
            >
              <Select v-model="filters.status">
                <SelectTrigger class="w-full h-11 text-[14px]">
                  <SelectValue
                    :class="{
                      'text-muted-foreground': filters.sort == '',
                    }"
                    placeholder="Select Status"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="option in optionStatus"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div v-if="filters.status != ''" class="basis-[10%] group">
              <IconX
                class="w-6 h-6 text-white/70 cursor-pointer group-hover:rotate-180 transition-all"
                @click="filters.status = ''"
              />
            </div>
          </div>
        </div>
        <div class="col-span-3">
          <div class="mb-2 font-bold tracking-wide px-1">Genres</div>
          <MultiSelect
            v-model="filters.genre"
            :options="optionGenre"
            :disabled="genrePending"
            placeholder="Select Genres"
          />
        </div>
        <div v-if="isExpanded" class="col-span-3">
          <div class="mb-2 font-bold tracking-wide px-1">Sorting</div>
          <div class="flex items-center gap-2">
            <div class="basis-[100%]">
              <Select v-model="filters.sort">
                <SelectTrigger class="w-full h-11 text-[14px]">
                  <SelectValue
                    :class="{
                      'text-muted-foreground': filters.sort == '',
                    }"
                    placeholder="Select Sorting"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="option in optionSorts"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div v-if="isExpanded" class="col-span-4">
          <div class="grid grid-cols-2 gap-3">
            <div class="col-span-1">
              <div class="mb-2 font-bold tracking-wide px-1">Min Score</div>
              <div class="relative w-full max-w-sm items-center">
                <Input
                  v-model="filters.min_score"
                  type="text"
                  placeholder="e.g 10"
                  class="pr-6"
                />
                <span
                  v-if="filters.min_score"
                  class="absolute end-0 inset-y-0 flex items-center justify-center px-2"
                >
                  <IconX
                    class="size-4 text-muted-foreground"
                    @click="filters.min_score = ''"
                  />
                </span>
              </div>
            </div>
            <div class="col-span-1">
              <div class="mb-2 font-bold tracking-wide px-1">Max Score</div>
              <div class="relative w-full max-w-sm items-center">
                <Input
                  v-model="filters.max_score"
                  type="text"
                  placeholder="e.g 10"
                  class="pr-6"
                />
                <span
                  v-if="filters.max_score"
                  class="absolute end-0 inset-y-0 flex items-center justify-center px-2"
                >
                  <IconX
                    class="size-4 text-muted-foreground"
                    @click="filters.max_score = ''"
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="isExpanded" class="col-span-5">
          <div class="grid grid-cols-2 gap-3">
            <div class="col-span-1">
              <div class="mb-2 font-bold tracking-wide px-1">Start Date</div>
              <Popover>
                <PopoverTrigger as-child>
                  <Button
                    variant="outline"
                    :class="
                      cn(
                        'w-full justify-start text-left font-normal',
                        !filters.start_date && 'text-muted-foreground'
                      )
                    "
                  >
                    <IconCalendar class="mr-2 h-4 w-4" />
                    {{
                      filters.start_date
                        ? df.format(
                            filters.start_date.toDate(getLocalTimeZone())
                          )
                        : "Pick a date"
                    }}
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0">
                  <Calendar v-model="filters.start_date" initial-focus />
                </PopoverContent>
              </Popover>
            </div>
            <div class="col-span-1">
              <div class="mb-2 font-bold tracking-wide px-1">End Date</div>
              <Popover>
                <PopoverTrigger as-child>
                  <Button
                    variant="outline"
                    :class="
                      cn(
                        'w-full justify-start text-left font-normal',
                        !filters.end_date && 'text-muted-foreground'
                      )
                    "
                  >
                    <IconCalendar class="mr-2 h-4 w-4" />
                    {{
                      filters.end_date
                        ? df.format(filters.end_date.toDate(getLocalTimeZone()))
                        : "Pick a date"
                    }}
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0">
                  <Calendar v-model="filters.end_date" initial-focus />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <div class="col-span-3 flex items-end justify-center gap-6">
          <div class="flex items-center flex-col">
            <div class="mb-2 text-xs tracking-wide">Apply</div>
            <Button
              class="w-12 h-11"
              variant="outline"
              @click="onApplyFilters()"
            >
              <IconFilter class="!size-5" />
            </Button>
          </div>
          <div class="flex items-center flex-col">
            <div class="mb-2 text-xs tracking-wide">Reset</div>
            <Button class="w-12 h-11" variant="outline">
              <IconRotate class="!size-5" />
            </Button>
          </div>
          <div class="flex items-center flex-col">
            <div class="mb-2 text-xs tracking-wide">Expand</div>
            <Button
              class="w-12 h-11"
              variant="outline"
              @click="isExpanded = !isExpanded"
            >
              <IconChevronUp v-if="isExpanded" class="!size-5" />
              <IconChevronDown v-else class="!size-5" />
            </Button>
          </div>
        </div>
        <div class="col-span-1 flex items-center flex-col"></div>
      </div>
      <div
        class="grid grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-6 mt-4"
      >
        <template v-if="isLoading">
          <div v-for="i in 12" :key="i" class="col-span-1">
            <div class="flex flex-col space-y-2">
              <Skeleton class="h-[250px] w-full rounded-xl" />
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
              <div class="text-white text-2xl font-bold mt-3">
                Data is Empty
              </div>
              <div
                v-if="intervalError.status"
                class="text-gray-50/50 font-light tracking-wide text-sm"
              >
                Please try again in 3 seconds
              </div>
              <Button
                class="mt-2"
                :disabled="intervalError.status"
                @click="fetchAgain()"
                >Try Again</Button
              >
            </div>
          </div>
        </template>
        <template v-else>
          <div
            v-for="manga in mangaList"
            :key="manga.mal_id"
            class="col-span-1"
          >
            <MainMangaCard :manga="manga" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  IconX,
  IconCalendar,
  IconFilter,
  IconRotate,
  IconChevronUp,
  IconChevronDown,
  IconCommand,
} from "@tabler/icons-vue";
import type { TBaseResponse } from "~/types/jikanBaseManga.type";
import type {
  TMangaFilterParams,
  TMangaGenreResponse,
  TMangaResponse,
} from "~/types/jikanManga.type";
import { cn } from "@/lib/utils";
import {
  DateFormatter,
  getLocalTimeZone,
  type DateValue,
} from "@internationalized/date";
import dayjs from "dayjs";
import { useEventListener } from "@vueuse/core";

type GenreReponse = TBaseResponse<TMangaGenreResponse[]>;
const config = useRuntimeConfig();

useHead({
  title: `Search`,
  meta: [{ name: "description", content: "My amazing site." }],
});

const comicStore = useComicStore();
const isExpanded = ref(false);
const hasReachedBottom = ref(false);
const pagination = reactive({
  limit: 24,
  page: 1,
});
const isLoading = ref(false);
const isLoadingScroll = ref(false);
const mangaList = ref<TMangaResponse[]>([]);
const filters = reactive<{
  search: string;
  type: string;
  status: string;
  genre: any[];
  sort: string;
  min_score: string;
  max_score: string;
  start_date: DateValue | any;
  end_date: DateValue | any;
}>({
  search: "",
  type: "",
  status: "",
  genre: [],
  sort: "asc",
  min_score: "",
  max_score: "",
  start_date: undefined,
  end_date: undefined,
});

const intervalError = reactive({
  status: false,
  second: 3,
});

const df = new DateFormatter("en-US", {
  dateStyle: "long",
});

const {
  data: genreData,
  pending: genrePending,
  error: genreError,
} = useBaseFetch<GenreReponse>(`${config.public.apiJikan}/genres/manga`);

const optionGenre = computed(() => {
  if (genreError.value) {
    return [];
  }
  return (
    genreData.value?.data?.map((genre) => {
      return {
        label: genre.name,
        value: genre.mal_id,
      };
    }) || []
  );
});

const optionTypes = [
  {
    value: "manga",
    label: "Manga",
  },
  {
    value: "novel",
    label: "Novel",
  },
  {
    value: "lightnovel",
    label: "Light Novel",
  },
  {
    value: "oneshot",
    label: "Oneshot",
  },
  {
    value: "doujin",
    label: "Doujin",
  },
  {
    value: "manhwa",
    label: "Manhwa",
  },
  {
    value: "manhua",
    label: "Manhua",
  },
];

const optionStatus = [
  {
    value: "publishing",
    label: "Publishing",
  },
  {
    value: "complete",
    label: "Complete",
  },
  {
    value: "hiatus",
    label: "Hiatus",
  },
  {
    value: "discontinued",
    label: "Discontinued",
  },
  {
    value: "upcoming",
    label: "Upcoming",
  },
];

const optionSorts = [
  {
    value: "asc",
    label: "Ascending",
  },
  {
    value: "desc",
    label: "Descending",
  },
];

const { fetchMangas, error } = useJikanManga();

const formatDate = (date: DateValue) => {
  if (!date) return null;
  return dayjs(date.toDate(getLocalTimeZone())).format("YYYY-MM-DD");
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

const onApplyFilters = async (isScrolling = false) => {
  if (isScrolling) {
    isLoadingScroll.value = true;
  } else {
    isLoading.value = true;
  }
  const start_date = formatDate(filters.start_date);
  const end_date = formatDate(filters.end_date);
  const pageValue = isLoadingScroll.value ? pagination.page : 1;

  const payloadFilter = {
    page: pageValue,
    limit: pagination.limit,
    order_by: "popularity",
    q: filters.search,
    type: filters.type,
    status: filters.status,
    sort: filters.sort,
    min_score: filters.min_score,
    max_score: filters.max_score,
    start_date,
    end_date,
    genres: filters.genre,
  } as TMangaFilterParams;

  const data = await fetchMangas(payloadFilter);

  if (!isScrolling) {
    mangaList.value = data;
    isLoading.value = false;
  } else {
    mangaList.value = [...mangaList.value, ...data];
    isLoadingScroll.value = false;
  }
};

const fetchAgain = async () => {
  hasReachedBottom.value = false;
  pagination.page = 1;
  await onApplyFilters();
};

useEventListener(window, "scroll", async () => {
  const scrollTop = window.scrollY;
  const windowHeight = window.innerHeight;
  const fullHeight = document.documentElement.scrollHeight;

  const isBottom = scrollTop + windowHeight >= fullHeight - 10;

  if (isBottom && !hasReachedBottom.value && !isLoading.value) {
    hasReachedBottom.value = true;

    pagination.page += 1;

    await onApplyFilters(true);
  } else if (!isBottom) {
    hasReachedBottom.value = false;
  }
});

onMounted(async () => {
  comicStore.setPageSearch(false);

  await onApplyFilters();

  handleIntervalError();
});
</script>

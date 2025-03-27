<template>
  <div class="grid grid-cols-12 justify-center gap-4">
    <div class="col-start-3 col-span-8">
      <div class="grid grid-cols-12 gap-x-3 gap-y-4">
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
        <div class="col-span-3">
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
        <div class="col-span-4">
          <div class="grid grid-cols-2 gap-3">
            <div class="col-span-1">
              <div class="mb-2 font-bold tracking-wide px-1">Min Score</div>
              <div class="relative w-full max-w-sm items-center">
                <Input type="text" placeholder="e.g 10" class="pr-6" />
                <span
                  class="absolute end-0 inset-y-0 flex items-center justify-center px-2"
                >
                  <IconX class="size-4 text-muted-foreground" />
                </span>
              </div>
            </div>
            <div class="col-span-1">
              <div class="mb-2 font-bold tracking-wide px-1">Max Score</div>
              <div class="relative w-full max-w-sm items-center">
                <Input type="text" placeholder="e.g 10" class="pr-6" />
                <span
                  class="absolute end-0 inset-y-0 flex items-center justify-center px-2"
                >
                  <IconX class="size-4 text-muted-foreground" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-span-5">
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
        <div class="col-span-3 flex items-end justify-center gap-5">
          <div class="flex items-center flex-col">
            <div class="mb-2 text-xs tracking-wide">Applies</div>
            <Button class="w-12 h-11" variant="outline">
              <IconFilter class="!size-5" />
            </Button>
          </div>
          <div class="flex items-center flex-col">
            <div class="mb-2 text-xs tracking-wide">Resets</div>
            <Button class="w-12 h-11" variant="outline">
              <IconRotate class="!size-5" />
            </Button>
          </div>
          <div class="flex items-center flex-col">
            <div class="mb-2 text-xs tracking-wide">Expand</div>
            <Button class="w-12 h-11" variant="outline">
              <IconChevronUp class="!size-5" />
            </Button>
          </div>
        </div>
        <div class="col-span-1 flex items-center flex-col"></div>
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
} from "@tabler/icons-vue";
import type { TBaseResponse } from "~/types/jikanBaseManga.type";
import type { TMangaGenreResponse } from "~/types/jikanManga.type";
import { cn } from "@/lib/utils";
import {
  DateFormatter,
  getLocalTimeZone,
  type DateValue,
} from "@internationalized/date";

type GenreReponse = TBaseResponse<TMangaGenreResponse[]>;
const config = useRuntimeConfig();

useHead({
  title: `Search`,
  meta: [{ name: "description", content: "My amazing site." }],
});

const filters = reactive<{
  type: string;
  status: string;
  genre: any[];
  sort: string;
  start_date: DateValue | any;
  end_date: DateValue | any;
}>({
  type: "",
  status: "",
  genre: [],
  sort: "asc",
  start_date: undefined,
  end_date: undefined,
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
        value: genre.mal_id.toString(),
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
</script>

<template>
  <div class="grid grid-cols-12 justify-center gap-4">
    <div class="col-start-3 col-span-8">
      <div class="grid grid-cols-4 gap-3">
        <div class="col-span-1">
          <div class="mb-2 font-bold text-lg tracking-wide px-1">Type</div>
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
                      'text-white': filters.sort != '',
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
        <div class="col-span-1">
          <div class="mb-2 font-bold text-lg tracking-wide px-1">Status</div>
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
                      'text-white': filters.sort != '',
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
        <div class="col-span-1">
          <div class="mb-2 font-bold text-lg tracking-wide px-1">Genres</div>
          <MultiSelect
            v-model="filters.genre"
            :options="optionGenre"
            :disabled="genrePending"
            placeholder="Select Genres"
          />
        </div>
        <div class="col-span-1">
          <div class="mb-2 font-bold text-lg tracking-wide px-1">Sorting</div>
          <div class="flex items-center gap-2">
            <div class="basis-[100%]">
              <Select v-model="filters.sort">
                <SelectTrigger class="w-full h-11 text-[14px]">
                  <SelectValue
                    :class="{
                      'text-muted-foreground': filters.sort == '',
                      'text-white': filters.sort != '',
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconX } from "@tabler/icons-vue";
import type { TBaseResponse } from "~/types/jikanBaseManga.type";
import type { TMangaGenreResponse } from "~/types/jikanManga.type";

type GenreReponse = TBaseResponse<TMangaGenreResponse[]>;
const config = useRuntimeConfig();

useHead({
  title: `Search`,
  meta: [{ name: "description", content: "My amazing site." }],
});

const filters = reactive({
  type: "",
  status: "",
  genre: [],
  sort: "asc",
});

const { data: genreData, pending: genrePending } = useBaseFetch<GenreReponse>(
  `${config.public.apiJikan}/genres/manga`
);

const optionGenre = computed(() => {
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

<template>
  <div
    class="absolute top-10 left-0 w-full border border-gray-50/20 mt-2 bg-gray-950 rounded-md"
  >
    <div class="grid grid-cols-1">
      <template v-if="isLoading">
        <div class="grid grid-rows-5 gap-3 col-span-1 px-2 py-2">
          <div v-for="i in 5" :key="i" class="row-span-1">
            <div class="flex flex-row space-x-3">
              <Skeleton class="h-[60px] w-[20%] rounded-mf" />
              <div class="space-y-2 w-full flex flex-col justify-center">
                <Skeleton class="h-3 w-[85%]" />
                <Skeleton class="h-3 w-[70%]" />
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="error">
        <div class="col-span-1">{{ error }}</div>
      </template>
      <template v-else>
        <template v-if="mangaList.length === 0">
          <div class="col-span-1">
            <div
              class="px-4 py-4 flex flex-col items-center gap-2 text-white/50"
            >
              <IconCircleOff class="size-5" />
              <div class="text-[12px]">No Data Found</div>
            </div>
          </div>
        </template>
        <div
          v-for="(manga, i) in mangaList"
          :key="manga.mal_id"
          class="col-span-1"
          @mouseenter="setHover(i + 1)"
        >
          <SearchMangaCard
            :manga="manga"
            :index="i + 1"
            :selected-index="searchIndex"
          />
        </div>
        <div class="col-span-1">
          <div class="w-full rounded-md p-2 flex items-center justify-between">
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
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  IconX,
  IconKeyboardFilled,
  IconLogin2,
  IconCircleOff,
} from "@tabler/icons-vue";
import type { TMangaResponse } from "~/types/jikanManga.type";

defineProps<{
  isLoading: boolean;
  error: any;
  mangaList: TMangaResponse[];
  searchIndex: number;
}>();

const emit = defineEmits<{
  (e: "setHover", payload: number): void;
}>();

const setHover = (index: number) => {
  emit("setHover", index);
};
</script>

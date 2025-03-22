<template>
  <template v-if="!error">
    <template v-if="isLoading">
      <Skeleton class="h-[40px] w-[75%] rounded" />
    </template>
    <template v-else>
      <div class="font-semibold text-3xl text-white">
        {{ comic?.title }}
      </div>
    </template>

    <template v-if="isLoading">
      <div class="flex flex-row space-x-3 items-center">
        <Skeleton class="h-[30px] w-[110px] rounded" />
        <Skeleton class="h-[30px] w-[90px] rounded" />
        <Skeleton class="h-[30px] w-[80px] rounded" />
        <Skeleton class="h-[30px] w-[100px] rounded" />
      </div>
    </template>
    <template v-else>
      <div class="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          @click="openExternalURL(comic?.url || '')"
        >
          <IconEye class="w-3 h-3" />
          <span> More info </span>
        </Button>
        <Button size="sm" variant="outline">
          <IconBookmark class="w-3 h-3" />
          <span>Bookmark</span>
        </Button>
        <Button size="sm" variant="outline" class="cursor-text">
          <IconStar class="w-3 h-3" />
          <span>{{ comic?.score || 0 }}</span>
        </Button>
        <Button size="sm" variant="outline" class="cursor-text">
          <span>Rank</span>
          <span>#{{ comic?.rank || "?" }}</span>
        </Button>
        <Button size="sm" variant="outline" class="cursor-text">
          <IconUsersGroup class="w-3 h-3" />
          <span>{{ formatNumber(comic?.scored_by || 0) }}</span>
        </Button>
      </div>
    </template>

    <div class="grid grid-cols-13 gap-6">
      <div class="col-span-4">
        <template v-if="isLoading">
          <Skeleton class="h-[250px] w-full rounded" />
        </template>
        <template v-else>
          <NuxtImg
            v-if="comic?.images.webp.image_url"
            :src="comic?.images.webp.image_url"
            :alt="comic.title"
            class="w-full object-cover"
            placeholder="/images/fallback-image.png"
          />
        </template>
      </div>
      <div class="col-span-9">
        <template v-if="isLoading">
          <div class="flex flex-col gap-3">
            <Skeleton class="h-[20px] w-[60%] rounded" />
            <Skeleton class="h-[20px] w-[50%] rounded" />
            <Skeleton class="h-[20px] w-[55%] rounded" />
            <Skeleton class="h-[20px] w-[45%] rounded" />
            <Skeleton class="h-[20px] w-[35%] rounded" />
            <Skeleton class="h-[20px] w-[50%] rounded" />
          </div>
        </template>
        <template v-else>
          <div class="flex flex-col gap-2">
            <div>
              <span>Alt Title: </span>
              <span class="text-sm text-gray-400 ml-1">
                {{ comic?.title_japanese }}
              </span>
            </div>
            <div v-if="comic?.type">
              <span>Type: </span>
              <span
                class="text-sm text-blue-500 cursor-pointer hover:underline ml-1"
              >
                {{ comic?.type }}
              </span>
            </div>
            <div>
              <span>Volume: </span>
              <span class="text-sm text-gray-400 ml-1">
                <span v-if="comic?.volumes">
                  {{ comic?.volumes }}
                  <span class="text-xs">Volume</span>
                </span>
                <span v-else> Unknown </span>
              </span>
            </div>
            <div>
              <span>Chapter: </span>
              <span class="text-sm text-gray-400 ml-1">
                <span v-if="comic?.chapters">
                  {{ comic?.chapters }}
                  <span class="text-xs">Chapter</span>
                </span>
                <span v-else> Unknown </span>
              </span>
            </div>
            <div>
              <span>Status: </span>
              <span class="text-sm text-gray-400 ml-1">
                <span v-if="comic?.status">
                  {{ comic?.status }}
                </span>
                <span v-else> Unknown </span>
              </span>
            </div>
            <div>
              <span>Published: </span>
              <span class="text-sm text-gray-400 ml-1">
                {{ formatDate(comic?.published.from || "") }}
              </span>
            </div>
            <div>
              <span>Demographic: </span>
              <span
                v-if="comic?.demographics && comic.demographics.length > 0"
                class="text-sm text-blue-500 cursor-pointer hover:underline ml-1"
              >
                <span>{{
                  comic?.demographics.map((d) => d.name).join(", ")
                }}</span>
              </span>
              <span v-else class="text-sm text-gray-400 ml-1"> Unknown </span>
            </div>
          </div>
        </template>
      </div>
    </div>
    <template v-if="isLoading">
      <div class="flex flex-row gap-3">
        <Skeleton class="h-[30px] w-[50%] rounded" />
        <Skeleton class="h-[30px] w-[50%] rounded" />
      </div>
    </template>
    <template v-else>
      <div :class="getClassGrid()">
        <div
          v-for="author in getAuthorsDetail"
          :key="author.mal_id"
          class="col-span-1"
        >
          <div
            class="text-[13px] hover:text-blue-500 hover:underline rounded border border-input px-2 py-2 text-white cursor-pointer flex items-center justify-center gap-2"
            @click="openExternalURL(author?.url || '')"
          >
            <IconExternalLink class="w-3.5 h-3.5" />
            <div>
              {{ author.name }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </template>
  <template v-else> Error: {{ error }} </template>
</template>

<script setup lang="ts">
import {
  IconBookmark,
  IconEye,
  IconStar,
  IconUsersGroup,
  IconExternalLink,
} from "@tabler/icons-vue";
import { useDateFormat } from "@vueuse/core";
import clsx from "clsx";
import type { TMangaResponse } from "~/types/jikanManga.type";

const props = defineProps<{
  isLoading: boolean;
  error: string;
  comic: TMangaResponse | null;
}>();

const getAuthorsDetail = computed(() => {
  const combinedArray = [
    ...(props.comic?.authors || []),
    ...(props.comic?.serializations || []),
  ];

  return combinedArray;
});

const getClassGrid = () => {
  const gridClass = clsx("grid gap-2", {
    "grid-cols-1": getAuthorsDetail.value.length === 1,
    "grid-cols-2": getAuthorsDetail.value.length === 2,
    "grid-cols-3": getAuthorsDetail.value.length === 3,
    "grid-cols-4": getAuthorsDetail.value.length === 4,
    "grid-cols-5": getAuthorsDetail.value.length >= 5,
  });

  return gridClass;
};

const openExternalURL = (url: string) => {
  window.open(url, "_blank");
};

const formatNumber = (num: number): string => {
  return num.toLocaleString("en-US");
};

const formatDate = (date: string, format = "MMM DD, YYYY") => {
  return useDateFormat(date, format);
};
</script>

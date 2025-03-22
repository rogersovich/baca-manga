<template>
  <div
    class="w-full bg-gray-950 border border-gray-50/10 rounded-md grid grid-cols-13 gap-4 cursor-pointer group"
    :style="{
      transform: hoverState ? 'translateX(10px)' : 'none',
      transition: 'transform 0.2s ease',
    }"
    @mouseenter="setHover(true)"
    @mouseleave="setHover(false)"
    @click="goToDetail"
  >
    <div class="col-span-3 relative">
      <img
        :src="manga.images.webp.image_url"
        class="rounded-md w-full h-[100px] xl:h-[125px] 2xl:h-[150px] object-cover"
        @error="handleImageError"
      />
      <div v-if="hoverState" class="container-eye-card">
        <IconEye class="w-8 h-8 text-white" />
      </div>
    </div>
    <div class="col-span-10">
      <div class="flex items-center gap-2 w-full mt-3 px-1">
        <div>
          <div class="h-2 w-2 rounded-full" :class="getBgStatusClass()"></div>
        </div>
        <div
          class="text-[13px] text-white font-bold"
          :class="getHoverBgClass()"
        >
          #{{ manga.rank }}
        </div>
        <div
          class="text-[13px] font-semibold text-white truncate cursor-pointer"
          :class="getHoverBgClass()"
        >
          {{ manga.title }}
        </div>
      </div>
      <div
        v-if="manga.synopsis"
        class="text-[12px] text-gray-50/50 line-clamp-2 mt-2"
      >
        {{ manga.synopsis }}
      </div>
      <div class="flex items-center gap-2 mt-2">
        <div class="text-[10px] rounded bg-gray-900 px-1 py-0.5 text-white/50">
          Manga
        </div>
        <div class="text-[10px] rounded bg-gray-900 px-1 py-0.5 text-white/50">
          {{ manga.published.prop?.from?.year }}
        </div>
        <div
          v-if="manga.chapters"
          class="text-[10px] rounded bg-gray-900 px-1 py-0.5 flex items-center gap-1"
        >
          <span> Ch. </span>
          <span>
            {{ manga.chapters }}
          </span>
        </div>
        <div
          class="text-[10px] rounded bg-gray-900 px-1 py-0.5 flex items-center gap-1"
        >
          <IconStar class="w-3 h-3 text-white/50" />
          <span class="text-white/50">
            {{ manga.score }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconStar, IconEye } from "@tabler/icons-vue";
import type { TMangaResponse } from "~/types/jikanManga.type";
import { handleImageError } from "~/utils/fallbackImage";

const props = defineProps<{
  manga: TMangaResponse;
}>();

const hoverState = ref(false);

const setHover = (value: boolean) => {
  hoverState.value = value;
};

const getBgStatusClass = () => {
  switch (props.manga.status) {
    case "Finished":
      return "bg-green-500";
    case "Discontinued":
      return "bg-red-500";
    case "On Hiatus":
      return "bg-purple-500";
    case "Publishing":
      return "bg-blue-500";
    case "Not yet published":
      return "bg-gray-500";
    default:
      return "bg-gray-300";
  }
};

const getHoverBgClass = () => {
  switch (props.manga.status) {
    case "Finished":
      return "group-hover:text-green-400";
    case "Discontinued":
      return "group-hover:text-red-400";
    case "On Hiatus":
      return "group-hover:text-purple-400";
    case "Publishing":
      return "group-hover:text-blue-400";
    case "Not yet published":
      return "group-hover:text-gray-400";
    default:
      return "";
  }
};

const goToDetail = () => {
  const slug = titleToSlug(props.manga.title);
  const id = props.manga.mal_id;
  const url = `/${slug}/${id}`;
  navigateTo(url);
};
</script>

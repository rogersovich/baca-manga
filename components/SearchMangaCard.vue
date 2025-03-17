<template>
  <div
    class="w-full bg-gray-950 rounded-md grid grid-cols-12 gap-2 cursor-pointer px-2 py-2"
    :class="{
      'border border-blue-500': index == selectedIndex || hoverState,
    }"
    @mouseenter="setHover(true)"
    @mouseleave="setHover(false)"
    @click="goToDetail"
  >
    <div
      class="col-span-2 relative"
      :style="{
        transform: hoverState ? 'translateX(5px)' : 'none',
        transition: 'transform 0.2s ease',
      }"
    >
      <img
        :src="getFullImageUrl(manga)"
        class="rounded w-full h-[60px] object-cover"
        @error="handleImageError"
      />
      <div v-if="hoverState" class="container-eye-card">
        <IconEye class="w-5 h-5 text-white" />
      </div>
    </div>
    <div
      class="col-span-10"
      :style="{
        transform: hoverState ? 'translateX(5px)' : 'none',
        transition: 'transform 0.2s ease',
      }"
    >
      <div class="flex items-center gap-2 w-full mt-3 px-1">
        <div>
          <div
            :class="{
              'h-2 w-2 rounded-full': true,
              'bg-green-500': manga.attributes.status === 'completed',
              'bg-orange-500': manga.attributes.status !== 'completed',
            }"
          ></div>
        </div>
        <div
          class="text-[13px] font-semibold text-white truncate cursor-pointer"
          :class="{
            'hover:text-green-400': manga.attributes.status === 'completed',
            'hover:text-orange-500': manga.attributes.status !== 'completed',
          }"
        >
          {{ manga.attributes.title.en }}
        </div>
      </div>
      <div class="flex items-center gap-2 mt-2">
        <div class="text-[10px] rounded bg-gray-900 px-1 py-0.5 text-white/50">
          Manga
        </div>
        <div
          v-if="manga.attributes.year"
          class="text-[10px] rounded bg-gray-900 px-1 py-0.5 text-white/50"
        >
          {{ manga.attributes.year }}
        </div>
        <div
          class="text-[10px] rounded bg-gray-900 px-1 py-0.5 flex items-center gap-1"
        >
          <IconStar class="w-3 h-3 text-white/50" />
          <span class="text-white/50">
            {{ getRatingManga() }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MangaData } from "~/types/manga";
import { IconStar, IconEye } from "@tabler/icons-vue";
import { handleImageError } from "~/utils/fallbackImage";

const props = defineProps<{
  manga: MangaData;
  statistic: any;
  index: any;
  selectedIndex: any;
}>();

const baseUrlImage = ref("https://mangadex.org/covers");
const hoverState = ref(false);

const setHover = (value: boolean) => {
  hoverState.value = value;
};

const getFileName = (manga: MangaData) => {
  const coverArt = manga.relationships.find(
    (item) => item.type === "cover_art"
  );
  return coverArt?.attributes?.fileName || null;
};

const getFullImageUrl = (manga: MangaData) => {
  const fileName = getFileName(manga);
  return `${baseUrlImage.value}/${manga.id}/${fileName}.256.jpg`;
};

const getRatingManga = () => {
  if (props.statistic) {
    return Math.round(props.statistic?.rating.average * 10) / 10;
  } else {
    return 0;
  }
};

const goToDetail = () => {
  navigateTo(`/${props.manga.id}`);
};
</script>

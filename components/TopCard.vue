<template>
  <div
    class="w-full bg-gray-950 border border-gray-50/10 rounded-md grid grid-cols-13 gap-4 cursor-pointer group"
    :style="{
      transform: hoverState ? 'translateX(10px)' : 'none',
      transition: 'transform 0.2s ease',
    }"
    @mouseenter="setHover(true)"
    @mouseleave="setHover(false)"
  >
    <div class="col-span-3 relative">
      <img
        :src="getFullImageUrl(manga)"
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
            'group-hover:text-green-400':
              manga.attributes.status === 'completed',
            'group-hover:text-orange-500':
              manga.attributes.status !== 'completed',
          }"
        >
          {{ manga.attributes.title.en }}
        </div>
      </div>
      <div
        v-if="manga.attributes.description?.en"
        class="text-[12px] text-gray-50/50 line-clamp-2 mt-2"
      >
        {{ manga.attributes.description?.en }}
      </div>
      <div class="flex items-center gap-2 mt-2">
        <div class="text-[10px] rounded bg-gray-900 px-1 py-0.5 text-white/50">
          Manga
        </div>
        <div class="text-[10px] rounded bg-gray-900 px-1 py-0.5 text-white/50">
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
</script>

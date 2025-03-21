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
      <NuxtImg
        :src="manga.images.webp.image_url"
        :alt="manga.title"
        class="rounded w-full h-[60px] object-cover"
        placeholder="/images/fallback-image.png"
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
            class="h-2 w-2 rounded-full"
            :class="getBgStatusClass(manga.status)"
          ></div>
        </div>
        <div
          class="text-[13px] font-semibold text-white truncate cursor-pointer"
          :class="getHoverBgStatusClass(manga.status, 'hover')"
        >
          {{ manga.title }}
        </div>
      </div>
      <div class="flex items-center gap-2 mt-2">
        <div class="text-[10px] rounded bg-gray-900 px-1 py-0.5 text-white/50">
          {{ manga.type }}
        </div>
        <div
          v-if="manga.published.prop?.from?.year"
          class="text-[10px] rounded bg-gray-900 px-1 py-0.5 text-white/50"
        >
          {{ manga.published.prop?.from?.year }}
        </div>
        <div
          v-if="manga.chapters"
          class="text-[10px] rounded bg-gray-900 px-1 py-0.5 flex items-center gap-1 text-white/50"
        >
          <span> Ch. </span>
          <span>
            {{ manga.chapters }}
          </span>
        </div>
        <div
          v-if="manga.score"
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

const props = defineProps<{
  manga: TMangaResponse;
  index: any;
  selectedIndex: any;
}>();

const searchStore = useSearchStore();

const hoverState = ref(false);

const setHover = (value: boolean) => {
  hoverState.value = value;
};

const goToDetail = () => {
  searchStore.setMalId(props.manga.mal_id);
};
</script>

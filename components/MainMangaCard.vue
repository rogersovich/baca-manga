<template>
  <div class="cursor-pointer group" @click="goToDetail">
    <div
      class="relative hover:cursor-pointer"
      :style="{
        transform: hoverState ? 'translateY(-10px)' : 'none',
        transition: 'transform 0.2s ease',
      }"
      @mouseenter="setHover(true)"
      @mouseleave="setHover(false)"
    >
      <NuxtImg
        :src="manga.images.webp.image_url"
        :alt="manga.title"
        class="rounded-md h-[200px] 2xl:h-[275px] w-full object-cover"
        placeholder="/images/fallback-image.png"
      />

      <div v-if="hoverState" class="container-eye-card">
        <IconEye class="w-10 h-10 text-white" />
      </div>
    </div>
    <div>
      <div class="flex items-center gap-2 w-full mt-3 px-1">
        <div>
          <div
            :class="{
              'h-2 w-2 rounded-full': true,
              'bg-green-500': manga.status === 'Finished',
              'bg-red-500': manga.status === 'Discontinued',
              'bg-purple-500': manga.status === 'On Hiatus',
              'bg-blue-500': manga.status === 'Publishing',
              'bg-gray-500': manga.status === 'Not yet published',
            }"
          ></div>
        </div>
        <div
          class="text-[13px] font-semibold text-white truncate cursor-pointer"
          :class="{
            'group-hover:text-green-400': manga.status === 'Finished',
            'group-hover:text-red-400': manga.status === 'Discontinued',
            'group-hover:text-purple-400': manga.status === 'On Hiatus',
            'group-hover:text-blue-400': manga.status === 'Publishing',
            'group-hover:text-gray-400': manga.status === 'Not yet published',
          }"
        >
          {{ manga.title }}
        </div>
      </div>
      <div class="flex items-center gap-1 mt-2">
        <div class="text-[10px] rounded bg-gray-900 px-1 py-0.5">
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
          v-if="manga.score"
          class="text-[10px] rounded bg-gray-900 px-1 py-0.5 flex items-center gap-1"
        >
          <IconStar class="w-3 h-3" />
          <span>
            {{ manga.score }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from "vue";
import { IconEye, IconStar } from "@tabler/icons-vue";
import type { TMangaResponse } from "~/types/jikanManga.type";

const props = defineProps<{
  manga: TMangaResponse;
}>();

const hoverState = ref(false);

const setHover = (value: boolean) => {
  hoverState.value = value;
};

const goToDetail = () => {
  navigateTo(`/${props.manga.mal_id}`);
};
</script>

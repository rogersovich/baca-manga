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
        :src="getFullImageUrl(imageFileName)"
        alt="Image is here"
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
      <div class="flex items-center gap-2 mt-2">
        <div class="text-[10px] rounded bg-gray-900 px-1 py-0.5">
          {{ manga.attributes.year }}
        </div>
        <div
          v-if="manga.attributes.lastChapter"
          class="text-[10px] rounded bg-gray-900 px-1 py-0.5 flex items-center gap-1"
        >
          <span> Chapter </span>
          <span>
            {{ manga.attributes.lastChapter }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps } from "vue";
import { IconEye } from "@tabler/icons-vue";
import type { MangaData } from "@/types/manga";

const props = defineProps<{
  manga: MangaData;
}>();

const hoverState = ref(false);
const baseUrlImage = ref("https://mangadex.org/covers");

const imageFileName = computed(() => {
  const coverArt = props.manga?.relationships.find(
    (item) => item.type === "cover_art"
  );
  return coverArt?.attributes?.fileName || null;
});

const getFullImageUrl = (fileName: string) => {
  return `${baseUrlImage.value}/${props.manga.id}/${fileName}.256.jpg`;
};

const setHover = (value: boolean) => {
  hoverState.value = value;
};

const goToDetail = () => {
  console.log(props.manga.id);
};
</script>

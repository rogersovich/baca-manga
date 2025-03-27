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
        class="rounded-md h-[230px] sm:h-[275px] md:h-[200px] lg:h-[230px] 2xl:h-[275px] w-full object-cover"
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
            class="h-2 w-2 rounded-full"
            :class="getBgStatusClass(manga.status)"
          ></div>
        </div>
        <div
          class="text-[13px] font-semibold text-white truncate cursor-pointer"
          :class="getHoverBgClass(manga.status)"
        >
          {{ manga.title }}
        </div>
      </div>
      <div class="flex items-center gap-1 mt-2">
        <div
          v-if="manga.published.prop?.from?.year"
          class="text-[10px] rounded bg-gray-900 px-1 py-0.5"
        >
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
const loading = useLoadingIndicator();
const route = useRoute();
const comicStore = useComicStore();

const setHover = (value: boolean) => {
  hoverState.value = value;
};

const getBgStatusClass = (status: any) => {
  switch (status) {
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

const getHoverBgClass = (status: any) => {
  switch (status) {
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

const goToDetail = async () => {
  const slug = titleToSlug(props.manga.title);
  const id = props.manga.mal_id;
  const url = `/${slug}/${id}`;

  loading.start();

  await waitForSeconds(500);

  if (route.path == "/search") {
    comicStore.setPageSearch(true);
  }

  await navigateTo(url);
};
</script>

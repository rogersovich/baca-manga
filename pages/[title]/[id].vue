<template>
  <div class="grid grid-cols-12 justify-center gap-4">
    <div class="col-start-4 col-span-6">
      <NuxtLink to="/">
        <Button size="sm" variant="ghost">
          <IconArrowLeft class="w-3 h-3" />
          <span>Back</span>
        </Button>
      </NuxtLink>
    </div>
    <div class="col-start-4 col-span-6 border border-gray-50/10 rounded-md">
      <template v-if="isLoading"> Loading... </template>
      <template v-else-if="error"> Error {{ error }} </template>
      <template v-else>
        <div class="relative">
          <NuxtImg
            :src="
              comic?.images.webp.large_image_url || comic?.images.webp.image_url
            "
            :alt="comic?.title"
            class="h-[200px] w-full object-cover object-center rounded-t-md"
            placeholder="/images/fallback-image.png"
          />
          <div class="absolute bottom-0 inset-0 back-drop-cuk"></div>
        </div>
        <div class="px-4 py-6">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12">
              <div class="flex flex-col gap-6">
                <div class="font-semibold text-3xl text-white">
                  {{ comic?.title }}
                </div>

                <div class="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    @click="openExternalURL(comic?.url || '')"
                  >
                    <IconEye class="w-3 h-3" />
                    <span> Read a Comic </span>
                  </Button>
                  <Button size="sm" variant="outline">
                    <IconBookmark class="w-3 h-3" />
                    <span>Bookmark</span>
                  </Button>
                  <Button size="sm" variant="outline" class="cursor-text">
                    <IconStar class="w-3 h-3" />
                    <span>{{ comic?.score }}</span>
                  </Button>
                  <Button size="sm" variant="outline" class="cursor-text">
                    <span>Rank</span>
                    <span>#{{ comic?.rank }}</span>
                  </Button>
                  <Button size="sm" variant="outline" class="cursor-text">
                    <IconUsersGroup class="w-3 h-3" />
                    <span>{{ formatNumber(comic?.scored_by || 0) }}</span>
                  </Button>
                </div>

                <div class="grid grid-cols-13 gap-6">
                  <div class="col-span-4">
                    <NuxtImg
                      v-if="comic?.images.webp.image_url"
                      :src="comic?.images.webp.image_url"
                      :alt="comic.title"
                      class="w-full object-cover"
                      placeholder="/images/fallback-image.png"
                    />
                  </div>
                  <div class="col-span-9">
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
                          v-if="
                            comic?.demographics && comic.demographics.length > 0
                          "
                          class="text-sm text-blue-500 cursor-pointer hover:underline ml-1"
                        >
                          <span>{{
                            comic?.demographics.map((d) => d.name).join(", ")
                          }}</span>
                        </span>
                        <span v-else class="text-sm text-gray-400 ml-1">
                          Unknown
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

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

                <div>
                  <div class="font-semibold text-lg mb-2">Sinopsis</div>
                  <div
                    class="text-gray-50/50 text-sm whitespace-pre-line"
                    v-html="comic?.synopsis"
                  ></div>
                </div>

                <template v-if="comic?.genres">
                  <div>
                    <div class="font-semibold text-lg text-white mb-2">
                      Genres
                    </div>
                    <div class="flex flex-wrap gap-3">
                      <div
                        v-for="genre in comic?.genres"
                        :key="genre.mal_id"
                        class="text-[14px] rounded bg-gray-50/10 px-2 py-1 text-white/90 cursor-pointer"
                      >
                        <div>
                          {{ genre.name }}
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-if="comic?.themes">
                  <div>
                    <div class="font-semibold text-lg text-white mb-2">
                      Themes
                    </div>
                    <div class="flex flex-wrap gap-3">
                      <div
                        v-for="theme in comic?.themes"
                        :key="theme.mal_id"
                        class="text-[14px] rounded bg-gray-50/10 px-2 py-1 text-white/90 cursor-pointer"
                      >
                        <div>
                          {{ theme.name }}
                        </div>
                      </div>
                    </div>
                  </div>
                </template>

                <div>
                  <div class="font-semibold text-lg mb-2">Daftar Chapters</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  IconBookmark,
  IconEye,
  IconStar,
  IconUsersGroup,
  IconExternalLink,
  IconArrowLeft,
} from "@tabler/icons-vue";
import { useDateFormat } from "@vueuse/core";
import clsx from "clsx";

const route = useRoute();

const title = slugToTitle(route.params.title as string);
const comic_id = +route.params.id;

useHead({
  title: `${title} - Manga`,
  meta: [{ name: "description", content: "My amazing site." }],
});

const {
  fetchMangaDetail,
  responses: comicDetail,
  isLoading,
  error,
} = useJikanMangaDetail();

const comic = computed(() => {
  return comicDetail.value?.data ?? null;
});

const openExternalURL = (url: string) => {
  window.open(url, "_blank");
};

const formatDate = (date: string, format = "MMM DD, YYYY") => {
  return useDateFormat(date, format);
};

const getAuthorsDetail = computed(() => {
  const combinedArray = [
    ...(comic.value?.authors || []),
    ...(comic.value?.serializations || []),
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

const formatNumber = (num: number): string => {
  return num.toLocaleString("en-US");
};

onMounted(async () => {
  await fetchMangaDetail(comic_id);
});
</script>

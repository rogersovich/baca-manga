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
      <div class="relative">
        <template v-if="isLoading">
          <Skeleton class="h-[200px] w-full rounded" />
        </template>
        <template v-else>
          <NuxtImg
            :src="
              comic?.images.webp.large_image_url || comic?.images.webp.image_url
            "
            :alt="comic?.title"
            class="h-[200px] w-full object-cover object-center rounded-t-md"
            placeholder="/images/fallback-image.png"
          />
          <div class="absolute bottom-0 inset-0 back-drop-cuk"></div>
        </template>
      </div>
      <div class="px-4 py-6">
        <div class="flex flex-col gap-6">
          <BiographyComic
            :comic="comic"
            :is-loading="isLoading"
            :error="error || ''"
          />

          <div>
            <div class="font-semibold text-lg mb-2">Sinopsis</div>
            <template v-if="isLoading">
              <div class="flex flex-col gap-2">
                <Skeleton class="h-[15px] w-full rounded-sm" />
                <Skeleton class="h-[15px] w-[85%] rounded-sm" />
                <Skeleton class="h-[15px] w-[75%] rounded-sm" />
              </div>
              <div class="flex flex-col gap-2 mt-5">
                <Skeleton class="h-[15px] w-full rounded-sm" />
                <Skeleton class="h-[15px] w-[85%] rounded-sm" />
                <Skeleton class="h-[15px] w-[75%] rounded-sm" />
              </div>
              <div class="flex flex-col gap-2 mt-5">
                <Skeleton class="h-[15px] w-full rounded-sm" />
                <Skeleton class="h-[15px] w-[85%] rounded-sm" />
                <Skeleton class="h-[15px] w-[75%] rounded-sm" />
              </div>
            </template>

            <template v-else>
              <div
                class="text-gray-50/50 text-sm whitespace-pre-line"
                v-html="comic?.synopsis"
              ></div>
            </template>
          </div>

          <template v-if="comic?.genres && comic?.genres.length > 0">
            <div>
              <div class="font-semibold text-lg text-white mb-2">Genres</div>
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
          <template v-if="comic?.themes && comic?.themes.length > 0">
            <div>
              <div class="font-semibold text-lg text-white mb-2">Themes</div>
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

          <ListCharacterComic
            :characters="characters?.data || []"
            :is-loading-character="isLoadingCharacter"
            :error-character="errorCharacter || ''"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconArrowLeft } from "@tabler/icons-vue";

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

const {
  responses: characters,
  fetchMangaCharacter,
  isLoading: isLoadingCharacter,
  error: errorCharacter,
} = useJikanMangaCharacter();

const comic = computed(() => {
  return comicDetail.value?.data ?? null;
});

// const openExternalURL = (url: string) => {
//   window.open(url, "_blank");
// };

// const formatDate = (date: string, format = "MMM DD, YYYY") => {
//   return useDateFormat(date, format);
// };

// const getAuthorsDetail = computed(() => {
//   const combinedArray = [
//     ...(comic.value?.authors || []),
//     ...(comic.value?.serializations || []),
//   ];

//   return combinedArray;
// });

// const getClassGrid = () => {
//   const gridClass = clsx("grid gap-2", {
//     "grid-cols-1": getAuthorsDetail.value.length === 1,
//     "grid-cols-2": getAuthorsDetail.value.length === 2,
//     "grid-cols-3": getAuthorsDetail.value.length === 3,
//     "grid-cols-4": getAuthorsDetail.value.length === 4,
//     "grid-cols-5": getAuthorsDetail.value.length >= 5,
//   });

//   return gridClass;
// };

// const formatNumber = (num: number): string => {
//   return num.toLocaleString("en-US");
// };

onMounted(async () => {
  await Promise.all([
    fetchMangaDetail(comic_id),
    fetchMangaCharacter(comic_id),
  ]);
});
</script>

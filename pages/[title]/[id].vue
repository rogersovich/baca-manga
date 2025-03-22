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
        <template v-if="isLoading || (isLoadingKitsu && !coverImg)">
          <Skeleton class="h-[250px] w-full rounded" />
        </template>
        <template v-else>
          <NuxtImg
            :src="coverImg"
            :alt="comic?.title"
            class="h-[300px] w-full object-cover object-center rounded-t-md"
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

const {
  responses: kitsuManga,
  fetchKitsuMangas,
  isLoading: isLoadingKitsu,
} = useKitsuManga();

const comic = computed(() => {
  return comicDetail.value?.data ?? null;
});

const coverImg = computed(() => {
  let image;
  if (kitsuManga.value && kitsuManga.value?.data.length > 0) {
    const manga_kitsu = kitsuManga.value?.data[0];
    const cover_img =
      manga_kitsu.attributes.coverImage?.small ||
      manga_kitsu.attributes.coverImage?.tiny;
    image = cover_img || comic.value?.images.webp.image_url;
  }
  return image;
});

onMounted(async () => {
  await Promise.all([
    fetchMangaDetail(comic_id),
    fetchMangaCharacter(comic_id),
  ]);

  await fetchKitsuMangas({
    title: title,
    limit: 1,
  });
});
</script>

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
                v-if="comic?.synopsis"
                class="text-gray-50/50 text-sm whitespace-pre-line"
                v-html="comic?.synopsis"
              ></div>
              <div class="text-gray-50/50 text-sm whitespace-pre-line">-</div>
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
          <template v-if="isLoadingChapter"> Loading chapters... </template>
          <template v-else-if="errorChapter"> Loading chapters... </template>
          <template v-else>
            <template
              v-if="mangadexChapters?.data && mangadexChapters?.data.length > 0"
            >
              <div>
                <div class="font-semibold text-lg text-white mb-3">
                  List Chapter
                </div>
                <div class="flex flex-col w-full gap-2">
                  <div
                    v-for="chapter in uniqueChapters"
                    :key="chapter.id"
                    class="flex w-full border border-gray-50/10 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-900 hover:border-blue-900 group"
                  >
                    <div class="basis-[80%]">
                      <div class="text-[16px] mb-1 group-hover:text-blue-500">
                        Chapter {{ chapter.attributes.chapter }}
                        <span v-if="chapter.attributes.title">
                          - {{ chapter.attributes.title }}
                        </span>
                      </div>
                      <div
                        class="text-xs text-gray-50/50 flex items-center gap-2"
                      >
                        <IconUserFilled class="w-3.5 h-3.5" />
                        {{
                          chapter.relationships.find(
                            (item) => item.type == "scanlation_group"
                          )?.attributes?.name
                        }}
                      </div>
                    </div>
                    <div class="basis-[20%] flex items-center justify-end">
                      <div class="text-xs text-gray-50/50">
                        {{ formatDate(chapter.attributes.createdAt || "") }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="w-full text-center mt-5">
                  <Button variant="secondary">
                    <span>More Chapters</span>
                  </Button>
                </div>
              </div>
            </template>
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
import { IconArrowLeft, IconUserFilled } from "@tabler/icons-vue";
import { useDateFormat } from "@vueuse/core";

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

const { fetchComicMangadex, responses: mangadexComics } = useMangadexManga();

const {
  fetchChapterMangadex,
  responses: mangadexChapters,
  isLoading: isLoadingChapter,
  error: errorChapter,
} = useMangadexChapter();

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

const formatDate = (date: string, format = "MMM DD, YYYY") => {
  return useDateFormat(date, format);
};

const generateChapterArray = (chapter: number): string[] => {
  return Array.from({ length: chapter }, (_, i) => (i + 1).toString());
};

const uniqueChapters = computed(() => {
  const seen = new Set();
  return mangadexChapters.value?.data
    .filter((item) => {
      const chapterNum = item.attributes.chapter;
      if (!chapterNum || seen.has(chapterNum)) return false;
      seen.add(chapterNum);
      return true;
    })
    .sort(
      (a, b) =>
        parseFloat(a.attributes.chapter) - parseFloat(b.attributes.chapter)
    )
    .slice(0, 5);
});

const normalizeJapaneseName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/ou/g, "o") // Convert 'ou' to 'o' (Kentarou -> Kentaro)
    .replace(/\s+/g, " ") // Replace multiple spaces with a single space
    .trim(); // Remove leading/trailing spaces
};

const isAuthorMatch = (relName: string, targetName: string): boolean => {
  const normalizedRel = normalizeJapaneseName(relName);
  const normalizedTarget = normalizeJapaneseName(targetName);
  return normalizedRel === normalizedTarget;
};

onMounted(async () => {
  await Promise.all([
    fetchMangaDetail(comic_id),
    fetchMangaCharacter(comic_id),
  ]);

  const getAuthorName =
    comicDetail.value?.data?.authors
      ?.filter((item) => item.type === "people")
      ?.map((item) => item.name)
      ?.shift()
      ?.replace(",", "") || "-";

  await fetchKitsuMangas({
    title: title,
    limit: 1,
  });

  await fetchComicMangadex({
    limit: 5,
    offset: 0,
    title: title,
    contentRating: ["safe", "suggestive", "erotica"],
    order: {
      relevance: "desc",
      followedCount: "desc",
    },
    includes: ["author"],
  });

  let getComic = null;
  let getAuthor = null as any;
  let getComicId = "" as any;
  if (mangadexComics.value && mangadexComics.value?.data.length > 0) {
    getComic = mangadexComics.value?.data.find((item) => {
      const mangaWithAuthor = item.relationships?.find((rel) => {
        const relName = rel.attributes?.name || "";
        const targetName = getAuthorName || "";

        // Normalize both names: split -> sort -> join
        const normalize = (name: any) =>
          name.toLowerCase().split(" ").sort().join(" ");
        const checkAuthorMatch = isAuthorMatch(
          normalize(relName),
          normalize(targetName)
        );

        const isMatch = rel.type === "author" && checkAuthorMatch;

        return isMatch;
      });

      if (mangaWithAuthor) {
        getAuthor = mangaWithAuthor; // ✅ Set the selectedAuthor if found
        return true;
      }

      return false;
    });

    if (getAuthor) {
      getComicId = getComic?.id;
    }
  }

  if (getComicId) {
    const totalChapter = 10;
    const arrChapter = generateChapterArray(totalChapter);

    await fetchChapterMangadex({
      limit: totalChapter,
      manga: getComicId,
      contentRating: ["safe", "suggestive", "erotica"],
      translatedLanguage: ["en"],
      includes: ["scanlation_group"],
      chapter: arrChapter,
      order: {
        volume: "asc",
      },
      includeEmptyPages: "no",
    });
  }
});
</script>

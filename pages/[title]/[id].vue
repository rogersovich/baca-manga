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
        <template v-if="comicPending || (isLoadingKitsu && !coverImg)">
          <Skeleton class="h-[250px] w-full rounded" />
        </template>
        <template v-else>
          <NuxtImg
            :src="coverImg"
            :alt="comicData?.data.title"
            class="h-[300px] w-full object-cover object-center rounded-t-md"
            placeholder="/images/fallback-image.png"
          />
          <div class="absolute bottom-0 inset-0 back-drop-cuk"></div>
        </template>
      </div>
      <div class="px-4 py-6">
        <div class="flex flex-col gap-6">
          <BiographyComic
            :comic="comicData?.data || null"
            :is-loading="comicPending"
            :error="comicError"
          />

          <div>
            <div class="font-semibold text-lg mb-2">Sinopsis</div>
            <template v-if="comicPending">
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
                v-if="comicData?.data.synopsis"
                class="text-gray-50/50 text-sm whitespace-pre-line"
                v-html="comicData?.data.synopsis"
              ></div>
              <div class="text-gray-50/50 text-sm whitespace-pre-line">-</div>
            </template>
          </div>

          <template
            v-if="comicData?.data.genres && comicData?.data.genres.length > 0"
          >
            <div>
              <div class="font-semibold text-lg text-white mb-2">Genres</div>
              <div class="flex flex-wrap gap-3">
                <div
                  v-for="genre in comicData?.data.genres"
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
          <template
            v-if="comicData?.data.themes && comicData?.data.themes.length > 0"
          >
            <div>
              <div class="font-semibold text-lg text-white mb-2">Themes</div>
              <div class="flex flex-wrap gap-3">
                <div
                  v-for="theme in comicData?.data.themes"
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
                    v-for="chapter in mangadexChapters.data"
                    :key="chapter.id"
                    class="flex w-full border border-gray-50/10 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-900 hover:border-blue-900 group"
                  >
                    <div class="basis-[80%]">
                      <div
                        class="text-[16px] mb-1 line-clamp-1 group-hover:text-blue-500"
                      >
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
                        {{
                          useDateFormat(
                            chapter.attributes.createdAt || "",
                            "MMM DD, YYYY"
                          )
                        }}
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
            :characters="characterData?.data || []"
            :is-loading-character="characterPending"
            :error-character="characterError"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconArrowLeft, IconUserFilled } from "@tabler/icons-vue";
import { useDateFormat } from "@vueuse/core";
import type { TBaseResponse } from "~/types/jikanBaseManga.type";
import type { TMangaResponse } from "~/types/jikanManga.type";
import type { TMangaCharacter } from "~/types/jikanMangaCharacter.type";

type MangaReponse = TBaseResponse<TMangaResponse>;
type CharacterReponse = TBaseResponse<TMangaCharacter[]>;

const route = useRoute();
const config = useRuntimeConfig();
const comicStore = useComicStore();
const loading = useLoadingIndicator();

const title = slugToTitle(route.params.title as string);
const comic_id = +route.params.id;

useHead({
  title: `${title} - Manga`,
  meta: [{ name: "description", content: "My amazing site." }],
});

if (comicStore.is_random_comic) {
  comicStore.setRandomComic(false);
}

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

const {
  data: comicData,
  pending: comicPending,
  error: comicError,
} = useBaseFetch<MangaReponse>(`${config.public.apiJikan}/manga/${comic_id}`);

const {
  data: characterData,
  pending: characterPending,
  error: characterError,
} = useBaseFetch<CharacterReponse>(
  `${config.public.apiJikan}/manga/${comic_id}/characters`
);

// Log SSR
watchEffect(() => {
  // if (comicData.value) console.log(comicData.value); // ✅ Logs in browser console
});

const coverImg = computed(() => {
  let image;
  if (kitsuManga.value && kitsuManga.value?.data.length > 0) {
    const manga_kitsu = kitsuManga.value?.data[0];
    const cover_img =
      manga_kitsu.attributes.coverImage?.small ||
      manga_kitsu.attributes.coverImage?.tiny;
    image = cover_img || comicData.value?.data.images.webp.image_url;
  }
  return image;
});

// const uniqueChapters = computed(() => {
//   const seen = new Set();
//   return mangadexChapters.value?.data
//     .filter((item) => {
//       const chapterNum = item.attributes.chapter;
//       if (!chapterNum || seen.has(chapterNum)) return false;
//       seen.add(chapterNum);
//       return true;
//     })
//     .sort(
//       (a, b) =>
//         parseFloat(a.attributes.chapter) - parseFloat(b.attributes.chapter)
//     )
//     .slice(0, 5);
// });

const getAuthorJikan = () => {
  const authorName =
    comicData.value?.data.authors
      ?.filter((item: any) => item.type === "people")
      ?.map((item: any) => item.name)
      ?.shift()
      ?.replace(",", "") || "-";

  return authorName;
};

const mangadexComicId = ref("");

const handleMatchMangadex = () => {
  const authorJikan = getAuthorJikan();
  let matchByAuthor;
  let matchByTitle;

  if (mangadexComics.value && mangadexComics.value?.data.length > 0) {
    matchByTitle = mangadexComics.value?.data.find((item) => {
      const comic_title = item.attributes.title.en.toLocaleLowerCase();
      const param_title = title.toLocaleLowerCase();
      const compare_title = comic_title == param_title;

      return compare_title;
    });

    matchByAuthor = mangadexComics.value?.data.find((item) => {
      const mangaWithAuthor = item.relationships?.find((rel) => {
        const authorMangadex = rel.attributes?.name || "";

        // Normalize both names: split -> sort -> join
        const normalize = (name: any) =>
          name.toLowerCase().split(" ").sort().join(" ");
        const checkAuthorMatch = isAuthorMatch(
          normalize(authorMangadex),
          normalize(authorJikan)
        );

        const comic_title = item.attributes.title.en.toLocaleLowerCase();
        const param_title = title.toLocaleLowerCase();
        const compare_title = comic_title == param_title;
        const isMatch =
          rel.type === "author" && checkAuthorMatch && compare_title;

        return isMatch;
      });

      if (mangaWithAuthor) {
        return true;
      }

      return false;
    });

    if (matchByTitle) {
      if (matchByAuthor) {
        mangadexComicId.value = matchByAuthor?.id;
      } else {
        mangadexComicId.value = matchByTitle?.id;
      }
    }
  }
};

onMounted(async () => {
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

  handleMatchMangadex();

  if (mangadexComicId.value) {
    const totalChapter = 10;
    const arrChapter = generateChapterArray(totalChapter);

    await fetchChapterMangadex({
      limit: totalChapter,
      manga: mangadexComicId.value,
      contentRating: ["safe", "suggestive", "erotica"],
      translatedLanguage: ["en"],
      includes: ["scanlation_group"],
      chapter: arrChapter,
      order: {
        volume: "asc",
        chapter: "asc",
      },
      includeEmptyPages: "no",
    });
  }

  loading.finish();
});
</script>

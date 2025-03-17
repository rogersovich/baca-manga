<template>
  <div class="grid grid-cols-12 justify-center">
    <div class="col-start-4 col-span-6 border border-gray-50/10 rounded-md">
      <template v-if="mangaDetail.loading"> Loading... </template>
      <template v-else-if="mangaDetail.error">
        Error {{ mangaDetail.error }}
      </template>
      <template v-else>
        <div v-if="mangaDetail.imageUrl" class="relative">
          <NuxtImg
            :src="mangaDetail.imageUrl"
            alt="Image is here"
            class="h-[500px] w-full object-cover object-top rounded-t-md"
            placeholder="/images/fallback-image.png"
          />
        </div>
        <div class="px-4 py-6">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12">
              <div class="flex flex-col gap-6">
                <div class="flex items-center justify-between">
                  <div class="font-semibold text-3xl text-white">
                    Manga {{ mangaDetail.data?.attributes.title.en }}
                  </div>
                  <div class="flex items-center justify-end gap-2">
                    <div
                      class="text-[13px] rounded capitalize px-2 py-1"
                      :class="{
                        'bg-blue-600':
                          mangaDetail.data?.attributes.status === 'ongoing',
                        'bg-green-600':
                          mangaDetail.data?.attributes.status === 'completed',
                        'bg-yellow-600':
                          mangaDetail.data?.attributes.status === 'hiatus',
                        'bg-red-600':
                          mangaDetail.data?.attributes.status === 'cancelled',
                      }"
                    >
                      {{ mangaDetail.data?.attributes.status }}
                    </div>
                  </div>
                </div>

                <div>
                  <div class="font-semibold text-xl mb-2">Sinopsis</div>
                  <div
                    class="text-gray-50/50 whitespace-pre-line"
                    v-html="mangaDetail.data?.attributes.description?.en"
                  ></div>
                </div>

                <div class="grid grid-cols-13 gap-6">
                  <div class="col-span-4">
                    <NuxtImg
                      v-if="mangaDetail.imageUrl"
                      :src="mangaDetail.imageUrl"
                      alt="Image is here"
                      class="w-full object-cover"
                      placeholder="/images/fallback-image.png"
                    />
                  </div>
                  <div class="col-span-9">
                    <div class="flex flex-col gap-2">
                      <div>
                        <span>Title: </span>
                        <span class="text-gray-50/50">
                          {{ mangaDetail.data?.attributes.title.en }}
                        </span>
                      </div>
                      <div v-if="mangaDetail.data?.attributes?.altTitles">
                        <span>Alternative Title: </span>
                        <span class="text-gray-50/50">
                          {{
                            mangaDetail.data?.attributes.altTitles.find(
                              (title) =>
                                title.hasOwnProperty(
                                  mangaDetail?.data?.attributes.originalLanguage
                                )
                            )?.[mangaDetail.data.attributes.originalLanguage]
                          }}
                        </span>
                      </div>
                      <div>
                        <span>Comic type: </span>
                        <span class="text-gray-50/50"> Manga </span>
                      </div>
                      <div>
                        <span>Year: </span>
                        <span class="text-gray-50/50">
                          {{ mangaDetail.data?.attributes.year }}
                        </span>
                      </div>
                      <div v-if="mangaDetail.data?.attributes.lastVolume">
                        <span> Last Volume: </span>
                        <span class="text-gray-50/50">
                          {{ mangaDetail.data?.attributes.lastVolume }} Volume
                        </span>
                      </div>
                      <div v-if="mangaDetail.data?.attributes.lastChapter">
                        <span> Last Chapter: </span>
                        <span class="text-gray-50/50">
                          {{ mangaDetail.data?.attributes.lastChapter }} Chapter
                        </span>
                      </div>
                      <div
                        v-if="
                          mangaDetail.data?.attributes.publicationDemographic
                        "
                      >
                        <span> Demographic: </span>
                        <span class="text-gray-50/50">
                          {{
                            mangaDetail.data?.attributes.publicationDemographic
                          }}
                        </span>
                      </div>
                      <div v-if="mangaDetail.data?.attributes.contentRating">
                        <span> Content Rating: </span>
                        <span class="text-gray-50/50">
                          {{ mangaDetail.data?.attributes.contentRating }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <template v-if="mangaDetail.data?.attributes.tags">
                  <div class="flex flex-wrap gap-3">
                    <div
                      v-for="tag in mangaDetail.data?.attributes.tags"
                      :key="tag.id"
                      class="text-[14px] rounded bg-gray-50/10 px-2 py-1 text-white/90 cursor-pointer"
                    >
                      <div>
                        {{ tag.attributes.name.en }}
                      </div>
                    </div>
                  </div>
                </template>

                <div>
                  <div class="font-semibold text-xl mb-2">Daftar Chapters</div>
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
import { fetchMangaDetail } from "@/composables/useMangaDetails";
import type { FilterMangaDetailResponse, MangaData } from "~/types/manga";

const route = useRoute();
const baseUrlImage = ref("https://mangadex.org/covers");
const mangaDetail = ref<{
  data: MangaData | null;
  loading: boolean;
  error: string | null;
  imageUrl: string;
}>({
  data: null,
  loading: false,
  error: null,
  imageUrl: "",
});
const apiParams = reactive<FilterMangaDetailResponse>({
  includes: ["cover_art"],
});

const getTitle = computed(() => {
  return mangaDetail.value.data?.attributes.title.en;
});

const getFileName = (manga: MangaData) => {
  console.log(manga, "hehe");
  const coverArt = manga.relationships.find(
    (item) => item.type === "cover_art"
  );
  console.log(manga, "coverArt");
  return coverArt?.attributes?.fileName || null;
};

onMounted(async () => {
  const { responses, loading, error } = await fetchMangaDetail(
    route.params.id as string,
    apiParams
  );

  mangaDetail.value.data = responses.value;

  const mangaId = mangaDetail.value.data?.id;
  const fileName = getFileName(mangaDetail.value.data as MangaData);
  mangaDetail.value.imageUrl = `${baseUrlImage.value}/${mangaId}/${fileName}.512.jpg`;

  mangaDetail.value.loading = loading.value;
  mangaDetail.value.error = error.value;

  useHead({
    title: `${getTitle.value} - Manga`,
    meta: [{ name: "description", content: "My amazing site." }],
  });
});
</script>

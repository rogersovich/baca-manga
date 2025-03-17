import type {
  MangaResponse,
  MangaData,
  ChapterData,
  ChapterResponse,
  FilterMangaResponse,
  BaseResponseData,
  FilterMangaStatisticsResponse,
  MangaDetailResponse,
  FilterMangaDetailResponse,
} from "@/types/manga";
import {
  buildQueryString,
  buildQueryStringStatistic,
} from "@/utils/queryBuilder";

const BASE_URL = "https://api.mangadex.org";

export default {
  async fetchMangaList(
    params: FilterMangaResponse
  ): Promise<BaseResponseData<MangaData[]> | null> {
    //? Use the reusable query builder function
    const queryString = buildQueryString(params);
    const url = `${BASE_URL}/manga${queryString}`;

    const cacheKey = `lisst_mangas_cache_${queryString}`;

    const data = await BaseFetch<MangaResponse>(url, cacheKey, 60); // Cache for 1 minute

    const response = {
      data: data?.data || [],
      total: data?.total || 0,
      status: data?.result,
    } as BaseResponseData<MangaData[]>;

    return data ? response : null;
  },

  async fetchMangaDetails(
    mangaId: string,
    params: FilterMangaDetailResponse
  ): Promise<BaseResponseData<MangaData> | null> {
    const queryString = buildQueryStringDetail(params);
    const url = `${BASE_URL}/manga/${mangaId}${queryString}`;

    const cacheKey = `manga_cache_${url}`;

    const data = await BaseFetch<MangaDetailResponse>(url, cacheKey, 60); // Cache for 1 minute

    const response = {
      data: data?.data || null,
      status: "ok",
    } as BaseResponseData<MangaData>;

    return data ? response : null;
  },

  async fetchMangaChapters(mangaId: string): Promise<ChapterData[] | null> {
    try {
      const response = await fetch(
        `${BASE_URL}/manga/${mangaId}/feed?translatedLanguage[]=en&order[volume]=desc&order[chapter]=desc`
      );
      if (!response.ok) throw new Error("Failed to fetch manga chapters");

      const data: ChapterResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching manga chapters:", error);
      return null;
    }
  },

  async fetchMangaStatics(
    params: FilterMangaStatisticsResponse
  ): Promise<BaseResponseData<any> | null> {
    //? Use the reusable query builder function
    const queryString = buildQueryStringStatistic(params);
    const url = `${BASE_URL}/statistics/manga${queryString}`;

    const cacheKey = `manga_statistics_cache_${queryString}`;

    const data = await BaseFetch<any>(url, cacheKey, 60); // Cache for 1 minute

    const response = {
      data: data?.statistics || null,
      status: data?.result,
    } as BaseResponseData<any>;

    return data ? response : null;
  },
};

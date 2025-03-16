import type {
  FilterMangaResponse,
  FilterMangaStatisticsResponse,
} from "./../types/manga";

export function buildQueryString(params: FilterMangaResponse): string {
  if (!params) return "";

  let queryString = "?";

  if (params.includes) {
    queryString +=
      params.includes.map((include) => `includes[]=${include}`).join("&") + "&";
  }
  if (params.contentRating) {
    queryString +=
      params.contentRating
        .map((rating) => `contentRating[]=${rating}`)
        .join("&") + "&";
  }
  if (params.status) {
    queryString +=
      params.status.map((item) => `status[]=${item}`).join("&") + "&";
  }
  if (params.publicationDemographic) {
    queryString +=
      params.publicationDemographic
        .map((item) => `publicationDemographic[]=${item}`)
        .join("&") + "&";
  }
  if (params.order) {
    queryString +=
      Object.entries(params.order)
        .map(([key, value]) => `order[${key}]=${value}`)
        .join("&") + "&";
  }
  if (params.limit) {
    queryString += `limit=${params.limit}&`;
  }
  if (params.offset != undefined) {
    queryString += `offset=${params.offset}&`;
  }
  if (params.title) {
    queryString += `title=${params.title}&`;
  }
  if (params.year) {
    queryString += `year=${params.year}&`;
  }
  if (params.hasAvailableChapters) {
    queryString += `hasAvailableChapters=${params.hasAvailableChapters}&`;
  }

  // Remove trailing "&" if exists
  return queryString.endsWith("&") ? queryString.slice(0, -1) : queryString;
}

export function buildQueryStringStatistic(
  params: FilterMangaStatisticsResponse
): string {
  if (!params) return "";

  let queryString = "?";
  if (params.manga) {
    queryString +=
      params.manga.map((item) => `manga[]=${item}`).join("&") + "&";
  }

  // Remove trailing "&" if exists
  return queryString.endsWith("&") ? queryString.slice(0, -1) : queryString;
}

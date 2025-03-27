import { defineStore } from "pinia";

export const useComicStore = defineStore("comic", {
  state: () => ({
    is_random_comic: false,
    is_page_search: false,
  }),
  actions: {
    setRandomComic(value: boolean) {
      this.is_random_comic = value;
    },
    setPageSearch(value: boolean) {
      this.is_page_search = value;
    },
  },
});

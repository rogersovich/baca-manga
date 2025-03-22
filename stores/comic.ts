import { defineStore } from "pinia";

export const useComicStore = defineStore("comic", {
  state: () => ({
    is_random_comic: false,
  }),
  actions: {
    setRandomComic(value: boolean) {
      this.is_random_comic = value;
    },
  },
});

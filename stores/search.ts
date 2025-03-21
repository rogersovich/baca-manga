import { defineStore } from "pinia";

export const useSearchStore = defineStore("search", {
  state: () => ({
    is_open_bar: false,
    mal_id: 0,
  }),
  actions: {
    setOpenBar(value: boolean) {
      this.is_open_bar = value;
    },
    setMalId(value: number) {
      this.mal_id = value;
    },
  },
});

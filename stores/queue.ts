import { defineStore } from "pinia";

export const useQueueStore = defineStore("queue", {
  state: () => ({
    list_queue: [] as string[],
    limit_queue: 1,
    avaiable_queue: true,
  }),
  actions: {
    pushQueue(key: string) {
      const value = this.checkQueue();
      if (value) {
        this.list_queue.push(key);
      }
    },
    checkQueue() {
      if (this.list_queue.length == this.limit_queue) {
        this.avaiable_queue = false;
      } else {
        this.avaiable_queue = true;
      }

      return this.avaiable_queue;
    },
    removeQueue(key: string) {
      this.list_queue = this.list_queue.filter((item) => item != key);
      this.checkQueue();
    },
  },
});

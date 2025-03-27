<template>
  <div>
    <section class="text-white/50 mb-6 grid grid-cols-12 gap-6">
      <div id="all-content" class="col-span-12 lg:col-span-7 xl:col-span-8">
        <SectionMainManga />
        <SectionStatusManga />
      </div>
      <div
        id="top-content"
        class="hidden lg:block xl:block lg:col-span-5 xl:col-span-4"
      >
        <TopComicByType type="manga" />
        <TopComicByType type="manhwa" />
      </div>
      <div id="top-content" class="block lg:hidden col-span-12 md:col-span-6">
        <TopComicByType type="manga" />
      </div>
      <div id="top-content" class="block lg:hidden col-span-12 md:col-span-6">
        <TopComicByType type="manhwa" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "Home - Manga",
  meta: [{ name: "description", content: "My amazing site." }],
});
</script>

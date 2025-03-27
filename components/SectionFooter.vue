<template>
  <div class="w-full block py-8 px-4 md:px-8">
    <div
      class="text-white/50 grid grid-cols-12 gap-y-12 md:gap-12 md:gap-y-0 items-center"
    >
      <div class="col-span-12 md:col-span-3 flex flex-col gap-3">
        <div class="text-2xl font-bold text-white/70">✨ Social Media</div>
        <div class="text-sm">
          Stay informed about the latest releases, features, guides, and
          community updates. Follow us on GitHub, LinkedIn, and our official
          website to stay connected.
        </div>
        <div class="flex items-center gap-3">
          <div class="border border-gray-50/30 p-2 rounded-md">
            <IconBrandGithubFilled class="size-5" />
          </div>
          <div class="border border-gray-50/30 p-2 rounded-md">
            <IconBrandLinkedinFilled class="size-5" />
          </div>
          <div class="border border-gray-50/30 p-2 rounded-md">
            <IconWorld class="size-5" />
          </div>
        </div>
      </div>
      <div class="col-span-12 md:col-span-3 flex flex-col gap-3">
        <div class="text-2xl font-bold text-white/70">🛠️ Resources API</div>
        <div class="text-sm">
          This website retrieves data from third-party APIs like MangaDex, Jikan
          Moe, and Kitsu Manga.
        </div>
        <div class="flex flex-wrap items-start gap-3">
          <div
            class="text-sm cursor-pointer hover:underline flex items-center gap-1"
          >
            <IconExternalLink class="size-4" />
            <span> API Jikan Moe </span>
          </div>
          <div
            class="text-sm cursor-pointer hover:underline flex items-center gap-1"
          >
            <IconExternalLink class="size-4" />
            <span> API Mangadex </span>
          </div>
          <div
            class="text-sm cursor-pointer hover:underline flex items-center gap-1"
          >
            <IconExternalLink class="size-4" />
            <span> API Kitsu Manga </span>
          </div>
        </div>
      </div>
      <div class="col-span-12 md:col-span-3 flex flex-col gap-3">
        <div class="text-2xl font-bold text-white/70">⚠️ Disclaimer</div>
        <div class="text-sm">
          <div class="mb-1">
            The manga content on this website is sourced from the Thrid-Party
            API.
          </div>
          <div>
            We are not the owners or official providers of the manga shown. All
            copyrights belong to their respective owners.
          </div>
        </div>
        <div class="text-sm">
          © {{ getYear() }} InfoManga. All rights reserved.
        </div>
      </div>
      <div class="col-span-12 md:col-span-3 flex flex-col gap-3">
        <div class="text-2xl font-bold text-white/70">📬 Get in Touch</div>
        <div class="text-sm">
          <div class="mb-1">
            Have questions or inquiries? Feel free to reach out via email. We're
            here to help!
          </div>
          <div>
            This keeps it professional, friendly, and to the point. Let me know
            if you want any tweaks! 😊
          </div>
        </div>
        <Input placeholder="you@email.com" class="h-11" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  IconBrandGithubFilled,
  IconBrandLinkedinFilled,
  IconWorld,
  IconExternalLink,
} from "@tabler/icons-vue";

const getYear = () => {
  return new Date().getFullYear();
};
</script>

<template>
  <div>
    <header
      class="flex items-center z-50 justify-between px-8 py-4 bg-gray-950 border-b border-gray-50/10 text-white w-full fixed"
    >
      <div class="logo">Logo</div>
      <div class="flex items-center gap-2">
        <div class="relative w-full max-w-sm items-center group">
          <Input
            id="search"
            type="text"
            placeholder="Search..."
            class="pr-10 w-[300px] group-hover:border-gray-50/50"
          />
          <span
            class="absolute right-0 inset-y-0 flex items-center justify-center px-2"
          >
            <IconCommand
              class="size-6 text-muted-foreground group-hover:text-primary"
            />
          </span>
        </div>
        <div
          class="border border-gray-50/10 rounded-md p-[7px] cursor-pointer group hover:border-gray-50/50"
        >
          <IconSearch
            class="size-5 text-muted-foreground group-hover:text-primary"
          />
        </div>
        <div
          class="border border-gray-50/10 rounded-md p-[7px] cursor-pointer group hover:border-gray-50/50"
        >
          <IconArrowsShuffle
            class="size-5 text-muted-foreground group-hover:text-primary"
          />
        </div>
      </div>
      <div class="actions">Login</div>
    </header>
    <div class="min-h-screen pt-[92px] px-[24px]">
      <slot />
    </div>
    <footer>footer</footer>
  </div>
</template>

<script setup>
import { IconCommand, IconSearch, IconArrowsShuffle } from "@tabler/icons-vue";
</script>

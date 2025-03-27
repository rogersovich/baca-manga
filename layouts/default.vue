<template>
  <div>
    <SectionHeader />
    <div
      class="min-h-screen pt-[188px] md:pt-[92px] px-[24px]"
      :class="{ '!pt-[138px] md:!pt-[92px]': $route.path == '/search' }"
    >
      <slot />
    </div>
    <SectionFooter />
  </div>
</template>

<script setup></script>

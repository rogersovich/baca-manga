<template>
  <div class="bg-gray-950">
    <NuxtLayout>
      <NuxtPage />
      <!-- <button class="p-2 bg-secondary rounded" @click="toggleDarkMode">
        {{ isDark ? "🌙 Dark Mode" : "☀️ Light Mode" }}
      </button> -->
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// Track dark mode state
const isDark = ref<boolean>(false);

// Function to toggle dark mode
// const toggleDarkMode = () => {
//   isDark.value = !isDark.value;

//   // Only update localStorage in the browser
//   if (typeof window !== "undefined") {
//     localStorage.setItem("theme", isDark.value ? "dark" : "light");
//   }

//   updateDarkMode();
// };

// Function to apply the correct dark mode class
const updateDarkMode = () => {
  if (isDark.value) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

// Load user's preference or detect system preference (only on client)
onMounted(() => {
  if (typeof window !== "undefined") {
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme) {
      isDark.value = storedTheme === "dark";
    } else {
      isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    updateDarkMode();
  }
});
</script>

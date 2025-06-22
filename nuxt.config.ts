// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  devServer: {
    port: 3001,
  },
  runtimeConfig: {
    // Server-only variables
    apiSecret: process.env.YOUR_SECRET_KEY,

    // Public variables available on client and server
    public: {
      apiJikan: process.env.API_JIKAN_URL,
      apiKitsu: process.env.API_KITSU_URL,
      apiMangadex: process.env.API_MANGADEX_URL,
    },
  },

  modules: [
    "@nuxt/image",
    "@nuxt/eslint",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@pinia/nuxt",
  ],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
});

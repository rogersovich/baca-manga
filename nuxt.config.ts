// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  runtimeConfig: {
    // Server-only variables
    apiSecret: process.env.YOUR_SECRET_KEY,

    // Public variables available on client and server
    public: {
      apiUrl: process.env.API_JIKAN_URL,
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

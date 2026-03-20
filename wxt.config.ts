import { defineConfig } from "wxt"
import { resolve } from "path"

export default defineConfig({
  srcDir: "src",
  modules: ["@wxt-dev/auto-icons"],
  manifest: {
    name: "Fertilizer",
    description: "Web extension to enhance Harvest UI",
    browser_specific_settings: {
      gecko: {
        id: "{e7c40e74-3a6b-4c67-9e26-1c2f2435f9ad}",
      },
    },
  },
  vite: () => ({
    resolve: {
      alias: {
        "~": resolve(__dirname, "./src"),
      },
    },
  }),
})

import pkg from "../package.json"

const sharedManifest = {
  author: pkg.author,
  description: pkg.description,
  name: pkg.displayName ?? pkg.name,
  version: pkg.version,
  content_scripts: [
    {
      js: ["src/entries/contentScript/main.ts"],
      matches: ["https://*.harvestapp.com/time/*"],
    },
  ],
  icons: {
    16: "icons/16.png",
    19: "icons/19.png",
    32: "icons/32.png",
    38: "icons/38.png",
    48: "icons/48.png",
    64: "icons/64.png",
    96: "icons/96.png",
    128: "icons/128.png",
    256: "icons/256.png",
    512: "icons/512.png",
  },
  permissions: [],
} satisfies Partial<chrome.runtime.ManifestV2 | chrome.runtime.ManifestV3>

const browserAction = {
  default_icon: {
    16: "icons/16.png",
    19: "icons/19.png",
    32: "icons/32.png",
    38: "icons/38.png",
  },
}

const ManifestV2 = {
  browser_action: browserAction,
} satisfies Partial<chrome.runtime.ManifestV3>

const ManifestV3 = {
  action: browserAction,
  host_permissions: ["*://*/*"],
} satisfies Partial<chrome.runtime.ManifestV3>

export function getManifest(manifestVersion: number): chrome.runtime.ManifestV2 | chrome.runtime.ManifestV3 {
  if (manifestVersion === 2) {
    return {
      ...sharedManifest,
      ...ManifestV2,
      manifest_version: manifestVersion,
    }
  }

  if (manifestVersion === 3) {
    return {
      ...sharedManifest,
      ...ManifestV3,
      manifest_version: manifestVersion,
    }
  }

  throw new Error(`Missing manifest definition for manifestVersion ${manifestVersion}`)
}

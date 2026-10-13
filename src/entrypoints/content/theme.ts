export type Palette = {
  break: string
  overlap: string
  missingNote: string
  invalidCharacters: string
  gapBorder: string
}

export const lightPalette: Palette = {
  break: "rgb(142 223 142 / 37%)",
  overlap: "rgb(255 0 0 / 24%)",
  missingNote: "rgb(166 166 166 / 25%)",
  invalidCharacters: "rgb(252 186 3 / 24%)",
  gapBorder: "#bbbbbb",
}

export const darkPalette: Palette = {
  break: "rgb(74 222 128 / 30%)",
  overlap: "rgb(248 113 113 / 35%)",
  missingNote: "rgb(203 213 225 / 30%)",
  invalidCharacters: "rgb(251 191 36 / 32%)",
  gapBorder: "#555555",
}

export function currentPalette(): Palette {
  return isDarkMode() ? darkPalette : lightPalette
}

// Harvest's dark mode mechanism is not documented, so we look at the actual page background
export function isDarkMode(): boolean {
  for (const element of [document.body, document.documentElement]) {
    if (!element) continue
    const color = parseColor(getComputedStyle(element).backgroundColor)
    if (color && color.alpha > 0) {
      return luminance(color) < 0.5
    }
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false
}

type Color = { red: number; green: number; blue: number; alpha: number }

function parseColor(value: string): Color | null {
  const match = value.match(/rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+%?))?\s*\)/)
  if (!match) return null
  const [, red, green, blue, alpha] = match
  return {
    red: Number(red),
    green: Number(green),
    blue: Number(blue),
    alpha: alpha === undefined ? 1 : alpha.endsWith("%") ? parseFloat(alpha) / 100 : Number(alpha),
  }
}

// Relative luminance as defined by WCAG
function luminance({ red, green, blue }: Color): number {
  const [r, g, b] = [red, green, blue].map((channel) => {
    const c = channel / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

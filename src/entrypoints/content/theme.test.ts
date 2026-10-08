import { darkPalette, isDarkMode, lightPalette, currentPalette } from "./theme"

function mockPrefersDark(matches: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({ matches }) as unknown as typeof window.matchMedia
}

afterEach(() => {
  document.body.style.backgroundColor = ""
  document.documentElement.style.backgroundColor = ""
})

describe("isDarkMode", () => {
  it("detects a dark page background", () => {
    document.body.style.backgroundColor = "rgb(30, 30, 30)"
    expect(isDarkMode()).toBe(true)
    expect(currentPalette()).toBe(darkPalette)
  })

  it("detects a light page background", () => {
    document.body.style.backgroundColor = "#ffffff"
    expect(isDarkMode()).toBe(false)
    expect(currentPalette()).toBe(lightPalette)
  })

  it("uses the html background if the body is transparent", () => {
    document.documentElement.style.backgroundColor = "#111827"
    expect(isDarkMode()).toBe(true)
  })

  it("falls back to the color scheme preference if all backgrounds are transparent", () => {
    mockPrefersDark(true)
    expect(isDarkMode()).toBe(true)
    mockPrefersDark(false)
    expect(isDarkMode()).toBe(false)
  })
})

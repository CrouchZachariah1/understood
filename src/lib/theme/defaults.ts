import type { SeasonKey } from "@prisma/client";

export type ThemeTokens = {
  season: SeasonKey;
  label: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  heroHeading: string;
  heroSubtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  bannerText: string;
  heroImage: string;
  campaignImage: string;
  decorative: string;
};

export const SEASON_THEMES: Record<SeasonKey, ThemeTokens> = {
  SUMMER: {
    season: "SUMMER",
    label: "Summer",
    primary: "#FF6B2C",
    secondary: "#1EA7E1",
    accent: "#FFD23F",
    background: "#FFF8EE",
    foreground: "#072448",
    muted: "#F3E4C8",
    heroHeading: "SUMMER. UNDERSTOOD.",
    heroSubtitle: "Bright colours. Everyday comfort. Made for growing.",
    ctaPrimary: "Shop now",
    ctaSecondary: "Explore deals",
    bannerText: "Pick any 5 briefs for R299 · Free delivery over R650",
    heroImage: "/themes/hero-summer.jpg",
    campaignImage: "/themes/campaign-summer.jpg",
    decorative: "sun",
  },
  SPRING: {
    season: "SPRING",
    label: "Spring",
    primary: "#7CB342",
    secondary: "#81D4FA",
    accent: "#F6E27A",
    background: "#F7FBF4",
    foreground: "#1F3B2C",
    muted: "#E4F0D8",
    heroHeading: "Spring, understood.",
    heroSubtitle: "A fresh season begins. Colour your everyday.",
    ctaPrimary: "Shop spring",
    ctaSecondary: "Fresh colours",
    bannerText: "New season colour — everyday comfort, freshly picked.",
    heroImage: "/themes/hero-spring.jpg",
    campaignImage: "/themes/campaign-spring.jpg",
    decorative: "bloom",
  },
  AUTUMN: {
    season: "AUTUMN",
    label: "Autumn",
    primary: "#C45C26",
    secondary: "#6B7F3B",
    accent: "#E8B86D",
    background: "#FBF4EC",
    foreground: "#3B2416",
    muted: "#EAD6C0",
    heroHeading: "Autumn, understood.",
    heroSubtitle: "Change is comfortable.",
    ctaPrimary: "Shop autumn",
    ctaSecondary: "Warm colours",
    bannerText: "Softer light. Warmer layers. Comfort that stays.",
    heroImage: "/themes/hero-autumn.jpg",
    campaignImage: "/themes/campaign-autumn.jpg",
    decorative: "leaf",
  },
  WINTER: {
    season: "WINTER",
    label: "Winter",
    primary: "#C9A36A",
    secondary: "#1B2A4A",
    accent: "#F3E6D0",
    background: "#F4F1EA",
    foreground: "#141820",
    muted: "#D9D3C7",
    heroHeading: "Winter, understood.",
    heroSubtitle: "Comfort season.",
    ctaPrimary: "Shop winter",
    ctaSecondary: "Stay warm",
    bannerText: "Knits, cream light, and everyday comfort that holds.",
    heroImage: "/themes/hero-winter.jpg",
    campaignImage: "/themes/campaign-winter.jpg",
    decorative: "rain",
  },
  CUSTOM: {
    season: "CUSTOM",
    label: "Custom",
    primary: "#FF6B2C",
    secondary: "#1EA7E1",
    accent: "#FFD23F",
    background: "#FFF8EE",
    foreground: "#072448",
    muted: "#F3E4C8",
    heroHeading: "UNDERSTOOD.",
    heroSubtitle: "Comfort. Understood.",
    ctaPrimary: "Shop now",
    ctaSecondary: "Explore",
    bannerText: "Everyday comfort for growing families.",
    heroImage: "/themes/hero-summer.jpg",
    campaignImage: "/themes/campaign-summer.jpg",
    decorative: "sun",
  },
};

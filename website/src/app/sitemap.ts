import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://media-vault-website.vercel.app";
  const now = new Date();

  const staticPages = [
    { url: baseUrl, changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${baseUrl}/search`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/contact`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/privacy`, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/tiktok`, changeFrequency: "daily" as const, priority: 0.8 },
  ];

  const genres = [
    "afrobeat", "dancehall", "gospel", "hip-hop", "reggae",
    "bongo-flava", "zouk", "rnb", "amapiano", "singeli",
    "pop", "rock", "jazz", "blues", "country",
    "electronic", "house", "techno", "soul", "funk",
  ];

  const genrePages = genres.map((genre) => ({
    url: `${baseUrl}/genre/${genre}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...genrePages];
}
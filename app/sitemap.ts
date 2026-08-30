import { emails } from "@/content/email";
import { LABEL_SLUGS } from "@/lib/labels";
import { SITE_URL } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      priority: 1,
    },
    ...emails.map((e) => ({
      url: `${SITE_URL}/email/${e.id}`,
      lastModified: e.date,
    })),
    ...Object.values(LABEL_SLUGS).map((s) => ({
      url: `${SITE_URL}/label/${s}`,
    })),
  ];
}

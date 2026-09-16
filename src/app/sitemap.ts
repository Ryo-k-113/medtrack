import type { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"
import { SITE_URL } from "@/constants/site"

/** 1日に1回作り直す（包装の増減や出荷状況の更新を反映するため） */
export const revalidate = 86400

/** 固定ページ */
const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
  { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
  { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
]

/**
 * 公開ページの一覧（固定ページと、公開中の包装の詳細ページ）
 * サイトマップ1ファイルの上限は50,000件のため、それに近づいたら分割する
 */
const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const packageUnits = await prisma.packageUnit.findMany({
    where: { publishStatus: "PUBLISHED" },
    select: { id: true, drugId: true, updatedAt: true },
    orderBy: { id: "asc" },
  })

  const packagePages: MetadataRoute.Sitemap = packageUnits.map((packageUnit) => ({
    url: `${SITE_URL}/drugs/${packageUnit.drugId}/packages/${packageUnit.id}`,
    lastModified: packageUnit.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  return [...STATIC_PAGES, ...packagePages]
}

export default sitemap

import type { MetadataRoute } from "next"
import { SITE_URL } from "@/constants/site"

/**
 * 検索エンジン向けのクロール設定
 * 管理画面・ログインが必要なページ・API・検索結果は対象から外す
 * （検索結果はキーワードごとにURLが無数に増えるため）
 */
const robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: "*",
    allow: "/",
    disallow: ["/admin", "/mypage", "/api", "/auth", "/login", "/signup", "/search"],
  },
  sitemap: `${SITE_URL}/sitemap.xml`,
})

export default robots

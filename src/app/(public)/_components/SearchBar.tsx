"use client"

import { useForm, FormProvider } from "react-hook-form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { SearchBox } from "@/components/Form/SearchBox"
import { useSupabaseSession } from "@/hooks/useSupabaseSession"

type SearchFormData = {
  keyword: string
}

// 未ログイン時は1件、ログイン時は3件まで同時検索できる
const MAX_KEYWORDS_GUEST = 1
const MAX_KEYWORDS_MEMBER = 3

type SearchBarProps = {
  defaultKeyword?: string
}

export const SearchBar = ({ defaultKeyword = "" }: SearchBarProps) => {
  const router = useRouter()
  const { session } = useSupabaseSession()

  const maxKeywords = session ? MAX_KEYWORDS_MEMBER : MAX_KEYWORDS_GUEST

  const searchForm = useForm<SearchFormData>({
    values: { keyword: defaultKeyword },
  })

  // 検索の実行
  const handleSearch = searchForm.handleSubmit(({ keyword }) => {
    const keywords = keyword
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0)

    if (keywords.length > maxKeywords) {
      toast.error(
        session
          ? `検索キーワードは${maxKeywords}件までです`
          : `未ログインの場合、検索は1件までです。複数同時検索するにはログインしてください`
      )
      return
    }

    // キーワードが空の場合はqueryなしで遷移し、検索結果ページ側の案内表示に委ねる
    const query = keywords.length > 0
      ? `?query=${encodeURIComponent(keywords.join(","))}`
      : ""

    router.push(`/search${query}`)
  })

  return (
    <FormProvider {...searchForm}>
      <div className="py-4 md:py-8">
        <form onSubmit={handleSearch}>
          <SearchBox
            name="keyword"
            placeholder="キーワードを入力..."
            className="h-12"
            buttonClassName="h-12 w-12"
          />
        </form>
        <p className="mt-2 text-xs text-weak">
          複数検索する場合は「,」で区切って検索してください
        </p>
      </div>
    </FormProvider>
  )
}

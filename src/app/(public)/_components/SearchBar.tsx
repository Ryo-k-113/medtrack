"use client"

import { useForm, FormProvider } from "react-hook-form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { SearchBox } from "@/components/Form/SearchBox"
import { useMe } from "@/hooks/useMe"

type SearchFormData = {
  keyword: string
}

// 同時に検索できるキーワードの数
// 未ログインでも3件まで検索でき、2件目以降は検索結果ページで無料登録を案内する
const MAX_KEYWORDS = 3

type SearchBarProps = {
  defaultKeyword?: string
  /** 外側の余白など（置く場所ごとに指定する） */
  className?: string
}

export const SearchBar = ({ defaultKeyword = "", className }: SearchBarProps) => {
  const router = useRouter()
  const { isLoggedIn, isLoading } = useMe()
  // ログイン状態の確認中は会員向けの案内を出し、表示が切り替わってちらつかないようにする
  const isGuest = !isLoading && !isLoggedIn

  const searchForm = useForm<SearchFormData>({
    values: { keyword: defaultKeyword },
  })

  // 検索の実行
  const handleSearch = searchForm.handleSubmit(({ keyword }) => {
    const keywords = keyword
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0)

    if (keywords.length > MAX_KEYWORDS) {
      toast.error(`検索キーワードは${MAX_KEYWORDS}件までです`)
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
      <div className={className}>
        <form onSubmit={handleSearch}>
          <SearchBox
            name="keyword"
            placeholder="例) ロキソ ６０ サワイ"
            className="h-12"
            buttonClassName="h-12 w-12"
          />
        </form>
        <p className="mt-2 text-sm text-weak">
          {isGuest
            ? "「,」で区切ると3件まで同時に検索できます（2件目からは無料登録で表示）"
            : "複数検索する場合は「,」で区切って検索してください。(最大3件)"}
        </p>
      </div>
    </FormProvider>
  )
}

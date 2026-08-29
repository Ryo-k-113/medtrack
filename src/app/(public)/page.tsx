"use client"

import { SearchBar } from "./_components/SearchBar"


export default function TopPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* お知らせバナー */}
      <div className="bg-surface text-primary text-xs text-center p-4">
        アカウント登録すると医薬品の複数同時検索が可能に！ ログインボタンから新規登録をお願いします。
      </div>

      {/* 2. メインコンテンツエリア (2カラムレイアウト) */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* 上部：検索バーエリア */}
        <section className="max-w-2xl mx-auto">
          <SearchBar />
        </section>

        {/* 下部：2カラムエリア（左：カード一覧 / 右：カレンダー） */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 左側メイン (8/12) */}
          <section className="lg:col-span-8 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h2 className="text-xl font-bold">新着情報</h2>
              {/* フィルター等のプレースホルダー */}
              <div className="flex gap-2">
                <div className="h-8 w-20 bg-white border rounded" />
                <div className="h-8 w-20 bg-white border rounded" />
              </div>
            </div>

            {/* カード一覧のダミー枠 */}
            <div className="space-y-4">
              <div className="h-40 bg-white border rounded-lg p-4 shadow-sm" />
              <div className="h-40 bg-white border rounded-lg p-4 shadow-sm" />
              <div className="h-40 bg-white border rounded-lg p-4 shadow-sm" />
            </div>
          </section>

          {/* 右側サイドバー (4/12) */}
          <aside className="lg:col-span-4">
            {/* カレンダーのダミー枠 */}
            <div className="bg-white border rounded-lg p-4 shadow-sm min-h-[300px]">
              カレンダー枠
            </div>
          </aside>

        </div>
      </main>
    </div>
  )
}

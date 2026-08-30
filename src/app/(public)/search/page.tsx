"use client"

import { Suspense } from "react"
import { SearchPageContent } from "./_components/SearchPageContent"
import { SearchPageSkeleton } from "./_components/SearchPageSkeleton"

export default function SearchResultPage() {
  return (
    <>
    <Suspense fallback={<SearchPageSkeleton />}>
      <SearchPageContent />
    </Suspense>
    </>
  )
}

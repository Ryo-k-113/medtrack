import type { Metadata } from "next"
import { PageContainer } from "@/components/Layout/PageContainer"
import { LegalSection } from "../_components/LegalSection"
import { LEGAL_ESTABLISHED_DATE, TERMS_REVISED_DATE, TERMS_SECTIONS } from "../_constants/legal"

export const metadata: Metadata = {
  // 「%s | MedTrack」の形になるため、ここではページ名だけを指定する
  title: "利用規約・免責事項",
}

export default function TermsPage() {
  return (
  
    <PageContainer className="max-w-3xl space-y-8 py-10">
      <h1 className="text-xl font-bold md:text-2xl">利用規約・免責事項</h1>

      <div className="space-y-8">
        {TERMS_SECTIONS.map((section) => (
          <LegalSection key={section.title} title={section.title}>
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </LegalSection>
        ))}
      </div>

      <p className="text-xs text-weak">
        制定日: {LEGAL_ESTABLISHED_DATE}　改定日: {TERMS_REVISED_DATE}
      </p>
    </PageContainer>
  )
}

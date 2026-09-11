import type { Metadata } from "next"
import { PageContainer } from "@/components/Layout/PageContainer"
import { LegalSection } from "../_components/LegalSection"
import { LEGAL_ESTABLISHED_DATE, PRIVACY_SECTIONS } from "../_constants/legal"

export const metadata: Metadata = {
  title: "プライバシーポリシー | MedTrack",
}

export default function PrivacyPage() {
  return (
    <div className="flex-1 bg-gray-50">
      <PageContainer className="max-w-3xl space-y-8 py-10">
        <h1 className="text-xl font-bold md:text-2xl">プライバシーポリシー</h1>

        <div className="space-y-8">
          {PRIVACY_SECTIONS.map((section) => (
            <LegalSection key={section.title} title={section.title}>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </LegalSection>
          ))}
        </div>

        <p className="text-xs text-weak">制定日: {LEGAL_ESTABLISHED_DATE}</p>
      </PageContainer>
    </div>
  )
}

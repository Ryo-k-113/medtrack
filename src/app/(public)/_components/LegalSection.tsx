type LegalSectionProps = {
  title: string
  children: React.ReactNode
}

// 利用規約・プライバシーポリシーの各条項
export const LegalSection = ({ title, children }: LegalSectionProps) => (
  <section className="space-y-2 border-b pb-8 last:border-b-0 last:pb-0">
    <h2 className="font-bold">{title}</h2>
    <div className="space-y-2 text-sm leading-relaxed text-weak">{children}</div>
  </section>
)

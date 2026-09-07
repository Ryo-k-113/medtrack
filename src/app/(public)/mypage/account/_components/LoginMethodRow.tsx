type LoginMethodRowProps = {
  title: string
  email: string | null
  action?: React.ReactNode
  description?: React.ReactNode
}

// ログイン方法ごとの見出し・登録状況・操作ボタンを並べる行
export const LoginMethodRow = ({
  title,
  email,
  action,
  description,
}: LoginMethodRowProps) => {
  return (
    <section className="space-y-2 border-b pb-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-bold">{title}</h3>
        {action}
      </div>

      <p className={email ? "text-sm" : "text-sm text-weak"}>
        {email ?? "未設定"}
      </p>

      {description && <div className="text-xs text-weak">{description}</div>}
    </section>
  )
}

import { useId } from "react"
import { Figtree } from "next/font/google"
import { cn } from "@/lib/utils"

// ロゴのサービス名にだけ使う書体（本文は Noto Sans JP のまま）
const figtree = Figtree({ weight: "800", subsets: ["latin"], display: "swap" })

/** アイコンの配色（背景の色に合わせて切り替える） */
const ICON_COLORS = {
  // 白い背景用：ファビコン（src/app/icon.svg）と同じ配色
  default: { base: "#2277b4", left: "#ffffff", right: "#bfe0f5" },
  // 青い背景用（フッターなど）：土台を白にして背景に埋もれないようにする
  inverse: { base: "#ffffff", left: "#2277b4", right: "#8ec3e6" },
} as const

type LogoProps = {
  variant?: keyof typeof ICON_COLORS
  className?: string
}

/** サービスのロゴ（アイコン＋サービス名）。大きさは親の文字サイズに合わせる */
export const Logo = ({ variant = "default", className }: LogoProps) => {
  // 同じページに複数置いても clipPath の id が重ならないようにする
  const clipId = useId()
  const colors = ICON_COLORS[variant]

  return (
    <span
      className={cn(
        "flex w-fit items-center gap-2",
        variant === "default" ? "text-primary" : "text-white",
        className,
      )}
    >
      <svg viewBox="0 0 64 64" className="size-[1.15em] shrink-0" aria-hidden="true">
        <rect width="64" height="64" rx="14" fill={colors.base} />
        <g transform="rotate(-45 32 32)">
          <clipPath id={clipId}>
            <rect x="11" y="21" width="42" height="22" rx="11" />
          </clipPath>
          <g clipPath={`url(#${clipId})`}>
            <rect x="11" y="21" width="21" height="22" fill={colors.left} />
            <rect x="32" y="21" width="21" height="22" fill={colors.right} />
          </g>
        </g>
      </svg>
      <span className={cn(figtree.className, "leading-none tracking-[-0.02em]")}>MedTrack</span>
    </span>
  )
}

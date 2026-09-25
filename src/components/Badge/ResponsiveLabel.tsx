type ResponsiveLabelProps = {
  /** モバイル表記（「後」「沢井」など） */
  short: string
  /** md以上と読み上げの表記（「後発品」「沢井製薬」など） */
  full: string
}

/**
 * モバイルでは,略語、md以上では正式な表記を出す
 */
export const ResponsiveLabel = ({ short, full }: ResponsiveLabelProps) => {
  // 短い表記が正式な表記と同じなら、切り替えずにそのまま出す
  if (short === full) return <>{full}</>

  return (
    <>
      <span className="md:hidden" aria-hidden="true">{short}</span>
      <span className="sr-only md:not-sr-only">{full}</span>
    </>
  )
}

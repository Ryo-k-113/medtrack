/**
 * 包装詳細ページは、初めてアクセスされたときに HTML を作り、以降は CDN から返す
 * page.tsx は "use client" のため、配信の設定だけをこのレイアウトに置く
 */
export const generateStaticParams = async () => []

const PackageDetailLayout = ({ children }: { children: React.ReactNode }) => children

export default PackageDetailLayout

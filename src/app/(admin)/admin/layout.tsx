'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

//icon
import { Upload } from 'lucide-react';
import { Pill } from 'lucide-react';
import { File } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isSelected = (href: string) => {
    return pathname.includes(href)
  }

  return (
    <div className='flex h-screen'>
      {/* サイドバー */}
      <aside className="bg-surface w-70 shrink-0">
        <h1 className="text-3xl font-bold text-primary text-center px-4 pt-4 pb-6">MedTrack</h1>
          <Link
            href="/admin/drug-list"
            className={`flex p-4 items-center gap-1 font-bold text-foreground hover:bg-primary hover:text-primary-foreground ${
              isSelected('/admin/drug-list') && 'bg-primary text-primary-foreground'
            }`}
          >
            <Pill className="w-4 h-4" strokeWidth={2.5} />
            医薬品一覧
          </Link>
          <Link
            href="/admin/drug-list"
            className={`flex p-4 items-center gap-1 font-bold text-foreground hover:bg-primary hover:text-primary-foreground ${
              isSelected('/admin/drug-list') && 'bg-primary text-primary-foreground'
            }`}
          >
            <Upload className="w-4 h-4" strokeWidth={2.5} />
            データアップロード
          </Link>
          <Link
            href="/admin/draft"
            className={`flex p-4 items-center gap-1 font-bold text-foreground hover:bg-primary hover:text-primary-foreground ${
              isSelected('/admin/draft') && 'bg-primary text-primary-foreground'
            }`}
          >
            <File className="w-4 h-4" strokeWidth={2.5} />
            下書き一覧
          </Link>

      </aside>

      {/* メインエリア */}
      <div className="flex-1 overflow-x-auto p-6">
        {children}
      </div>
    </div>
  )
}
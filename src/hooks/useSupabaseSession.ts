"use client"

import { createClient } from '@/lib/supabase/client';
import { Session } from '@supabase/supabase-js';
import { usePathname } from 'next/navigation'
import { useState, useEffect, useMemo } from 'react'


export const useSupabaseSession = () => {

  const supabase = useMemo(() => createClient(), [])

  // undefined: ログイン状態ロード中, null: ログインしていない, Session: ログインしている
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [token, setToken] = useState<string | null>(null)
  const pathname = usePathname()
  
  //初回とページ遷移時に実行
  useEffect(() => {
    const fetcher = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setSession(session)
      setToken(session?.access_token || null)
    }

    fetcher()
  }, [pathname,supabase])

  // セッション自動更新の監視
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setToken(session?.access_token || null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return { session, isLoading: session === undefined, token }
}
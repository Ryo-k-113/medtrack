"use server";
import 'server-only';

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from 'next/cache'
import { FormData } from '@/app/schemas/authSchema';



// Googleログイン
export const signInWithGoogle = async () => {
    const supabase = await createClient();
    const { data: { url }, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${process.env.SUPABASE_AUTH_URL}/api/auth/callback`,
        },
    });
    if (error || !url) {
      throw new Error("Googleログインができませんでした")
    }
    redirect(url);
}

// ログアウト
export const signOut = async () => {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut(); 
    if (error) {
      console.error('ログアウトエラー:', error.message)
      throw new Error("ログアウトに失敗しました");
    }
}

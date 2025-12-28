"use server";
import 'server-only';

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";


// Googleログイン
export const signInWithGoogle = async () => {
    const supabase = await createClient();
    const { data: { url }, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${process.env.SUPABASE_AUTH_URL}/api/auth/callback`,
        },
    });
    if (error) console.error('Googleログインエラー:', error.message)
    if (!error && url) redirect(url);
}

// ログアウト
export const signOut = async () => {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) console.error('ログアウトエラー:', error.message)
    if (!error) return true;
    return false;
}

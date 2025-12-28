"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";


// Googleログイン
export const signInWithGoogle = async () => {
    // クライアントを作成
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



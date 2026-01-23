"use server";
import 'server-only';

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from 'next/cache'
import { FormData } from '@/app/(auth)/_schemas/authSchema';

type AuthResult = {
  success: boolean;
  message: string;
};

//新規登録
export const signupHandler = async(formData: FormData ): Promise <AuthResult> => { 
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,      
      options: {
      emailRedirectTo: "http://localhost:3000/login",
      },
  })

  if (error) {
    if (error.message.includes("already")) {
      return {
          success: false,
          message: "すでに登録されているメールアドレスです",
        };
    }
  
    return {
      success: false,
      message: "登録に失敗しました",
    };
  }

  return { 
    success: true,
    message: "確認メールを送信しました",
  };
}

//パスワードでログイン
export const loginHandler = async ( formData: FormData ): Promise < AuthResult | void > => {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  })
  
  if(error) {
    return {
      success: false,
      message: "メールアドレスまたはパスワードが異なります",
    };
  }
  revalidatePath('/', 'layout')
  redirect("/")

}


// Googleログイン
export const signInWithGoogle = async () => {
    const supabase = await createClient();
    const { data: { url }, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: "http://localhost:3000/auth/callback",
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

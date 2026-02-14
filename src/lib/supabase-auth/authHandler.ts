"use client"

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { createClient } from "@/lib/supabase/client";
import { FormData } from "@/app/(public)/(auth)/_schemas/authSchema";
import { toast } from "sonner";

//ログイン
export const loginHandler = async ( formData: FormData, router: AppRouterInstance ) => {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  })
  
  if(error) {
    toast.error("メールアドレスまたはパスワードが異なります。");
    return;
  }

  try {
  // セッションからアクセストークンを取得
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) {
      throw new Error('セッション取得エラー');
    }

    // ユーザーの確認と作成
    const res = await fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });

    if (res.ok) {
      // ホームページにリダイレクト
      router.replace("/");
      toast.success("ログインに成功しました。");
    }

  } catch (error) {
    console.error( "ログイン処理中にエラーが発生しました", error);
    toast.error("エラーが発生しました");
  } 
}

//新規登録
export const signupHandler = async (formData: FormData, reset: () => void) => {
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/login`,
      },
    });

    if (error) {
      let errorMessage = "認証エラーが発生しました。";
      if (error.message.includes("already")) {
        errorMessage = "すでに登録されているメールアドレスです。";
      }
      toast.error(errorMessage);
      return;
    }

    toast.success(
      "登録確認メールを送信しました。"
    );

    reset();
    
  } catch (error) {
    console.error("サインアップ処理中にエラーが発生しました:", error);
    toast.error("処理中にエラーが発生しました。もう一度お試しください。");
  }
};
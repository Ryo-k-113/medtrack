
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";


export default function OAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const postUser = async () => {
      const supabase = createClient();

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session?.access_token) {
        toast.error("ログインに失敗しました");
        router.replace("/login");
        return;
      }

      // フォームログインと同じ API を呼ぶ
      await fetch("/api/user", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      router.replace("/");
    };

    postUser();

  }, []);

  return (
    <div className="h-screen flex justify-center items-center" aria-label="読み込み中">
      <div className="animate-ping h-2 w-2 bg-primary rounded-full"></div>
      <div className="animate-ping h-2 w-2 bg-primary rounded-full mx-4"></div>
      <div className="animate-ping h-2 w-2 bg-primary rounded-full"></div>
    </div>
  )
}

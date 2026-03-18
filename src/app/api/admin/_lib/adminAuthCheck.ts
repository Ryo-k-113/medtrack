
import { NextRequest } from 'next/server';
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export type AuthResult =
  | { isAuthorized: true; error: null; status: 200 }
  | { isAuthorized: false; error: string; status: 401 | 403 };


/**
 * ログイン確認 ＋ 管理者権限チェック
 */

export const adminAuthCheck = async(request: NextRequest) => {
  const supabase =  await createClient();
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  //認証チェック
  const { 
    data: { user }, 
    error 
  } = await supabase.auth.getUser(token);


  if (error || !user) {
    return { isAuthorized: false, error: "認証が必要です", status: 401 };
  }

  //role確認
  const loginUser = await prisma.user.findUnique({
    where: { 
      supabaseUserId: user.id 
    },
    select: { 
      role: true 
    }
  });

  if (!loginUser || loginUser.role !== "ADMIN") {
    return { isAuthorized: false, error: "管理者権限がありません", status: 403 };
  }

  return { isAuthorized: true, error: null, status: 200 };
}
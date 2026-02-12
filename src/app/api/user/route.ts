import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client"
import { prisma } from "@/lib/prisma";


// ユーザーの確認と作成するAPIエンドポイント
export const POST = async (request: NextRequest) => {
  const supabase = await createClient();
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ error: 'トークンが見つかりません' }, { status: 401 });
  }
  
  try {
    const { data, error } = await supabase.auth.getUser(token);
    
    // 認証エラーがあればリターン
    if (error || !data.user){
      return NextResponse.json({ error: "認証されていません"}, { status: 401 });
    }
    
    // ユーザーがDBになければ登録
    await prisma.user.upsert({
      where: { supabaseUserId: data.user.id },
      create: {
        supabaseUserId: data.user.id,
        email: data.user.email!
      },
      update: {}
    });

    // 成功レスポンスを返す
    return NextResponse.json({ status: "OK" },{ status: 201 });
    
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ error: error.message }, { status: 400 });
  }
};
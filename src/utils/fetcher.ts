type FetcherProps = {
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: Record<string, unknown>;
  token?: string | null;
};

/**
 * アプリケーション共通のAPIクライアント
 *  @param url - APIエンドポイントパス
 *  @param method? - HTTPメソッド (GET, POST, PUT, DELETE等)
 *  @param body? - リクエストボディ（オブジェクトで渡すと自動でJSON.stringify）
 *  @param token? - アクセストークン（認証が必要なAPI用）
 *  @returns パース済みのJSONデータ
 *  @throws {Error} - HTTPステータスが200以外は、APIが返したエラーメッセージを自動でパースして `throw`
 **/


export const fetcher = async ({
  url,
  method = "GET",
  body,
  token,
}: FetcherProps) => {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message)
    }

    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
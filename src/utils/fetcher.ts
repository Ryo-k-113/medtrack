type FetcherProps = {
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: Record<string, unknown>;
};

/**
 * アプリケーション共通のAPIクライアント
 * 認証はCookieのセッションで行われる
 *  @param url - APIエンドポイントパス
 *  @param method? - HTTPメソッド (GET, POST, PUT, DELETE等)
 *  @param body? - リクエストボディ（オブジェクトで渡すと自動でJSON.stringify）
 *  @returns パース済みのJSONデータ
 *  @throws {Error} - HTTPステータスが200以外は、APIが返したエラーメッセージを自動でパースして `throw`
 **/


export const fetcher = async ({
  url,
  method = "GET",
  body,
}: FetcherProps) => {
  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
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
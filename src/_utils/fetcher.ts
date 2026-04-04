type FetcherProps = {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: Record<string, unknown>;
  token?: string | null;
};

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

    if (!res.ok) throw new Error("APIリクエストに失敗しました。");

    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
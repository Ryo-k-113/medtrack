export const COOKIE_OPTIONS = {
  //JSでCookieを読めなくなる(XSS対策)
    httpOnly: true,
  // 本番環境ではHTTPS通信のみCookie送信
    secure: process.env.NODE_ENV === "production",
  // 別サイトからの不正リクエストを抑制するCSRF対策
    sameSite: "lax" as const,
  };
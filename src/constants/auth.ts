/** ログイン後に戻る先を渡すクエリパラメータ */
export const REDIRECT_TO_QUERY_KEY = "redirectTo"

/** 戻り先が指定されていない場合の遷移先 */
export const DEFAULT_REDIRECT_PATH = "/"

/**
 * ログイン後の遷移先を確定する
 * 外部サイトへ誘導されないよう、アプリ内のパスのみ許可する
 * @param path - 受け取った遷移先
 */
export const resolveRedirectPath = (path: string | null | undefined): string =>
  path?.startsWith("/") && !path.startsWith("//") ? path : DEFAULT_REDIRECT_PATH


/**
 * Googleログインの戻り先を一時的に保持するCookie名
 * 認証中は外部サイトへ遷移するため、URLではなくCookieで引き継ぐ
 */
export const OAUTH_REDIRECT_COOKIE = "oauth-redirect-to"

/** 上記Cookieの有効期間（秒）。認証を終えるまでの間だけ保持する */
export const OAUTH_REDIRECT_MAX_AGE = 600

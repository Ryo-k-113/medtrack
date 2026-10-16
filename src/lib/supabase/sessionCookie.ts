/**
 * Supabase のログイン情報の Cookie かを判定する
 */

const SESSION_COOKIE_NAME = /^sb-.+-auth-token(?:\.\d+)?$/;

export const isSupabaseSessionCookie = ({ name }: { name: string }) =>
  SESSION_COOKIE_NAME.test(name);

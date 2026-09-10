/** 確認リンクから戻った際の通知を受け取るクエリパラメータ */
export const NOTICE_QUERY_KEY = "notice"

/**
 * 通知の内容
 * URLではキーのみを受け渡し
 */
export const NOTICE = {
  loginSucceeded: { type: "success", message: "ログインに成功しました。" },
  loginFailed: { type: "error", message: "ログインに失敗しました。" },
  signupConfirmed: { type: "success", message: "登録が完了しました。" },
  emailChanged: { type: "success", message: "メールアドレスを変更しました。" },
  confirmFailed: {
    type: "error",
    message: "確認リンクが無効か、有効期限が切れています。",
  },
} as const

export type NoticeKey = keyof typeof NOTICE

/** 未知のキーで通知が出ないよう、定義済みのキーかを判定する */
export const isNoticeKey = (key: string): key is NoticeKey => key in NOTICE

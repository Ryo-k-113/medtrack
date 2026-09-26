"use client"

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import {
  SignupPromptActions,
  SignupPromptBenefits,
  SignupPromptTitle,
} from "@/components/auth/SignupPrompt"

type SignupPromptDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
}

/**
 * 無料登録の案内をダイアログで表示する
 * 未ログインで会員向けの操作をしたときに、その場で登録へ進めるようにする
 * 見出しをダイアログの見出し、機能一覧をダイアログの説明として読み上げに伝える
 */
export const SignupPromptDialog = ({ open, onOpenChange, title }: SignupPromptDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-sm rounded-2xl md:max-w-[480px]">
      <DialogTitle>
        <SignupPromptTitle title={title} />
      </DialogTitle>

      <div className="space-y-4 md:px-10">
        <DialogDescription asChild>
          <SignupPromptBenefits />
        </DialogDescription>
        <SignupPromptActions />
      </div>
    </DialogContent>
  </Dialog>
)

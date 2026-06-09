"use client"
import { Button } from "@/components/ui/button"
import { Trash2, Save } from "lucide-react"
import { useFormContext } from "react-hook-form"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"


type DrugEditActionsProps = {
  onDelete?: () => Promise<void>
  isDeleting?: boolean
}

export const DrugEditActions = ({ 
  onDelete,
  isDeleting,
}: DrugEditActionsProps) => {

  const { 
    formState: { isSubmitting , isDirty}, 
    getValues 
  } = useFormContext()

  // 製品名を取得
  const drugName = getValues("name") 

  return (
    <div className="flex justify-end items-center">
      <div className="flex items-center gap-4">

      {/*  削除ボタン */}
      {onDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting || isDeleting}
                className="hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="h-4 w-4" />
                製品を削除する
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {drugName}を削除しますか？
                  </AlertDialogTitle>
                <AlertDialogDescription
                  className="text-foreground"
                >
                製品に紐づく全ての包装・告示履歴も削除されます。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel 
                  disabled={isSubmitting || isDeleting}
                  className="hover:bg-muted/70"
                  >
                  キャンセル
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  disabled={isSubmitting || isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  <Trash2 className="h-4 w-4" />
                  {isDeleting ? "削除中..." : "削除する"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {/* 保存ボタン */}
        <Button 
          type="submit"
          variant="accent"
          disabled={isSubmitting}
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? "保存中..." : "保存する"}
        </Button>
      </div>
    </div>
  )
}
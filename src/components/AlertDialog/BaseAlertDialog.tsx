" use client"
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

type BaseAlertDialogProps = {
  trigger: React.ReactNode
  title: string
  description: string
  cancelLabel?: string
  actionLabel: string
  onAction: () => void | Promise<void>
  isLoading?: boolean
  actionClassName?: string
}

export const BaseAlertDialog = ({
  trigger,
  title,
  description,
  cancelLabel = "キャンセル",
  actionLabel,
  onAction,
  isLoading = false,
  actionClassName,
}: BaseAlertDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading} className="hover:bg-surface hover:text-foreground">
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onAction}
            disabled={isLoading}
            className={actionClassName}
          >
            {isLoading ? "処理中..." : actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
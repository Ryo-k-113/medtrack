"use client"
import { Button } from "@/components/ui/button"
import { Trash2, Save } from "lucide-react"
import { useFormContext } from "react-hook-form"


type DrugEditActionsProps = {
  onDelete?: () => Promise<void>
}

export const DrugEditActions = ({ onDelete }: DrugEditActionsProps) => {
  const { formState: { isSubmitting } } = useFormContext()

  return (
    <div className="flex justify-end items-center">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
          製品を削除する
        </Button>
        <Button
          type="submit"
          variant="accent"
          disabled={isSubmitting}
        >
          <Save className="h-4 w-4" />
          保存する
        </Button>
      </div>
    </div>
  )
}
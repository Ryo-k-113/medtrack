"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"


type BaseDialogProps = {
  isOpen: boolean
  onClose: () => void 
  title: string
  description?: string
  children: React.ReactNode
  actions?: React.ReactNode  
  className?: string
}

export const BaseDialog = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  actions,
  className,
}: BaseDialogProps) => {
  return (
   
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) onClose()
        }}
        modal={false}
      >
        {isOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/70"
            onClick={onClose}
          />
        )}

        <DialogContent className={cn("z-50", className)}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {description ?? ""}
            </DialogDescription>
          </DialogHeader>

          {children}

          {actions && (
            <DialogFooter>
              {actions}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
  )
}
"use client"

import {
  CircleCheck,
  Info,
  LoaderCircle,
  OctagonX,
  TriangleAlert,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheck className="h-4 w-4" />,
        info: <Info className="h-4 w-4" />,
        warning: <TriangleAlert className="h-4 w-4" />,
        error: <OctagonX className="h-4 w-4" />,
        loading: <LoaderCircle className="h-4 w-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-background group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-weak",
          actionButton:
            "group-[.toast]:!bg-background group-[.toast]:!text-weak group-[.toast]:!border group-[.toast]:!border-solid group-[.toast]:!border-border group-[.toast]:!rounded-md group-[.toast]:!font-bold",
          cancelButton:
            "group-[.toast]:!bg-background group-[.toast]:!text-weak group-[.toast]:!border group-[.toast]:!border-solid group-[.toast]:!border-border group-[.toast]:!rounded-full",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

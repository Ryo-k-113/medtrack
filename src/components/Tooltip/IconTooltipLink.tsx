import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type IconTooltipLinkProps = {
  href: string
  icon: LucideIcon
  tooltipText: string
  ariaLabel?: string
  external?: boolean
  className?: string
}

export const IconTooltipLink = ({
  href,
  icon: Icon,
  tooltipText,
  ariaLabel,
  external = true,
  className = "text-weak hover:text-primary transition-colors",
}: IconTooltipLinkProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            aria-label={ariaLabel ?? tooltipText}
            className={className}
          >
            <Icon className="h-5 w-5" />
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
import { Loader2Icon } from 'lucide-react'
import { cn } from '~/lib/utils'
import { Button, ButtonProps } from './ui/button'

interface LoaderButtonProps extends ButtonProps {
  isLoading: boolean
}

export function LoaderButton({
  children,
  isLoading,
  className,
  ...props
}: LoaderButtonProps): React.ReactElement<React.FC> {
  return (
    <Button
      className={cn('flex justify-center gap-2 px-3', className)}
      disabled={isLoading}
      {...props}
    >
      {isLoading && <Loader2Icon className="h-4 w-4 animate-spin" />}
      {children}
    </Button>
  )
}

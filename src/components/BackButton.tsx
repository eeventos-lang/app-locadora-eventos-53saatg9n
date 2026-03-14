import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface BackButtonProps {
  className?: string
  onClick?: () => void
  label?: string
}

export function BackButton({ className, onClick, label = 'Voltar' }: BackButtonProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onClick) {
      onClick()
    } else {
      navigate(-1)
    }
  }

  return (
    <Button
      variant="ghost"
      onClick={handleBack}
      className={cn(
        'gap-1 pl-2.5 hover:bg-secondary text-muted-foreground hover:text-foreground',
        className,
      )}
      aria-label={label}
    >
      <ChevronLeft className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </Button>
  )
}

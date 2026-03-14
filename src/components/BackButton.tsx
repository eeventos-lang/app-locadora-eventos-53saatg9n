import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface BackButtonProps {
  className?: string
  onClick?: () => void
  label?: string
}

export function BackButton({ className, onClick, label }: BackButtonProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onClick) {
      onClick()
    } else {
      navigate(-1)
    }
  }

  return (
    <button
      onClick={handleBack}
      className={cn(
        'flex items-center justify-center min-w-[44px] min-h-[44px] rounded-full text-muted-foreground hover:text-white hover:bg-white/10 transition-colors active:scale-95 px-2',
        className,
      )}
      aria-label={label || 'Voltar'}
    >
      <ArrowLeft className="w-6 h-6" />
      {label && <span className="ml-1 text-sm font-medium">{label}</span>}
    </button>
  )
}

import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import logoImg from '@/assets/e-eventos-novo-62817.png'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <img
        src={logoImg}
        alt="e-eventos"
        className="h-24 w-24 rounded-[1.5rem] object-contain mb-8 opacity-50 grayscale"
      />
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Página não encontrada</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        A página que você está procurando pode ter sido removida, teve seu nome alterado ou está
        temporariamente indisponível.
      </p>
      <Button asChild size="lg">
        <Link to="/">Voltar para o Início</Link>
      </Button>
    </div>
  )
}

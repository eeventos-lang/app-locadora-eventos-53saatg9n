import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import logoImg from '@/assets/e-eventos-novo-62817.png'

export default function Register() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md mx-auto shadow-lg border-primary/10">
        <CardHeader className="space-y-4 flex flex-col items-center text-center pt-8">
          <Link to="/" className="transition-transform hover:scale-105">
            <img
              src={logoImg}
              alt="e-eventos"
              className="h-24 w-24 rounded-[1.5rem] object-contain shadow-md"
            />
          </Link>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-extrabold tracking-tight">Criar Conta</CardTitle>
            <CardDescription className="text-base">
              Junte-se ao e-eventos e comece agora
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input id="name" type="text" placeholder="João Silva" required className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@exemplo.com" required className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" required className="h-11" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pb-8">
          <Button className="w-full h-11 text-md">Cadastrar</Button>
          <div className="text-sm text-center text-muted-foreground">
            Já tem uma conta?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Fazer login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

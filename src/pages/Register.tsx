import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { User, Briefcase, Loader2 } from 'lucide-react'

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from 'sonner'
import { useApp } from '@/store/AppContext'
import { SERVICES } from '@/lib/services'

import logoImg from '@/assets/e-eventos-novo-62817.png'
import { cn } from '@/lib/utils'

const formSchema = z
  .object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    email: z.string().email('Email inválido. Verifique o formato.'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
    role: z.enum(['customer', 'company'], {
      required_error: 'Por favor, selecione o tipo de perfil.',
    }),
    sectors: z.array(z.string()).default([]),
  })
  .superRefine((data, ctx) => {
    if (data.role === 'company' && data.sectors.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Selecione pelo menos uma área de atuação.',
        path: ['sectors'],
      })
    }
  })

type FormValues = z.infer<typeof formSchema>

export default function Register() {
  const navigate = useNavigate()
  const { registerUser } = useApp()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: undefined,
      sectors: [],
    },
  })

  async function onSubmit(data: FormValues) {
    setIsLoading(true)
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        sectors: data.sectors,
      })
      toast.success('Conta criada com sucesso! Faça seu login.')
      navigate('/login')
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-12 px-4">
      <Card className="w-full max-w-lg mx-auto shadow-lg border-primary/10">
        <CardHeader className="space-y-4 flex flex-col items-center text-center pt-8">
          <Link to="/" className="transition-transform hover:scale-105">
            <img
              src={logoImg}
              alt="e-eventos"
              className="h-24 w-24 rounded-[1.5rem] object-contain shadow-md bg-white/5 p-2 border border-white/10"
            />
          </Link>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-extrabold tracking-tight">Criar Conta</CardTitle>
            <CardDescription className="text-base">
              Junte-se ao e-eventos e comece agora
            </CardDescription>
          </div>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <Input placeholder="João Silva" className="h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="m@exemplo.com" className="h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" className="h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Tipo de Perfil</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col sm:flex-row gap-3"
                      >
                        <FormItem className="flex-1 space-y-0">
                          <FormControl>
                            <div className="relative">
                              <RadioGroupItem
                                value="customer"
                                id="role-customer"
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor="role-customer"
                                className={cn(
                                  'flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background cursor-pointer transition-all gap-2',
                                  field.value === 'customer'
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'text-muted-foreground',
                                )}
                              >
                                <User
                                  className={cn(
                                    'h-6 w-6 mb-1',
                                    field.value === 'customer' ? 'text-primary' : '',
                                  )}
                                />
                                <span
                                  className={cn(
                                    'font-semibold text-sm',
                                    field.value === 'customer'
                                      ? 'text-foreground'
                                      : 'text-foreground/80',
                                  )}
                                >
                                  Cliente
                                </span>
                              </Label>
                            </div>
                          </FormControl>
                        </FormItem>

                        <FormItem className="flex-1 space-y-0">
                          <FormControl>
                            <div className="relative">
                              <RadioGroupItem
                                value="company"
                                id="role-company"
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor="role-company"
                                className={cn(
                                  'flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background cursor-pointer transition-all gap-2',
                                  field.value === 'company'
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'text-muted-foreground',
                                )}
                              >
                                <Briefcase
                                  className={cn(
                                    'h-6 w-6 mb-1',
                                    field.value === 'company' ? 'text-primary' : '',
                                  )}
                                />
                                <span
                                  className={cn(
                                    'font-semibold text-sm',
                                    field.value === 'company'
                                      ? 'text-foreground'
                                      : 'text-foreground/80',
                                  )}
                                >
                                  Fornecedor
                                </span>
                              </Label>
                            </div>
                          </FormControl>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage className="text-destructive font-medium" />
                  </FormItem>
                )}
              />

              {form.watch('role') === 'company' && (
                <FormField
                  control={form.control}
                  name="sectors"
                  render={({ field }) => (
                    <FormItem className="space-y-3 animate-fade-in pt-2">
                      <FormLabel>Áreas de Atuação</FormLabel>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[220px] overflow-y-auto p-1">
                        {SERVICES.map((s) => {
                          const isSelected = field.value.includes(s.id)
                          return (
                            <div
                              key={s.id}
                              className={cn(
                                'border rounded-xl p-3 cursor-pointer flex flex-col items-center gap-2 transition-all',
                                isSelected
                                  ? 'bg-primary/10 border-primary text-foreground shadow-sm'
                                  : 'bg-card border-border text-muted-foreground hover:bg-card/80',
                              )}
                              onClick={() => {
                                const val = field.value || []
                                if (val.includes(s.id))
                                  field.onChange(val.filter((v: string) => v !== s.id))
                                else field.onChange([...val, s.id])
                              }}
                            >
                              <s.icon className={cn('w-6 h-6', isSelected ? s.color : '')} />
                              <span className="text-[10px] sm:text-xs font-semibold text-center leading-tight">
                                {s.label}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                      <FormMessage className="text-destructive font-medium" />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pb-8">
              <Button type="submit" className="w-full h-11 text-md" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  'Cadastrar'
                )}
              </Button>
              <div className="text-sm text-center text-muted-foreground">
                Já tem uma conta?{' '}
                <Link to="/login" className="font-semibold text-primary hover:underline">
                  Fazer login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}

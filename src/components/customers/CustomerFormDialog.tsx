import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useApp } from '@/store/AppContext'
import { toast } from 'sonner'
import { formatCPF, formatCEP, formatPhone } from '@/lib/formatters'

const clientSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'Formato: 000.000.000-00'),
  rg: z.string().min(2, 'RG é obrigatório'),
  cep: z.string().regex(/^\d{5}-\d{3}$/, 'Formato: 00000-000'),
  address: z.string().min(5, 'Endereço é obrigatório'),
  phone: z.string().min(14, 'Telefone inválido'),
})

type ClientFormValues = z.infer<typeof clientSchema>

export function CustomerFormDialog({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { addClientCRM } = useApp()
  const [isLoadingCep, setIsLoadingCep] = useState(false)
  const lastFetchedCep = useRef('')

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: { name: '', email: '', cpf: '', rg: '', cep: '', address: '', phone: '' },
  })

  const cepValue = form.watch('cep')

  useEffect(() => {
    const cleanCep = cepValue?.replace(/\D/g, '') || ''
    if (cleanCep.length === 8 && cleanCep !== lastFetchedCep.current) {
      const fetchCep = async () => {
        setIsLoadingCep(true)
        lastFetchedCep.current = cleanCep
        try {
          const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
          const data = await res.json()
          if (!data.erro) {
            form.setValue(
              'address',
              `${data.logradouro}, Número, ${data.bairro}, ${data.localidade} - ${data.uf}`,
            )
            form.trigger('address')
            toast.success('Endereço preenchido automaticamente.')
          } else {
            toast.error('CEP não encontrado.')
          }
        } catch (err) {
          toast.error('Erro ao buscar informações do CEP.')
        } finally {
          setIsLoadingCep(false)
        }
      }
      fetchCep()
    }
  }, [cepValue, form])

  const onSubmit = (values: ClientFormValues) => {
    addClientCRM(values)
    toast.success('Cliente cadastrado com sucesso!')
    onOpenChange(false)
    form.reset()
  }

  const renderInput = (
    name: keyof ClientFormValues,
    label: string,
    placeholder: string,
    formatFn?: (val: string) => string,
    colSpan?: boolean,
    extra?: React.ReactNode,
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={colSpan ? 'md:col-span-2' : ''}>
          <FormLabel className="flex items-center gap-2">
            {label} {extra}
          </FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              onChange={(e) => field.onChange(formatFn ? formatFn(e.target.value) : e.target.value)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastro de Cliente</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderInput('name', 'Nome Completo', 'Ex: João da Silva', undefined, true)}
              {renderInput('cpf', 'CPF', '000.000.000-00', formatCPF)}
              {renderInput('rg', 'RG', 'Ex: MG-12.345.678')}
              {renderInput(
                'cep',
                'CEP',
                '00000-000',
                formatCEP,
                false,
                isLoadingCep && <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />,
              )}
              {renderInput('phone', 'Telefone', '(00) 00000-0000', formatPhone)}
              {renderInput('address', 'Endereço Completo', 'Rua, Número, Bairro', undefined, true)}
              {renderInput('email', 'E-mail', 'cliente@exemplo.com', undefined, true)}
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-border mt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="px-8 shadow-sm">
                Salvar Cliente
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

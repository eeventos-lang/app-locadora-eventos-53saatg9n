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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useApp } from '@/store/AppContext'
import { toast } from 'sonner'
import { formatCEP, formatPhone } from '@/lib/formatters'
import { SERVICES } from '@/lib/services'

const supplierSchema = z.object({
  name: z.string().min(2, 'Nome/Razão Social é obrigatório'),
  email: z.string().email('E-mail inválido'),
  cnpjCpf: z.string().min(14, 'CNPJ/CPF inválido'),
  stateRegistration: z.string().optional(),
  phone: z.string().min(14, 'Telefone inválido'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  cep: z.string().regex(/^\d{5}-\d{3}$/, 'Formato: 00000-000'),
  street: z.string().min(2, 'Rua é obrigatória'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Estado deve ter 2 letras'),
})

type SupplierFormValues = z.infer<typeof supplierSchema>

export function SupplierFormDialog({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { addSupplierCRM } = useApp()
  const [isLoadingCep, setIsLoadingCep] = useState(false)
  const lastFetchedCep = useRef('')

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: '',
      email: '',
      cnpjCpf: '',
      stateRegistration: '',
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      phone: '',
      category: '',
    },
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
            form.setValue('street', data.logradouro)
            form.setValue('neighborhood', data.bairro)
            form.setValue('city', data.localidade)
            form.setValue('state', data.uf)
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

  const onSubmit = (values: SupplierFormValues) => {
    addSupplierCRM({
      ...values,
      complement: values.complement || '',
      stateRegistration: values.stateRegistration || '',
    })
    toast.success('Fornecedor cadastrado com sucesso!')
    onOpenChange(false)
    form.reset()
  }

  const formatCnpjCpf = (val: string) => {
    const clean = val.replace(/\D/g, '')
    if (clean.length <= 11) {
      return clean
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1')
    }
    return clean
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }

  const renderInput = (
    name: keyof SupplierFormValues,
    label: string,
    placeholder: string,
    colSpan = false,
    onChangeTransform?: (val: string) => string,
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
              onChange={(e) =>
                field.onChange(
                  onChangeTransform ? onChangeTransform(e.target.value) : e.target.value,
                )
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastro de Fornecedor</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderInput('name', 'Nome / Razão Social', 'Ex: Silva Eventos LTDA', true)}
              {renderInput('cnpjCpf', 'CNPJ / CPF', '00.000.000/0000-00', false, formatCnpjCpf)}
              {renderInput('stateRegistration', 'Inscrição Estadual / RG', 'Opcional')}
              {renderInput('phone', 'Telefone', '(00) 00000-0000', false, formatPhone)}
              {renderInput('email', 'E-mail', 'contato@exemplo.com')}

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Categoria do Serviço</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SERVICES.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="md:col-span-2 border-t border-border pt-4 mt-2">
                <h4 className="text-sm font-semibold mb-4">Endereço</h4>
              </div>

              {renderInput(
                'cep',
                'CEP',
                '00000-000',
                false,
                formatCEP,
                isLoadingCep && <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />,
              )}
              <div className="hidden md:block"></div>
              {renderInput('street', 'Rua / Logradouro', 'Rua das Flores', true)}
              {renderInput('number', 'Número', '123')}
              {renderInput('complement', 'Complemento', 'Sala 2, Bloco B')}
              {renderInput('neighborhood', 'Bairro', 'Centro')}
              {renderInput('city', 'Cidade', 'São Paulo')}
              {renderInput('state', 'UF', 'SP', false, (v) => v.toUpperCase())}
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-border mt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="px-8 shadow-sm">
                Salvar Fornecedor
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

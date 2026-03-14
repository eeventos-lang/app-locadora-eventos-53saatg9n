import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Search, Plus, User, MapPin, Phone, Mail, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
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
import { cn } from '@/lib/utils'
import { Navigate } from 'react-router-dom'

const formatCPF = (val: string) =>
  val
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')

const formatCEP = (val: string) =>
  val
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1')

const formatPhone = (val: string) =>
  val
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1')

const clientSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve estar no formato 000.000.000-00'),
  rg: z.string().min(2, 'RG é obrigatório'),
  cep: z.string().regex(/^\d{5}-\d{3}$/, 'CEP deve estar no formato 00000-000'),
  address: z.string().min(5, 'Endereço é obrigatório'),
  phone: z.string().min(14, 'Telefone inválido'),
})

export default function Customers() {
  const { role, clientsCRM, addClientCRM, currentUser } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm<z.infer<typeof clientSchema>>({
    resolver: zodResolver(clientSchema),
    defaultValues: { name: '', email: '', cpf: '', rg: '', cep: '', address: '', phone: '' },
  })

  const myClients = useMemo(() => {
    return clientsCRM
      .filter(
        (c) =>
          c.supplierId === currentUser?.id &&
          (c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [clientsCRM, currentUser, searchTerm])

  if (role !== 'company') return <Navigate to="/" replace />

  const onSubmit = (values: z.infer<typeof clientSchema>) => {
    addClientCRM(values)
    toast.success('Cliente cadastrado com sucesso!')
    setIsDialogOpen(false)
    form.reset()
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto animate-slide-up pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <User className="w-8 h-8 text-primary" /> Meus Clientes
          </h1>
          <p className="text-muted-foreground mt-1">Gerencie a base de clientes do seu negócio.</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="w-full sm:w-auto shadow-sm h-11">
          <Plus className="w-4 h-4 mr-2" /> Novo Cliente
        </Button>
      </div>

      <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center gap-3">
        <Search className="w-5 h-5 text-muted-foreground shrink-0" />
        <Input
          placeholder="Buscar por nome ou e-mail..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-0 shadow-none focus-visible:ring-0 px-0 text-base"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myClients.length === 0 ? (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-secondary/30 border-2 border-dashed border-border rounded-xl">
            <User className="w-12 h-12 text-muted-foreground/50 mb-3" />
            <p className="font-semibold text-foreground">Nenhum cliente encontrado.</p>
            <p className="text-sm text-muted-foreground mb-4">
              Comece adicionando clientes para manter tudo organizado.
            </p>
            <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
              Adicionar Primeiro Cliente
            </Button>
          </div>
        ) : (
          myClients.map((client) => (
            <Card key={client.id} className="shadow-sm hover:shadow-md transition-shadow group">
              <CardContent className="p-5 flex flex-col h-full relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </Button>
                <h3 className="font-bold text-lg text-foreground pr-6 truncate">{client.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1 mb-4 truncate">
                  <Mail className="w-3.5 h-3.5" /> {client.email}
                </div>
                <div className="space-y-2 mt-auto">
                  <div className="flex items-center gap-2 text-sm bg-secondary/50 p-2 rounded-md">
                    <Phone className="w-4 h-4 text-primary shrink-0" />
                    <span className="truncate">{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm bg-secondary/50 p-2 rounded-md">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <span className="truncate">{client.address}</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
                  <span>CPF: {client.cpf}</span>
                  <span>RG: {client.rg}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cadastro de Cliente</DialogTitle>
            <DialogDescription>
              Preencha os dados completos para registrar um novo cliente na sua base.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: João da Silva" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="000.000.000-00"
                          {...field}
                          onChange={(e) => field.onChange(formatCPF(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RG</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: MG-12.345.678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cep"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="00000-000"
                          {...field}
                          onChange={(e) => field.onChange(formatCEP(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone / WhatsApp</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="(00) 00000-0000"
                          {...field}
                          onChange={(e) => field.onChange(formatPhone(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Endereço Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Rua, Número, Bairro, Cidade - UF" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="cliente@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
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
    </div>
  )
}

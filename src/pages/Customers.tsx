import { useState, useMemo } from 'react'
import { Plus, User, MapPin, Phone, Mail, Search, Fingerprint, History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useApp, ClientCRM } from '@/store/AppContext'
import { Navigate } from 'react-router-dom'
import { CustomerFormDialog } from '@/components/customers/CustomerFormDialog'
import { CustomerDetailsDialog } from '@/components/customers/CustomerDetailsDialog'

export default function Customers() {
  const { role, clientsCRM, currentUser } = useApp()
  const [filterName, setFilterName] = useState('')
  const [filterCpf, setFilterCpf] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<ClientCRM | null>(null)

  const myClients = useMemo(() => {
    return clientsCRM
      .filter((c) => {
        if (c.supplierId !== currentUser?.id) return false
        const matchName =
          filterName === '' || c.name.toLowerCase().includes(filterName.toLowerCase())
        const matchCpf =
          filterCpf === '' || c.cpf.replace(/\D/g, '').includes(filterCpf.replace(/\D/g, ''))
        return matchName && matchCpf
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [clientsCRM, currentUser, filterName, filterCpf])

  if (role !== 'company') return <Navigate to="/" replace />

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto animate-slide-up pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <User className="w-8 h-8 text-primary" /> Meus Clientes
          </h1>
          <p className="text-muted-foreground mt-1">Gerencie a base de clientes e histórico.</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="w-full sm:w-auto shadow-sm h-11">
          <Plus className="w-4 h-4 mr-2" /> Novo Cliente
        </Button>
      </div>

      <div className="bg-card p-4 rounded-xl border border-border shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Filtrar por Nome..."
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="pl-9 h-11"
          />
        </div>
        <div className="relative">
          <Fingerprint className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Filtrar por CPF..."
            value={filterCpf}
            onChange={(e) => setFilterCpf(e.target.value)}
            className="pl-9 h-11"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myClients.length === 0 ? (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-secondary/30 border-2 border-dashed border-border rounded-xl">
            <User className="w-12 h-12 text-muted-foreground/50 mb-3" />
            <p className="font-semibold text-foreground">Nenhum cliente encontrado.</p>
            <p className="text-sm text-muted-foreground mb-4">
              Revise os filtros de busca ou cadastre um novo cliente.
            </p>
          </div>
        ) : (
          myClients.map((client) => (
            <Card
              key={client.id}
              onClick={() => setSelectedClient(client)}
              className="shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group"
            >
              <CardContent className="p-5 flex flex-col h-full relative">
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
                <div className="mt-4 pt-3 border-t border-border flex justify-between items-center text-xs text-muted-foreground group-hover:text-primary transition-colors">
                  <span>CPF: {client.cpf}</span>
                  <span className="flex items-center gap-1 font-medium">
                    <History className="w-3.5 h-3.5" /> Ver Detalhes
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <CustomerFormDialog isOpen={isFormOpen} onOpenChange={setIsFormOpen} />
      <CustomerDetailsDialog client={selectedClient} onClose={() => setSelectedClient(null)} />
    </div>
  )
}

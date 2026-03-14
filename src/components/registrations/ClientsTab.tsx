import { useState, useMemo } from 'react'
import { Plus, Search, Fingerprint, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useApp, ClientCRM } from '@/store/AppContext'
import { CustomerFormDialog } from '@/components/customers/CustomerFormDialog'
import { CustomerDetailsDialog } from '@/components/customers/CustomerDetailsDialog'

export default function ClientsTab() {
  const { clientsCRM, currentUser } = useApp()
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Buscar por Nome..."
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="pl-9 bg-card h-11"
            />
          </div>
          <div className="relative">
            <Fingerprint className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Buscar por CPF..."
              value={filterCpf}
              onChange={(e) => setFilterCpf(e.target.value)}
              className="pl-9 bg-card h-11"
            />
          </div>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="w-full sm:w-auto shrink-0 shadow-sm h-11"
        >
          <Plus className="w-4 h-4 mr-2" /> Novo Cliente
        </Button>
      </div>

      <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead className="hidden md:table-cell">E-mail</TableHead>
              <TableHead className="hidden sm:table-cell">Telefone</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myClients.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-12 text-muted-foreground bg-secondary/20"
                >
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            ) : (
              myClients.map((client) => (
                <TableRow key={client.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium text-foreground">{client.name}</TableCell>
                  <TableCell className="text-muted-foreground">{client.cpf}</TableCell>
                  <TableCell className="text-muted-foreground hidden md:table-cell">
                    {client.email}
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden sm:table-cell">
                    {client.phone}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedClient(client)}
                      className="h-8 gap-2 text-primary hover:text-primary hover:bg-primary/10"
                    >
                      <Eye className="w-4 h-4" /> Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CustomerFormDialog isOpen={isFormOpen} onOpenChange={setIsFormOpen} />
      <CustomerDetailsDialog client={selectedClient} onClose={() => setSelectedClient(null)} />
    </div>
  )
}

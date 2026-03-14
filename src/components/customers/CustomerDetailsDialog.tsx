import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useApp, ClientCRM } from '@/store/AppContext'
import { User, Calendar, AlertCircle } from 'lucide-react'

const statusMap: Record<string, string> = {
  pending: 'Pendente',
  negotiating: 'Em Negociação',
  completed: 'Concluído',
  canceled: 'Cancelado',
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  negotiating: 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  canceled: 'bg-red-100 text-red-800 border-red-200',
}

export function CustomerDetailsDialog({
  client,
  onClose,
}: {
  client: ClientCRM | null
  onClose: () => void
}) {
  const { demands, users, currentUser } = useApp()

  if (!client) return null

  const clientUser = users.find((u) => u.email === client.email)
  const history = demands.filter(
    (d) =>
      d.customerId === clientUser?.id &&
      Object.values(d.contractedProviders).includes(currentUser?.id || ''),
  )

  return (
    <Dialog open={!!client} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <User className="w-5 h-5 text-primary" /> {client.name}
          </DialogTitle>
          <DialogDescription className="text-sm">{client.email}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Dados do Cliente</TabsTrigger>
            <TabsTrigger value="history">Histórico de Eventos</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 pt-4 animate-fade-in">
            <div className="grid grid-cols-2 gap-4 text-sm bg-secondary/20 p-4 rounded-xl border border-border">
              <div>
                <span className="text-muted-foreground block text-xs font-semibold mb-1">CPF</span>
                {client.cpf}
              </div>
              <div>
                <span className="text-muted-foreground block text-xs font-semibold mb-1">RG</span>
                {client.rg}
              </div>
              <div>
                <span className="text-muted-foreground block text-xs font-semibold mb-1">
                  Telefone
                </span>
                {client.phone}
              </div>
              <div>
                <span className="text-muted-foreground block text-xs font-semibold mb-1">CEP</span>
                {client.cep}
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground block text-xs font-semibold mb-1">
                  Endereço
                </span>
                {client.address}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="pt-4 animate-fade-in">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <AlertCircle className="w-10 h-10 mb-3 opacity-20" />
                <p className="text-sm font-medium">Nenhum evento registrado.</p>
                <p className="text-xs mt-1">Este cliente ainda não contratou seus serviços.</p>
              </div>
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Evento</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium text-foreground">{event.title}</TableCell>
                        <TableCell className="text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(event.date).toLocaleDateString('pt-BR')}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                              statusColors[event.status] || 'bg-gray-100'
                            }`}
                          >
                            {statusMap[event.status] || event.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useApp, SupplierFinanceStatus } from '@/store/AppContext'
import { DollarSign, PlusCircle } from 'lucide-react'

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

export function SupplierFinanceTab({ supplierId }: { supplierId: string }) {
  const { supplierFinances, addSupplierFinance } = useApp()
  const [isOpen, setIsOpen] = useState(false)
  const [desc, setDesc] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [status, setStatus] = useState<SupplierFinanceStatus>('pending')

  const finances = supplierFinances.filter((f) => f.supplierId === supplierId)
  const totalPaid = finances
    .filter((f) => f.status === 'paid')
    .reduce((acc, f) => acc + f.amount, 0)
  const totalPending = finances
    .filter((f) => f.status === 'pending')
    .reduce((acc, f) => acc + f.amount, 0)

  const handleAdd = () => {
    addSupplierFinance({
      supplierId,
      description: desc,
      amount: Number(amount),
      dueDate: date,
      status,
    })
    setIsOpen(false)
    setDesc('')
    setAmount('')
    setDate('')
    setStatus('pending')
  }

  const getStatusBadge = (s: SupplierFinanceStatus) => {
    switch (s) {
      case 'paid':
        return <Badge className="bg-emerald-500 hover:bg-emerald-600">Pago</Badge>
      case 'pending':
        return (
          <Badge variant="secondary" className="text-yellow-700 bg-yellow-100 hover:bg-yellow-200">
            Pendente
          </Badge>
        )
      case 'overdue':
        return <Badge variant="destructive">Atrasado</Badge>
    }
  }

  return (
    <div className="space-y-6 pt-2 animate-fade-in">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-border bg-emerald-500/5">
          <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Total Pago</p>
          <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalPaid)}</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-yellow-500/5">
          <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">
            Total Pendente
          </p>
          <p className="text-2xl font-bold text-yellow-600">{formatCurrency(totalPending)}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" /> Histórico Financeiro
          </h3>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <PlusCircle className="w-4 h-4 mr-2" /> Novo Registro
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Registrar Pagamento</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Descrição do Serviço</Label>
                  <Input
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Ex: Sinal para casamento"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Valor (R$)</Label>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Data de Vencimento</Label>
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={status}
                    onValueChange={(v) => setStatus(v as SupplierFinanceStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="paid">Pago</SelectItem>
                      <SelectItem value="overdue">Atrasado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={handleAdd} disabled={!desc || !amount || !date}>
                  Salvar Lançamento
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border border-border rounded-xl overflow-hidden bg-background">
          <Table>
            <TableHeader className="bg-secondary/50">
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {finances.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground text-sm">
                    Nenhum lançamento financeiro registrado.
                  </TableCell>
                </TableRow>
              ) : (
                finances.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="text-sm">
                      {new Date(f.dueDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                    </TableCell>
                    <TableCell className="text-sm font-medium">{f.description}</TableCell>
                    <TableCell className="text-sm">{formatCurrency(f.amount)}</TableCell>
                    <TableCell>{getStatusBadge(f.status)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

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
  DialogFooter,
} from '@/components/ui/dialog'
import { useApp, SupplierFinanceStatus, SupplierFinance } from '@/store/AppContext'
import { DollarSign, PlusCircle, FileText, Send, Mail, Download, Loader2 } from 'lucide-react'
import { useExportQueue } from '@/hooks/use-export-queue'
import { formatPhone } from '@/lib/formatters'
import { SERVICES } from '@/lib/services'
import logoImg from '@/assets/e-eventos-novo-62817.png'

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

export function SupplierFinanceTab({ supplierId }: { supplierId: string }) {
  const { supplierFinances, addSupplierFinance, suppliersCRM, demands } = useApp()
  const { addToQueue, isProcessing } = useExportQueue()

  const [isOpen, setIsOpen] = useState(false)
  const [desc, setDesc] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [status, setStatus] = useState<SupplierFinanceStatus>('pending')
  const [demandId, setDemandId] = useState<string>('none')

  const [receiptRecord, setReceiptRecord] = useState<SupplierFinance | null>(null)

  const supplier = suppliersCRM.find((s) => s.id === supplierId)
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
      demandId: demandId !== 'none' ? demandId : undefined,
    })
    setIsOpen(false)
    setDesc('')
    setAmount('')
    setDate('')
    setStatus('pending')
    setDemandId('none')
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

  const handlePrint = () => {
    if (!receiptRecord) return
    addToQueue(`Recibo_${receiptRecord.id}`, () => window.print())
  }

  const handleShareWhatsApp = () => {
    if (!receiptRecord || !supplier) return
    const phone = supplier.phone.replace(/\D/g, '')
    const msg = `Olá! Segue o comprovante de ${receiptRecord.status === 'paid' ? 'pagamento' : 'registro financeiro'} referente a: ${receiptRecord.description} no valor de ${formatCurrency(receiptRecord.amount)}.`
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const handleShareEmail = () => {
    if (!receiptRecord || !supplier) return
    const subject = `Comprovante de Pagamento - e-eventos`
    const body = `Olá ${supplier.name},\n\nSegue o registro financeiro:\nDescrição: ${receiptRecord.description}\nValor: ${formatCurrency(receiptRecord.amount)}\nVencimento/Data: ${new Date(receiptRecord.dueDate).toLocaleDateString('pt-BR')}\nStatus: ${receiptRecord.status === 'paid' ? 'Pago' : 'Pendente'}\n\nObrigado.`
    window.location.href = `mailto:${supplier.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const categoryName = supplier
    ? SERVICES.find((s) => s.id === supplier.category)?.label || supplier.category
    : ''

  return (
    <>
      <div className="space-y-6 pt-2 animate-fade-in print:hidden">
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
                <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto px-1">
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
                    <Label>Evento / Projeto (Opcional)</Label>
                    <Select value={demandId} onValueChange={(v) => setDemandId(v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o projeto vinculado..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhum projeto vinculado</SelectItem>
                        {demands.map((d) => (
                          <SelectItem key={d.id} value={d.id}>
                            {d.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                  <Button
                    className="w-full"
                    onClick={handleAdd}
                    disabled={!desc || !amount || !date}
                  >
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
                  <TableHead>Projeto</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {finances.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-6 text-muted-foreground text-sm"
                    >
                      Nenhum lançamento financeiro registrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  finances.map((f) => {
                    const demandTitle = demands.find((d) => d.id === f.demandId)?.title || '-'
                    return (
                      <TableRow key={f.id}>
                        <TableCell className="text-sm">
                          {new Date(f.dueDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                        </TableCell>
                        <TableCell className="text-sm font-medium">{f.description}</TableCell>
                        <TableCell className="text-sm text-muted-foreground truncate max-w-[120px]">
                          {demandTitle}
                        </TableCell>
                        <TableCell className="text-sm">{formatCurrency(f.amount)}</TableCell>
                        <TableCell>{getStatusBadge(f.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-2 px-2 text-primary"
                            onClick={() => setReceiptRecord(f)}
                          >
                            <FileText className="w-4 h-4" />
                            <span className="hidden sm:inline-block">Recibo</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <Dialog open={!!receiptRecord} onOpenChange={(o) => !o && setReceiptRecord(null)}>
          <DialogContent className="max-w-2xl bg-card border-none shadow-2xl p-0 overflow-hidden">
            {receiptRecord && supplier && (
              <>
                <div className="p-8 pb-0">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <img
                        src={logoImg}
                        alt="e-eventos"
                        className="h-10 w-10 rounded-lg object-contain bg-primary/10 p-1 mb-2"
                      />
                      <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">
                        Recibo de Operação
                      </h2>
                      <p className="text-muted-foreground text-sm font-medium mt-1">
                        Ref: {receiptRecord.id.toUpperCase()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">
                        {new Date(receiptRecord.dueDate).toLocaleDateString('pt-BR', {
                          timeZone: 'UTC',
                        })}
                      </p>
                      <div className="mt-2 flex justify-end">
                        {getStatusBadge(receiptRecord.status)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-secondary/50 p-6 rounded-xl border border-border mb-6">
                    <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1">
                      Fornecedor / Sub-contratado
                    </p>
                    <p className="font-semibold text-foreground text-lg">{supplier.name}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>CNPJ/CPF: {supplier.cnpjCpf}</span>
                      <span>Categoria: {categoryName}</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center border-b border-border pb-3">
                      <span className="font-medium text-muted-foreground">Descrição</span>
                      <span className="font-semibold text-foreground text-right">
                        {receiptRecord.description}
                      </span>
                    </div>
                    {receiptRecord.demandId && (
                      <div className="flex justify-between items-center border-b border-border pb-3">
                        <span className="font-medium text-muted-foreground">Projeto/Evento</span>
                        <span className="font-semibold text-foreground text-right">
                          {demands.find((d) => d.id === receiptRecord.demandId)?.title ||
                            'Não especificado'}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-bold text-foreground">Valor Total</span>
                      <span className="text-2xl font-black text-primary">
                        {formatCurrency(receiptRecord.amount)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary/30 p-6 flex flex-col sm:flex-row justify-between gap-3 border-t border-border mt-auto">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleShareWhatsApp}
                      className="gap-2 bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-700"
                    >
                      <Send className="w-4 h-4" /> WhatsApp
                    </Button>
                    <Button variant="outline" onClick={handleShareEmail} className="gap-2">
                      <Mail className="w-4 h-4" /> E-mail
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => setReceiptRecord(null)}>
                      Fechar
                    </Button>
                    <Button onClick={handlePrint} disabled={isProcessing} className="gap-2">
                      {isProcessing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      Imprimir PDF
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Hidden printable version */}
      {receiptRecord && supplier && (
        <div className="hidden print:block print:absolute print:inset-0 print:bg-white print:text-black print:z-[9999] print:p-12 font-sans min-h-screen">
          <div className="border-b-4 border-black pb-8 mb-10 flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter">e-eventos</h1>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-sm mt-1">
                Recibo Oficial
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">Ref: {receiptRecord.id.toUpperCase()}</p>
              <p className="text-gray-500 font-medium mt-1">
                Data:{' '}
                {new Date(receiptRecord.dueDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
              </p>
            </div>
          </div>

          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 mb-12">
            <p className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-2">
              Dados do Fornecedor / Sub-contratado
            </p>
            <p className="text-2xl font-bold mb-1">{supplier.name}</p>
            <p className="text-gray-600">CNPJ / CPF: {supplier.cnpjCpf}</p>
            <p className="text-gray-600">Categoria: {categoryName}</p>
          </div>

          <table className="w-full mb-12 border-collapse">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left py-4 font-bold uppercase tracking-wider text-sm">
                  Descrição do Lançamento
                </th>
                <th className="text-right py-4 font-bold uppercase tracking-wider text-sm">
                  Valor (R$)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-5">
                  <p className="font-bold text-lg">{receiptRecord.description}</p>
                  {receiptRecord.demandId && (
                    <p className="text-sm text-gray-500 mt-1">
                      Projeto:{' '}
                      {demands.find((d) => d.id === receiptRecord.demandId)?.title || 'N/A'}
                    </p>
                  )}
                </td>
                <td className="py-5 text-right font-bold text-lg">
                  {receiptRecord.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-end mb-16">
            <div className="w-1/2 bg-gray-100 p-8 rounded-3xl border border-gray-300">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600 font-bold uppercase tracking-wider text-sm">
                  Status
                </span>
                <span className="font-black uppercase">
                  {receiptRecord.status === 'paid'
                    ? 'PAGO'
                    : receiptRecord.status === 'pending'
                      ? 'PENDENTE'
                      : 'ATRASADO'}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-300 pt-4">
                <span className="text-2xl font-black">TOTAL</span>
                <span className="text-3xl font-black">
                  R$ {receiptRecord.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-400 font-medium pt-8 border-t border-gray-200">
            <p>
              Este documento é um comprovante digital gerado pela gestão financeira na plataforma
              e-eventos.
            </p>
            <p className="mt-1">app-locadora-eventos.com</p>
          </div>
        </div>
      )}
    </>
  )
}

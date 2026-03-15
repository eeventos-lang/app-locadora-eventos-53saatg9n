import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useApp, Proposal, Demand, User, Transaction } from '@/store/AppContext'
import { Receipt, ShieldCheck, FileText, Loader2, Plus, Search, FilterX } from 'lucide-react'
import { SERVICES } from '@/lib/services'
import logoImg from '@/assets/e-eventos-novo-62817.png'
import { useExportQueue } from '@/hooks/use-export-queue'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'

const Transactions = () => {
  const {
    role,
    transactions,
    currentUser,
    proposals,
    demands,
    users,
    incomeRecords,
    addIncomeRecord,
  } = useApp()
  const { toast } = useToast()
  const { addToQueue, isProcessing, queueLength } = useExportQueue()

  // Reconcilation Filters
  const [insuranceFilter, setInsuranceFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')

  // Income Filters
  const [incomeSearch, setIncomeSearch] = useState('')
  const [incomeMonth, setIncomeMonth] = useState('')

  // Modals
  const [selectedReceipt, setSelectedReceipt] = useState<Transaction | null>(null)
  const [isIncomeOpen, setIsIncomeOpen] = useState(false)
  const [bulkTotal, setBulkTotal] = useState(0)

  // New Income Form
  const [newIncome, setNewIncome] = useState({
    clientName: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Locação de Equipamento',
    status: 'received',
    demandId: 'none',
  })

  const myTransactions = useMemo(() => {
    if (role === 'customer') {
      return transactions
        .filter((t) => t.customerId === currentUser?.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    } else {
      return transactions
        .filter((t) => t.supplierId === currentUser?.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }
  }, [transactions, role, currentUser])

  const reconciliationData = useMemo(() => {
    if (role !== 'company' || !currentUser) return []
    const acceptedProposals = proposals.filter(
      (p) => p.supplierId === currentUser.id && p.status === 'accepted',
    )
    return acceptedProposals
      .map((p) => {
        const demand = demands.find((d) => d.id === p.demandId)
        const customer = users.find((u) => u.id === demand?.customerId)
        return { proposal: p, demand, customer }
      })
      .filter((item) => item.demand !== undefined) as {
      proposal: Proposal
      demand: Demand
      customer?: User
    }[]
  }, [proposals, demands, currentUser, role, users])

  const filteredReconciliation = useMemo(() => {
    return reconciliationData.filter(({ demand }) => {
      const isPaid = ['escrow', 'completed', 'refunded', 'processing_refund'].includes(
        demand.paymentStatus,
      )
      const hasIns = demand.hasInsurance

      if (insuranceFilter === 'active' && !hasIns) return false
      if (insuranceFilter === 'inactive' && hasIns) return false
      if (paymentFilter === 'paid' && !isPaid) return false
      if (paymentFilter === 'pending' && isPaid) return false

      return true
    })
  }, [reconciliationData, insuranceFilter, paymentFilter])

  const myIncomeRecords = useMemo(() => {
    return incomeRecords
      .filter((r) => {
        if (r.companyId !== currentUser?.id) return false
        if (incomeSearch && !r.clientName.toLowerCase().includes(incomeSearch.toLowerCase()))
          return false
        if (incomeMonth && !r.date.startsWith(incomeMonth)) return false
        return true
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [incomeRecords, currentUser, incomeSearch, incomeMonth])

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
      case 'received':
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
            {status === 'received' ? 'Recebido' : 'Concluído'}
          </Badge>
        )
      case 'pending':
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Pendente</Badge>
        )
      case 'cancelled':
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20">
            Cancelado
          </Badge>
        )
      case 'processing_refund':
      case 'refunded':
        return (
          <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">
            Reembolsado
          </Badge>
        )
      case 'disputed':
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Em Disputa</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const handleBulkExport = () => {
    const toExport = myTransactions.filter((t) => {
      const d = new Date(t.date)
      const now = new Date()
      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear() &&
        ['completed', 'escrow', 'processing_refund', 'refunded'].includes(t.status)
      )
    })

    if (toExport.length === 0) {
      return toast({
        title: 'Nenhum recibo elegível',
        description: 'Não há recibos concluídos para o mês atual.',
      })
    }

    setBulkTotal(toExport.length)
    toExport.forEach((t) => {
      addToQueue(`Recibo_${t.id}`, () => new Promise((res) => setTimeout(res, 800)))
    })
  }

  const handleSaveIncome = () => {
    if (!newIncome.clientName || !newIncome.amount || !newIncome.date) {
      return toast({
        title: 'Atenção',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive',
      })
    }

    addIncomeRecord({
      clientName: newIncome.clientName,
      amount: Number(newIncome.amount),
      date: new Date(newIncome.date).toISOString(),
      category: newIncome.category,
      status: newIncome.status as any,
      demandId: newIncome.demandId !== 'none' ? newIncome.demandId : undefined,
    })

    setIsIncomeOpen(false)
    setNewIncome({
      clientName: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      category: 'Locação de Equipamento',
      status: 'received',
      demandId: 'none',
    })
    toast({ title: 'Entrada registrada com sucesso!' })
  }

  useEffect(() => {
    if (queueLength === 0 && bulkTotal > 0) {
      const timer = setTimeout(() => setBulkTotal(0), 1500)
      return () => clearTimeout(timer)
    }
  }, [queueLength, bulkTotal])

  return (
    <>
      <div className="space-y-6 animate-slide-up pb-12 p-4 sm:p-6 max-w-7xl mx-auto print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Receipt className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Fluxo de Caixa & Pagamentos
              </h1>
              <p className="text-muted-foreground mt-1">
                Gerencie conciliações de plataforma e registre suas entradas manuais.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full sm:w-auto gap-2"
            onClick={handleBulkExport}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            Exportar Todos os Recibos
          </Button>
        </div>

        {bulkTotal > 0 && (
          <div className="mb-6 p-4 bg-card border border-border shadow-sm rounded-xl space-y-3 animate-fade-in-down">
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-foreground">Gerando Recibos em Lote...</span>
              <span className="text-muted-foreground font-medium">
                {bulkTotal - queueLength} de {bulkTotal} processados
              </span>
            </div>
            <Progress value={((bulkTotal - queueLength) / bulkTotal) * 100} className="h-2" />
          </div>
        )}

        <Tabs defaultValue={role === 'company' ? 'income' : 'history'} className="space-y-6">
          <TabsList className="bg-secondary p-1 h-auto flex flex-wrap w-full sm:max-w-xl">
            {role === 'company' && (
              <>
                <TabsTrigger value="income" className="flex-1 py-2 text-sm font-semibold">
                  Entradas Manuais
                </TabsTrigger>
                <TabsTrigger value="reconciliation" className="flex-1 py-2 text-sm font-semibold">
                  Conciliação
                </TabsTrigger>
              </>
            )}
            <TabsTrigger value="history" className="flex-1 py-2 text-sm font-semibold">
              Extrato Histórico
            </TabsTrigger>
          </TabsList>

          {role === 'company' && (
            <TabsContent value="income" className="space-y-4">
              <Card className="border-border shadow-sm bg-card">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">Gestão de Entradas (Receitas)</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Registre recebimentos externos ou pagamentos de clientes diretos.
                    </p>
                  </div>
                  <Dialog open={isIncomeOpen} onOpenChange={setIsIncomeOpen}>
                    <DialogTrigger asChild>
                      <Button className="shrink-0 gap-2">
                        <Plus className="w-4 h-4" /> Nova Entrada
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Registrar Nova Entrada</DialogTitle>
                        <DialogDescription>
                          Adicione os detalhes do pagamento recebido.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-1">
                        <div className="space-y-2">
                          <Label>Cliente / Origem</Label>
                          <Input
                            placeholder="Nome do cliente"
                            value={newIncome.clientName}
                            onChange={(e) =>
                              setNewIncome({ ...newIncome, clientName: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Valor (R$)</Label>
                          <Input
                            type="number"
                            placeholder="0,00"
                            value={newIncome.amount}
                            onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Data do Pagamento</Label>
                          <Input
                            type="date"
                            value={newIncome.date}
                            onChange={(e) => setNewIncome({ ...newIncome, date: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Evento / Projeto (Opcional)</Label>
                          <Select
                            value={newIncome.demandId}
                            onValueChange={(v) => setNewIncome({ ...newIncome, demandId: v })}
                          >
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
                          <Label>Categoria</Label>
                          <Select
                            value={newIncome.category}
                            onValueChange={(v) => setNewIncome({ ...newIncome, category: v })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Locação de Equipamento">
                                Locação de Equipamento
                              </SelectItem>
                              <SelectItem value="Serviços Adicionais">
                                Serviços Adicionais
                              </SelectItem>
                              <SelectItem value="Consultoria">Consultoria</SelectItem>
                              <SelectItem value="Outros">Outros</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Status</Label>
                          <Select
                            value={newIncome.status}
                            onValueChange={(v) => setNewIncome({ ...newIncome, status: v })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="received">Recebido</SelectItem>
                              <SelectItem value="pending">Pendente</SelectItem>
                              <SelectItem value="cancelled">Cancelado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsIncomeOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleSaveIncome}>Salvar Registro</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar por cliente..."
                        value={incomeSearch}
                        onChange={(e) => setIncomeSearch(e.target.value)}
                        className="pl-9 bg-background h-10"
                      />
                    </div>
                    <div className="w-full sm:w-[200px]">
                      <Input
                        type="month"
                        value={incomeMonth}
                        onChange={(e) => setIncomeMonth(e.target.value)}
                        className="bg-background h-10"
                      />
                    </div>
                    {(incomeSearch || incomeMonth) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setIncomeSearch('')
                          setIncomeMonth('')
                        }}
                      >
                        <FilterX className="h-5 w-5" />
                      </Button>
                    )}
                  </div>

                  <div className="rounded-md border border-border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Projeto/Evento</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                          <TableHead className="text-center">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {myIncomeRecords.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="text-center py-12 text-muted-foreground border-dashed border-2 border-border/50 rounded-xl m-4 bg-secondary/20"
                            >
                              Nenhuma entrada encontrada para os filtros selecionados.
                            </TableCell>
                          </TableRow>
                        ) : (
                          myIncomeRecords.map((r) => {
                            const demandTitle =
                              demands.find((d) => d.id === r.demandId)?.title || '-'
                            return (
                              <TableRow key={r.id} className="hover:bg-muted/50 transition-colors">
                                <TableCell className="whitespace-nowrap text-muted-foreground">
                                  {new Date(r.date).toLocaleDateString('pt-BR')}
                                </TableCell>
                                <TableCell className="font-medium text-foreground">
                                  {r.clientName}
                                  <div className="text-xs text-muted-foreground mt-0.5">
                                    {r.category}
                                  </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {demandTitle}
                                </TableCell>
                                <TableCell className="text-right font-bold text-foreground">
                                  {formatCurrency(r.amount)}
                                </TableCell>
                                <TableCell className="text-center">
                                  {getStatusBadge(r.status)}
                                </TableCell>
                              </TableRow>
                            )
                          })
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {role === 'company' && (
            <TabsContent value="reconciliation" className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <Select value={insuranceFilter} onValueChange={setInsuranceFilter}>
                  <SelectTrigger className="w-full sm:w-[220px] bg-card h-11">
                    <SelectValue placeholder="Status do Seguro" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Seguros</SelectItem>
                    <SelectItem value="active">Seguro Ativo</SelectItem>
                    <SelectItem value="inactive">Sem Seguro</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger className="w-full sm:w-[220px] bg-card h-11">
                    <SelectValue placeholder="Status do Pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Pagamentos</SelectItem>
                    <SelectItem value="paid">Quitado</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Card className="border-border shadow-sm bg-card">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Contratos Ativos e Repasses da Plataforma
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border border-border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          <TableHead>Evento</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Garantia / Seguro</TableHead>
                          <TableHead className="text-right">Valor Líquido</TableHead>
                          <TableHead className="text-center">Status Pagamento</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredReconciliation.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="text-center py-12 text-muted-foreground border-dashed border-2 border-border/50 rounded-xl m-4 bg-secondary/20"
                            >
                              Nenhum contrato encontrado para os filtros selecionados.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredReconciliation.map(({ proposal, demand, customer }) => {
                            const isPaid = [
                              'escrow',
                              'completed',
                              'refunded',
                              'processing_refund',
                            ].includes(demand.paymentStatus)
                            const isCanceled = demand.status === 'canceled'

                            return (
                              <TableRow
                                key={proposal.id}
                                className={cn(
                                  'hover:bg-muted/50 transition-colors',
                                  isCanceled && 'opacity-60 grayscale',
                                )}
                              >
                                <TableCell className="font-medium text-foreground">
                                  {demand.title}{' '}
                                  {isCanceled && (
                                    <Badge variant="secondary" className="ml-2 text-[10px]">
                                      Cancelado
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {customer?.name || 'Desconhecido'}
                                </TableCell>
                                <TableCell className="whitespace-nowrap text-muted-foreground">
                                  {new Date(demand.date).toLocaleDateString('pt-BR')}
                                </TableCell>
                                <TableCell>
                                  {demand.hasInsurance ? (
                                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-semibold gap-1">
                                      <ShieldCheck className="w-3.5 h-3.5" /> Seguro Ativo
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="secondary"
                                      className="text-muted-foreground font-medium"
                                    >
                                      Sem Seguro
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell className="text-right font-bold text-foreground">
                                  {formatCurrency(proposal.value * 0.7)}
                                </TableCell>
                                <TableCell className="text-center">
                                  {demand.paymentStatus === 'refunded' ||
                                  demand.paymentStatus === 'processing_refund' ? (
                                    <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 font-semibold">
                                      Estornado
                                    </Badge>
                                  ) : isPaid ? (
                                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-semibold">
                                      Quitado
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 font-semibold">
                                      Pendente
                                    </Badge>
                                  )}
                                </TableCell>
                              </TableRow>
                            )
                          })
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="history" className="space-y-4">
            <Card className="border-border shadow-sm bg-card">
              <CardHeader>
                <CardTitle className="text-lg">
                  {role === 'customer'
                    ? 'Pagamentos Realizados'
                    : 'Extrato de Recebimentos da Plataforma'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Evento</TableHead>
                        <TableHead>{role === 'customer' ? 'Fornecedor' : 'Cliente'}</TableHead>
                        {role === 'company' && (
                          <TableHead className="text-right">Valor Bruto</TableHead>
                        )}
                        {role === 'company' && (
                          <TableHead className="text-right">Taxa (30%)</TableHead>
                        )}
                        <TableHead className="text-right">
                          {role === 'customer' ? 'Valor Total' : 'Valor Líquido'}
                        </TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-right">Ação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myTransactions.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={role === 'company' ? 8 : 6}
                            className="text-center py-12 text-muted-foreground border-dashed border-2 border-border/50 rounded-xl m-4 bg-secondary/20"
                          >
                            Nenhuma transação encontrada no momento.
                          </TableCell>
                        </TableRow>
                      ) : (
                        myTransactions.map((t) => (
                          <TableRow key={t.id} className="hover:bg-muted/50 transition-colors">
                            <TableCell className="whitespace-nowrap text-muted-foreground">
                              {new Date(t.date).toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell className="font-medium text-foreground">
                              {t.demandTitle}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {role === 'customer' ? t.supplierName : t.clientName}
                            </TableCell>
                            {role === 'company' && (
                              <TableCell className="text-right text-muted-foreground font-medium">
                                {formatCurrency(t.amount)}
                              </TableCell>
                            )}
                            {role === 'company' && (
                              <TableCell className="text-right text-destructive font-medium">
                                -{formatCurrency(t.amount * 0.3)}
                              </TableCell>
                            )}
                            <TableCell className="text-right font-bold text-foreground">
                              {formatCurrency(role === 'customer' ? t.amount : t.amount * 0.7)}
                            </TableCell>
                            <TableCell className="text-center">
                              {getStatusBadge(t.status)}
                            </TableCell>
                            <TableCell className="text-right">
                              {['completed', 'escrow', 'processing_refund', 'refunded'].includes(
                                t.status,
                              ) && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedReceipt(t)}
                                  className="h-8 gap-2 px-2 text-primary"
                                >
                                  <FileText className="w-4 h-4" />{' '}
                                  <span className="hidden sm:inline-block">Recibo</span>
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={!!selectedReceipt} onOpenChange={(o) => !o && setSelectedReceipt(null)}>
          <DialogContent className="max-w-2xl bg-card border-none shadow-2xl p-0 overflow-hidden">
            {selectedReceipt && (
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
                        Recibo de Pagamento
                      </h2>
                      <p className="text-muted-foreground text-sm font-medium mt-1">
                        TXID: {selectedReceipt.id.toUpperCase()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">
                        {new Date(selectedReceipt.date).toLocaleDateString('pt-BR')}
                      </p>
                      {selectedReceipt.status === 'processing_refund' ||
                      selectedReceipt.status === 'refunded' ? (
                        <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 mt-2">
                          Reembolsado
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 mt-2">
                          Quitado
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 bg-secondary/50 p-6 rounded-xl border border-border mb-6">
                    <div>
                      <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1">
                        Cliente
                      </p>
                      <p className="font-semibold text-foreground">{selectedReceipt.clientName}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1">
                        Fornecedor
                      </p>
                      <p className="font-semibold text-foreground truncate">
                        {selectedReceipt.supplierName}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center border-b border-border pb-3">
                      <span className="font-medium text-muted-foreground">Evento</span>
                      <span className="font-semibold text-foreground text-right">
                        {selectedReceipt.demandTitle}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-border pb-3">
                      <span className="font-medium text-muted-foreground">Categoria(s)</span>
                      <span className="font-semibold text-foreground text-right capitalize">
                        {selectedReceipt.sectors
                          ?.map((sec) => SERVICES.find((s) => s.id === sec)?.label)
                          .join(', ') || 'Serviços'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-border pb-3">
                      <span className="font-medium text-muted-foreground">Proteções Ativas</span>
                      <span className="font-semibold text-foreground text-right">
                        {selectedReceipt.hasInsurance ? 'Seguro Plataforma' : 'Nenhuma'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-bold text-foreground">Total da Transação</span>
                      <span className="text-2xl font-black text-primary">
                        {formatCurrency(selectedReceipt.amount)}
                      </span>
                    </div>
                    {role === 'company' && (
                      <div className="flex justify-end gap-2 text-sm text-muted-foreground">
                        <span>
                          (Valor Líquido Repassado:{' '}
                          <span className="font-bold text-foreground">
                            {formatCurrency(selectedReceipt.amount * 0.7)}
                          </span>
                          )
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-secondary/30 p-6 flex justify-end gap-3 border-t border-border mt-auto">
                  <Button variant="outline" onClick={() => setSelectedReceipt(null)}>
                    Fechar
                  </Button>
                  <Button
                    onClick={() => addToQueue(`Recibo_${selectedReceipt.id}`, () => window.print())}
                    disabled={isProcessing}
                    className="gap-2"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                    Imprimir Recibo
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {selectedReceipt && (
        <div className="hidden print:block print:absolute print:inset-0 print:bg-white print:text-black print:z-[9999] print:p-12 font-sans min-h-screen">
          <div className="border-b-4 border-black pb-8 mb-10 flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter">e-eventos</h1>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-sm mt-1">
                Recibo de Pagamento Oficial
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">TXID: {selectedReceipt.id.toUpperCase()}</p>
              <p className="text-gray-500 font-medium mt-1">
                Data: {new Date(selectedReceipt.date).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12 mb-12">
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
              <p className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-2">
                Dados do Cliente
              </p>
              <p className="text-xl font-bold">{selectedReceipt.clientName}</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
              <p className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-2">
                Fornecedor
              </p>
              <p className="text-xl font-bold">{selectedReceipt.supplierName}</p>
            </div>
          </div>

          <div className="mb-12">
            <p className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-2">
              Detalhes do Evento
            </p>
            <p className="text-xl font-bold">{selectedReceipt.demandTitle}</p>
          </div>

          <table className="w-full mb-12 border-collapse">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left py-4 font-bold uppercase tracking-wider text-sm">
                  Descrição do Serviço
                </th>
                <th className="text-right py-4 font-bold uppercase tracking-wider text-sm">
                  Valor (R$)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-5">
                  <p className="font-bold text-lg capitalize">
                    {selectedReceipt.sectors
                      ?.map((sec) => SERVICES.find((s) => s.id === sec)?.label)
                      .join(', ') || 'Serviços Prestados'}
                  </p>
                </td>
                <td className="py-5 text-right font-bold text-lg">
                  {selectedReceipt.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
              </tr>
              {selectedReceipt.hasInsurance && (
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="py-5 pl-4">
                    <p className="font-bold">Seguro / Garantia da Plataforma</p>
                  </td>
                  <td className="py-5 pr-4 text-right font-bold text-gray-600">Incluso</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-end mb-16">
            <div className="w-1/2 bg-gray-100 p-8 rounded-3xl border border-gray-300">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600 font-bold uppercase tracking-wider text-sm">
                  Status
                </span>
                <span className="font-black uppercase">
                  {selectedReceipt.status === 'processing_refund' ||
                  selectedReceipt.status === 'refunded'
                    ? 'REEMBOLSADO'
                    : 'PAGO (QUITADO)'}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-300 pt-4">
                <span className="text-2xl font-black">TOTAL</span>
                <span className="text-3xl font-black">
                  R$ {selectedReceipt.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-400 font-medium pt-8 border-t border-gray-200">
            <p>
              Este documento é um comprovante digital gerado automaticamente pela plataforma
              e-eventos.
            </p>
            <p className="mt-1">app-locadora-eventos.com</p>
          </div>
        </div>
      )}
    </>
  )
}

export default Transactions

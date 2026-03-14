import { useState, useMemo } from 'react'
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
import { useApp, Proposal, Demand, User } from '@/store/AppContext'
import { Receipt, ShieldCheck } from 'lucide-react'

const Transactions = () => {
  const { role, transactions, currentUser, proposals, demands, users } = useApp()
  const [insuranceFilter, setInsuranceFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')

  const myTransactions = useMemo(() => {
    if (role === 'customer') {
      return transactions.filter((t) => t.customerId === currentUser?.id)
    } else {
      return transactions.filter((t) => t.supplierId === currentUser?.id)
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
      const isPaid = ['escrow', 'completed'].includes(demand.paymentStatus)
      const hasIns = demand.hasInsurance

      if (insuranceFilter === 'active' && !hasIns) return false
      if (insuranceFilter === 'inactive' && hasIns) return false
      if (paymentFilter === 'paid' && !isPaid) return false
      if (paymentFilter === 'pending' && isPaid) return false

      return true
    })
  }, [reconciliationData, insuranceFilter, paymentFilter])

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
            Concluído
          </Badge>
        )
      case 'pending':
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
            Pendente (Escrow)
          </Badge>
        )
      case 'refunded':
        return <Badge variant="secondary">Reembolsado</Badge>
      case 'disputed':
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Em Disputa</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-6 animate-slide-up pb-12 p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary/10 rounded-xl">
          <Receipt className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Financeiro & Pagamentos
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie e acompanhe todos os seus recebimentos e status de contratos.
          </p>
        </div>
      </div>

      <Tabs defaultValue={role === 'company' ? 'reconciliation' : 'history'} className="space-y-6">
        <TabsList className="bg-secondary p-1 h-auto flex flex-wrap w-full sm:max-w-md">
          {role === 'company' && (
            <TabsTrigger value="reconciliation" className="flex-1 py-2 text-sm font-semibold">
              Conciliação
            </TabsTrigger>
          )}
          <TabsTrigger value="history" className="flex-1 py-2 text-sm font-semibold">
            Extrato Histórico
          </TabsTrigger>
        </TabsList>

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
                <CardTitle className="text-lg">Contratos Ativos e Pagamentos</CardTitle>
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
                          const isPaid = ['escrow', 'completed'].includes(demand.paymentStatus)
                          return (
                            <TableRow
                              key={proposal.id}
                              className="hover:bg-muted/50 transition-colors"
                            >
                              <TableCell className="font-medium text-foreground">
                                {demand.title}
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
                                {isPaid ? (
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
                {role === 'customer' ? 'Pagamentos Realizados' : 'Extrato de Recebimentos'}
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={role === 'company' ? 7 : 5}
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
                          <TableCell className="text-center">{getStatusBadge(t.status)}</TableCell>
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
    </div>
  )
}

export default Transactions

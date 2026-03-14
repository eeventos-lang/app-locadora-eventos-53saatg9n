import { useMemo } from 'react'
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
import { useApp } from '@/store/AppContext'
import { Receipt } from 'lucide-react'

const Transactions = () => {
  const { role, transactions, currentUser } = useApp()

  const myTransactions = useMemo(() => {
    if (role === 'customer') {
      return transactions.filter((t) => t.customerId === currentUser?.id)
    } else {
      return transactions.filter((t) => t.supplierId === currentUser?.id)
    }
  }, [transactions, role, currentUser])

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
            Histórico Financeiro
          </h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe todas as suas movimentações e status de pagamentos.
          </p>
        </div>
      </div>

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
                  {role === 'company' && <TableHead className="text-right">Valor Bruto</TableHead>}
                  {role === 'company' && <TableHead className="text-right">Taxa (30%)</TableHead>}
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
                      <TableCell className="font-medium text-foreground">{t.demandTitle}</TableCell>
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
    </div>
  )
}

export default Transactions

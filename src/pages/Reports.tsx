import { useState, useMemo } from 'react'
import { Navigate } from 'react-router-dom'
import { useApp } from '@/store/AppContext'
import {
  PieChart,
  DollarSign,
  FileBarChart,
  LineChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Activity,
  Award,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'
import { SERVICES } from '@/lib/services'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

const MONTHS = [
  { value: '0', label: 'Janeiro' },
  { value: '1', label: 'Fevereiro' },
  { value: '2', label: 'Março' },
  { value: '3', label: 'Abril' },
  { value: '4', label: 'Maio' },
  { value: '5', label: 'Junho' },
  { value: '6', label: 'Julho' },
  { value: '7', label: 'Agosto' },
  { value: '8', label: 'Setembro' },
  { value: '9', label: 'Outubro' },
  { value: '10', label: 'Novembro' },
  { value: '11', label: 'Dezembro' },
]

export default function Reports() {
  const { role, supplierFinances, suppliersCRM, incomeRecords, currentUser, demands } = useApp()
  const currentMonth = new Date().getMonth().toString()
  const currentYear = new Date().getFullYear().toString()

  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [selectedYear, setSelectedYear] = useState(currentYear)

  const years = useMemo(() => {
    const y = new Set<string>([currentYear])
    supplierFinances.forEach((f) => {
      const year = new Date(f.dueDate).getFullYear().toString()
      y.add(year)
    })
    incomeRecords.forEach((r) => {
      const year = new Date(r.date).getFullYear().toString()
      y.add(year)
    })
    return Array.from(y).sort((a, b) => parseInt(b) - parseInt(a))
  }, [supplierFinances, incomeRecords, currentYear])

  const filteredFinances = useMemo(() => {
    return supplierFinances.filter((f) => {
      const d = new Date(f.dueDate)
      return (
        d.getFullYear().toString() === selectedYear && d.getMonth().toString() === selectedMonth
      )
    })
  }, [supplierFinances, selectedMonth, selectedYear])

  const filteredIncome = useMemo(() => {
    return incomeRecords.filter((r) => {
      if (r.companyId !== currentUser?.id) return false
      const d = new Date(r.date)
      return (
        d.getFullYear().toString() === selectedYear && d.getMonth().toString() === selectedMonth
      )
    })
  }, [incomeRecords, selectedMonth, selectedYear, currentUser])

  const totalExpenses = filteredFinances.reduce((sum, f) => sum + f.amount, 0)
  const totalReceivedIncome = filteredIncome
    .filter((r) => r.status === 'received')
    .reduce((sum, r) => sum + r.amount, 0)
  const netProfit = totalReceivedIncome - totalExpenses

  const chartData = useMemo(() => {
    const categoryTotals: Record<string, number> = {}

    filteredFinances.forEach((f) => {
      const supplier = suppliersCRM.find((s) => s.id === f.supplierId)
      const category = supplier ? supplier.category : 'Outros'
      categoryTotals[category] = (categoryTotals[category] || 0) + f.amount
    })

    return Object.entries(categoryTotals)
      .map(([categoryId, total]) => {
        const service = SERVICES.find((s) => s.id === categoryId)
        return {
          category: service ? service.label : categoryId,
          total,
        }
      })
      .sort((a, b) => b.total - a.total)
  }, [filteredFinances, suppliersCRM])

  const evolutionaryData = useMemo(() => {
    const monthsData = Array.from({ length: 12 }, (_, i) => ({
      month: MONTHS[i].label.substring(0, 3),
      expenses: 0,
    }))

    supplierFinances.forEach((f) => {
      const d = new Date(f.dueDate)
      if (d.getFullYear().toString() === selectedYear) {
        monthsData[d.getMonth()].expenses += f.amount
      }
    })

    return monthsData
  }, [supplierFinances, selectedYear])

  const profitabilityData = useMemo(() => {
    return demands
      .map((d) => {
        const incomes = incomeRecords.filter(
          (r) => r.demandId === d.id && r.status === 'received' && r.companyId === currentUser?.id,
        )
        const expenses = supplierFinances.filter((f) => f.demandId === d.id && f.status === 'paid')

        const totalIncome = incomes.reduce((sum, r) => sum + r.amount, 0)
        const totalExpense = expenses.reduce((sum, f) => sum + f.amount, 0)
        const profit = totalIncome - totalExpense

        return {
          demand: d,
          totalIncome,
          totalExpense,
          profit,
        }
      })
      .filter((data) => data.totalIncome > 0 || data.totalExpense > 0)
      .sort((a, b) => b.profit - a.profit)
  }, [demands, incomeRecords, supplierFinances, currentUser])

  const supplierPerformance = useMemo(() => {
    const stats: Record<
      string,
      { id: string; name: string; events: Set<string>; totalPaid: number }
    > = {}

    supplierFinances.forEach((f) => {
      if (f.status === 'paid') {
        if (!stats[f.supplierId]) {
          const sup = suppliersCRM.find((s) => s.id === f.supplierId)
          stats[f.supplierId] = {
            id: f.supplierId,
            name: sup?.name || 'Desconhecido',
            events: new Set(),
            totalPaid: 0,
          }
        }
        stats[f.supplierId].totalPaid += f.amount
        if (f.demandId) stats[f.supplierId].events.add(f.demandId)
      }
    })

    return Object.values(stats)
      .map((s) => ({ ...s, eventCount: s.events.size }))
      .sort((a, b) => b.eventCount - a.eventCount || b.totalPaid - a.totalPaid)
  }, [supplierFinances, suppliersCRM])

  const performanceChartData = useMemo(() => {
    return supplierPerformance.slice(0, 5).map((s) => ({
      name: s.name.substring(0, 15),
      totalPaid: s.totalPaid,
    }))
  }, [supplierPerformance])

  const handleExportCSV = () => {
    const rows = [['Data', 'Tipo', 'Categoria', 'Evento/Projeto', 'Descrição', 'Valor', 'Status']]

    incomeRecords
      .filter((r) => r.companyId === currentUser?.id)
      .forEach((r) => {
        const eventTitle = demands.find((d) => d.id === r.demandId)?.title || 'N/A'
        rows.push([
          new Date(r.date).toLocaleDateString('pt-BR'),
          'Entrada',
          r.category,
          eventTitle,
          r.clientName,
          r.amount.toString().replace('.', ','),
          r.status,
        ])
      })

    supplierFinances.forEach((f) => {
      const eventTitle = demands.find((d) => d.id === f.demandId)?.title || 'N/A'
      const supplier = suppliersCRM.find((s) => s.id === f.supplierId)
      rows.push([
        new Date(f.dueDate).toLocaleDateString('pt-BR'),
        'Saída',
        supplier ? SERVICES.find((sv) => sv.id === supplier.category)?.label || 'Outros' : 'Outros',
        eventTitle,
        f.description,
        f.amount.toString().replace('.', ','),
        f.status,
      ])
    })

    const csvContent = '\uFEFF' + rows.map((e) => e.join(';')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'relatorio_financeiro.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (role !== 'company') {
    return <Navigate to="/" replace />
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  const barChartConfig = {
    total: { label: 'Total Gasto (R$)', color: 'hsl(var(--primary))' },
  }
  const perfChartConfig = {
    totalPaid: { label: 'Total Investido (R$)', color: 'hsl(var(--primary))' },
  }
  const lineChartConfig = {
    expenses: { label: 'Despesas (R$)', color: 'hsl(var(--destructive))' },
  }

  return (
    <div className="space-y-6 animate-slide-up p-4 sm:p-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <PieChart className="w-8 h-8 text-primary" />
            Relatórios e Dados
          </h1>
          <p className="text-muted-foreground">
            Monitore suas receitas, despesas e a performance dos seus parceiros de negócio.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[140px] bg-card h-11">
              <SelectValue placeholder="Mês" />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[110px] bg-card h-11">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleExportCSV} variant="outline" className="h-11">
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      <Tabs defaultValue="financial" className="space-y-6">
        <TabsList className="grid w-full sm:w-[400px] grid-cols-2 bg-secondary p-1 h-auto">
          <TabsTrigger value="financial" className="py-2 text-sm font-semibold">
            Resumo Financeiro
          </TabsTrigger>
          <TabsTrigger value="performance" className="py-2 text-sm font-semibold">
            Performance de Fornecedores
          </TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card border-border shadow-sm relative overflow-hidden">
              <div className="absolute right-0 top-0 h-full w-1.5 bg-emerald-500"></div>
              <CardContent className="p-6 flex items-center gap-5">
                <div className="p-4 bg-emerald-500/10 rounded-full shrink-0">
                  <ArrowUpRight className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Total de Entradas
                  </p>
                  <h2 className="text-4xl font-black text-foreground">
                    {formatCurrency(totalReceivedIncome)}
                  </h2>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-sm relative overflow-hidden">
              <div className="absolute right-0 top-0 h-full w-1.5 bg-destructive"></div>
              <CardContent className="p-6 flex items-center gap-5">
                <div className="p-4 bg-destructive/10 rounded-full shrink-0">
                  <ArrowDownRight className="w-8 h-8 text-destructive" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Total de Despesas
                  </p>
                  <h2 className="text-4xl font-black text-foreground">
                    {formatCurrency(totalExpenses)}
                  </h2>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-sm relative overflow-hidden">
              <div className="absolute right-0 top-0 h-full w-1.5 bg-primary"></div>
              <CardContent className="p-6 flex items-center gap-5">
                <div className="p-4 bg-primary/10 rounded-full shrink-0">
                  <DollarSign className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Lucro Líquido
                  </p>
                  <h2 className="text-4xl font-black text-foreground">
                    {formatCurrency(netProfit)}
                  </h2>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <LineChartIcon className="w-5 h-5 text-primary" /> Gráficos Evolutivos
                </CardTitle>
                <CardDescription>
                  Evolução mensal de despesas ao longo do ano de {selectedYear}.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full mt-4">
                  <ChartContainer config={lineChartConfig} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={evolutionaryData}
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="hsl(var(--border))"
                        />
                        <XAxis
                          dataKey="month"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={10}
                          className="text-xs font-semibold"
                        />
                        <YAxis
                          tickFormatter={(value) => `R$ ${value}`}
                          tickLine={false}
                          axisLine={false}
                          width={80}
                          className="text-xs font-medium text-muted-foreground"
                        />
                        <ChartTooltip
                          content={
                            <ChartTooltipContent formatter={(val) => formatCurrency(Number(val))} />
                          }
                          cursor={{ stroke: 'hsl(var(--secondary))', strokeWidth: 2 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="expenses"
                          stroke="hsl(var(--destructive))"
                          strokeWidth={3}
                          dot={{ r: 4, fill: 'hsl(var(--destructive))' }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <FileBarChart className="w-5 h-5 text-primary" /> Gasto por Categoria
                </CardTitle>
                <CardDescription>
                  Distribuição dos custos no mês selecionado agrupada por tipo de serviço.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {chartData.length === 0 ? (
                  <div className="py-16 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl bg-secondary/20 flex flex-col items-center gap-3">
                    <DollarSign className="w-10 h-10 opacity-20" />
                    <p className="text-lg font-medium">Nenhum gasto registrado neste período.</p>
                  </div>
                ) : (
                  <div className="h-[350px] w-full mt-4">
                    <ChartContainer config={barChartConfig} className="h-full w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={chartData}
                          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="hsl(var(--border))"
                          />
                          <XAxis
                            dataKey="category"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            className="text-xs font-semibold"
                          />
                          <YAxis
                            tickFormatter={(value) => `R$ ${value}`}
                            tickLine={false}
                            axisLine={false}
                            width={80}
                            className="text-xs font-medium text-muted-foreground"
                          />
                          <ChartTooltip
                            content={
                              <ChartTooltipContent
                                formatter={(val) => formatCurrency(Number(val))}
                              />
                            }
                            cursor={{ fill: 'hsl(var(--secondary))', opacity: 0.5 }}
                          />
                          <Bar
                            dataKey="total"
                            fill="hsl(var(--primary))"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={80}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" /> Lucratividade por Evento
              </CardTitle>
              <CardDescription>
                Acompanhe o saldo líquido de cada projeto baseado em entradas e saídas vinculadas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Evento / Projeto</TableHead>
                      <TableHead className="text-right">Total Recebido</TableHead>
                      <TableHead className="text-right">Total Pago</TableHead>
                      <TableHead className="text-right">Lucro Líquido</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profitabilityData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-8 text-muted-foreground text-sm"
                        >
                          Nenhum projeto com movimentações vinculadas.
                        </TableCell>
                      </TableRow>
                    ) : (
                      profitabilityData.map((data) => (
                        <TableRow key={data.demand.id}>
                          <TableCell className="font-medium">{data.demand.title}</TableCell>
                          <TableCell className="text-right text-emerald-600 font-medium">
                            {formatCurrency(data.totalIncome)}
                          </TableCell>
                          <TableCell className="text-right text-destructive font-medium">
                            {formatCurrency(data.totalExpense)}
                          </TableCell>
                          <TableCell
                            className={cn(
                              'text-right font-bold',
                              data.profit >= 0 ? 'text-primary' : 'text-destructive',
                            )}
                          >
                            {formatCurrency(data.profit)}
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

        <TabsContent value="performance" className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" /> Custo vs Benefício (Top 5)
                </CardTitle>
                <CardDescription>
                  Comparativo de investimento entre os fornecedores mais utilizados.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {performanceChartData.length === 0 ? (
                  <div className="py-16 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl bg-secondary/20">
                    Sem dados suficientes.
                  </div>
                ) : (
                  <div className="h-[350px] w-full mt-4">
                    <ChartContainer config={perfChartConfig} className="h-full w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={performanceChartData}
                          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="hsl(var(--border))"
                          />
                          <XAxis
                            dataKey="name"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            className="text-xs font-semibold"
                          />
                          <YAxis
                            tickFormatter={(value) => `R$ ${value}`}
                            tickLine={false}
                            axisLine={false}
                            width={80}
                            className="text-xs font-medium text-muted-foreground"
                          />
                          <ChartTooltip
                            content={
                              <ChartTooltipContent
                                formatter={(val) => formatCurrency(Number(val))}
                              />
                            }
                            cursor={{ fill: 'hsl(var(--secondary))', opacity: 0.5 }}
                          />
                          <Bar
                            dataKey="totalPaid"
                            fill="hsl(var(--primary))"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={60}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" /> Ranking de Fornecedores
                </CardTitle>
                <CardDescription>
                  Lista de parceiros baseada em frequência de contratação e volume financeiro.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Fornecedor</TableHead>
                        <TableHead className="text-center">Eventos</TableHead>
                        <TableHead className="text-right">Total Pago</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {supplierPerformance.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center py-8 text-muted-foreground text-sm"
                          >
                            Nenhum fornecedor registrado.
                          </TableCell>
                        </TableRow>
                      ) : (
                        supplierPerformance.map((s, index) => (
                          <TableRow key={s.id}>
                            <TableCell className="font-bold text-muted-foreground">
                              {index + 1}
                            </TableCell>
                            <TableCell className="font-medium text-foreground">{s.name}</TableCell>
                            <TableCell className="text-center font-semibold">
                              {s.eventCount}
                            </TableCell>
                            <TableCell className="text-right font-bold">
                              {formatCurrency(s.totalPaid)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

import { useState, useMemo } from 'react'
import { Navigate } from 'react-router-dom'
import { useApp } from '@/store/AppContext'
import { PieChart, DollarSign, CheckCircle2, AlertCircle, FileBarChart } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { SERVICES } from '@/lib/services'

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
  const { role, supplierFinances, suppliersCRM } = useApp()
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
    return Array.from(y).sort((a, b) => parseInt(b) - parseInt(a))
  }, [supplierFinances, currentYear])

  const filteredFinances = useMemo(() => {
    return supplierFinances.filter((f) => {
      const date = new Date(f.dueDate)
      // Using UTC methods if needed, but local usually matches input date strings better
      // Wait, date input is "yyyy-mm-dd", so taking local timezone can shift it.
      // Safe fallback is string prefix match:
      const yearMonthStr = `${selectedYear}-${(parseInt(selectedMonth) + 1).toString().padStart(2, '0')}`
      return f.dueDate.startsWith(yearMonthStr)
    })
  }, [supplierFinances, selectedMonth, selectedYear])

  const totalPaid = filteredFinances
    .filter((f) => f.status === 'paid')
    .reduce((sum, f) => sum + f.amount, 0)
  const totalPending = filteredFinances
    .filter((f) => f.status === 'pending' || f.status === 'overdue')
    .reduce((sum, f) => sum + f.amount, 0)

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

  if (role !== 'company') {
    return <Navigate to="/" replace />
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  const chartConfig = {
    total: {
      label: 'Total Gasto (R$)',
      color: 'hsl(var(--primary))',
    },
  }

  return (
    <div className="space-y-6 animate-slide-up p-4 sm:p-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <PieChart className="w-8 h-8 text-primary" />
            Dashboard Financeiro
          </h1>
          <p className="text-muted-foreground">
            Monitore seus gastos com fornecedores sub-contratados e analise suas despesas mensais.
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[140px] bg-card">
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
            <SelectTrigger className="w-[110px] bg-card">
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-card border-border shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-2 bg-emerald-500"></div>
          <CardContent className="p-6 flex items-center gap-5">
            <div className="p-4 bg-emerald-500/10 rounded-full shrink-0">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">
                Total Pago
              </p>
              <h2 className="text-4xl font-black text-foreground">{formatCurrency(totalPaid)}</h2>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-2 bg-amber-500"></div>
          <CardContent className="p-6 flex items-center gap-5">
            <div className="p-4 bg-amber-500/10 rounded-full shrink-0">
              <AlertCircle className="w-8 h-8 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">
                Total Pendente
              </p>
              <h2 className="text-4xl font-black text-foreground">
                {formatCurrency(totalPending)}
              </h2>
            </div>
          </CardContent>
        </Card>
      </div>

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
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
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
                        <ChartTooltipContent formatter={(val) => formatCurrency(Number(val))} />
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
  )
}

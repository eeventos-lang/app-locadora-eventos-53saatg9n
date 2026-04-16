import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  CalendarDays,
  GripVertical,
  TrendingUp,
  Medal,
  ArrowRight,
  BellRing,
  AlertTriangle,
  MessageCircle,
} from 'lucide-react'
import { isBefore, addDays, isToday, startOfDay } from 'date-fns'
import { useApp } from '@/store/AppContext'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getLoyaltyTier, cn } from '@/lib/utils'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
  const { currentUser, companyProfile, demands, role, supplierFinances, suppliersCRM } = useApp()
  const defaultWidgets =
    role === 'company' || role === 'supplier'
      ? ['alerts', 'finance', 'loyalty', 'events']
      : ['finance', 'loyalty', 'events']
  const [widgets, setWidgets] = useState(defaultWidgets)
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null)

  useEffect(() => {
    setWidgets(defaultWidgets)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role])

  const dashboardDemands = useMemo(() => {
    const sourceDemands = demands
    if (role === 'customer') return sourceDemands.filter((d) => d.customerId === currentUser?.id)
    if (role === 'admin') return sourceDemands

    const supplierSectors = companyProfile?.sectors || []
    if (supplierSectors.length === 0) return []

    return sourceDemands.filter((d) => {
      const matchesRequirement = supplierSectors.some(
        (s) => d.requirements && d.requirements[s as keyof typeof d.requirements],
      )
      const matchesCategory = d.category ? supplierSectors.includes(d.category) : false

      return matchesRequirement || matchesCategory
    })
  }, [demands, role, companyProfile?.sectors, currentUser?.id])

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedWidget(id)
    e.dataTransfer.setData('widgetId', id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    const sourceId = e.dataTransfer.getData('widgetId')
    if (sourceId && sourceId !== targetId) {
      setWidgets((prev) => {
        const sourceIndex = prev.indexOf(sourceId)
        const targetIndex = prev.indexOf(targetId)
        const newWidgets = [...prev]
        newWidgets.splice(sourceIndex, 1)
        newWidgets.splice(targetIndex, 0, sourceId)
        return newWidgets
      })
    }
    setDraggedWidget(null)
  }

  const points = companyProfile?.loyaltyPoints || currentUser?.companyProfile?.loyaltyPoints || 0
  const tier = getLoyaltyTier(points)

  const financeData = [
    { month: 'Jan', value: 1200 },
    { month: 'Fev', value: 2100 },
    { month: 'Mar', value: 800 },
    { month: 'Abr', value: 1600 },
    { month: 'Mai', value: 2400 },
    { month: 'Jun', value: 3200 },
  ]

  const renderWidget = (id: string) => {
    if (id === 'alerts') {
      const today = startOfDay(new Date())
      const next7Days = addDays(today, 7)

      const upcomingFinances = supplierFinances
        .filter((f) => {
          if (f.status === 'paid') return false
          const dueDate = startOfDay(new Date(f.dueDate))
          return isBefore(dueDate, next7Days) || isToday(dueDate) || isBefore(dueDate, today)
        })
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

      return (
        <Card className="h-full flex flex-col hover:border-primary/30 transition-colors bg-card border-amber-500/20 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1.5 bg-amber-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/50">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <BellRing className="w-5 h-5 text-amber-500" /> Alertas de Vencimento
            </CardTitle>
            <div
              className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-secondary transition-colors"
              title="Arraste para mover"
            >
              <GripVertical className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="pt-4 flex-1">
            {upcomingFinances.length === 0 ? (
              <div className="text-center text-muted-foreground py-8 text-sm flex flex-col items-center gap-2">
                <AlertTriangle className="w-8 h-8 opacity-20" />
                Nenhum vencimento nos próximos 7 dias.
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingFinances.slice(0, 5).map((f) => {
                  const supplier = suppliersCRM.find((s) => s.id === f.supplierId)
                  const dueDate = startOfDay(new Date(f.dueDate))
                  const overdue = isBefore(dueDate, today) && !isToday(dueDate)
                  const dueToday = isToday(dueDate)

                  const phone = supplier?.phone?.replace(/\D/g, '') || ''
                  const wppMsg = `Olá, gostaria de confirmar o status do pagamento referente a ${f.description} com vencimento em ${new Date(f.dueDate).toLocaleDateString('pt-BR')}.`
                  const wppLink = `https://wa.me/55${phone}?text=${encodeURIComponent(wppMsg)}`

                  return (
                    <div
                      key={f.id}
                      className={cn(
                        'flex justify-between items-center p-3 rounded-xl border border-border/50 bg-secondary/30 transition-colors',
                        overdue && 'border-red-500/50 bg-red-500/10',
                        dueToday && 'border-amber-500/50 bg-amber-500/10',
                      )}
                    >
                      <div>
                        <p
                          className={cn(
                            'font-semibold text-sm',
                            overdue && 'text-red-600',
                            dueToday && 'text-amber-600',
                          )}
                        >
                          {supplier?.name || 'Desconhecido'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                          Vence:{' '}
                          <span
                            className={cn(
                              overdue && 'text-red-600 font-bold',
                              dueToday && 'text-amber-600 font-bold',
                            )}
                          >
                            {new Date(f.dueDate).toLocaleDateString('pt-BR')}
                          </span>
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                          <p
                            className={cn(
                              'font-bold text-sm',
                              overdue && 'text-red-600',
                              dueToday && 'text-amber-600',
                            )}
                          >
                            R${' '}
                            {f.amount.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                          {phone && (
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                              className={cn(
                                'h-6 w-6',
                                overdue
                                  ? 'text-red-600 hover:text-red-700 hover:bg-red-50'
                                  : dueToday
                                    ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50'
                                    : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50',
                              )}
                              title="Enviar Lembrete"
                            >
                              <a href={wppLink} target="_blank" rel="noreferrer">
                                <MessageCircle className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                        <div className="flex gap-1">
                          {overdue && (
                            <Badge variant="destructive" className="text-[10px] h-4">
                              Atrasado
                            </Badge>
                          )}
                          {dueToday && (
                            <Badge className="bg-amber-500 hover:bg-amber-600 text-[10px] h-4 border-transparent text-white">
                              Hoje
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )
    }

    if (id === 'finance') {
      return (
        <Card className="h-full flex flex-col hover:border-primary/30 transition-colors bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/50">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> Gráficos Financeiros
            </CardTitle>
            <div
              className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-secondary transition-colors"
              title="Arraste para mover"
            >
              <GripVertical className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="pt-4 flex-1">
            <div className="h-[220px] w-full">
              <ChartContainer
                config={{ value: { label: 'Receita', color: 'hsl(var(--primary))' } }}
                className="h-full w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={financeData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="month"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `R${v}`}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorValue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      )
    }

    if (id === 'loyalty') {
      return (
        <Card className="h-full flex flex-col hover:border-primary/30 transition-colors bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/50">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Medal className="w-5 h-5 text-primary" /> Selos de Fidelidade
            </CardTitle>
            <div
              className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-secondary transition-colors"
              title="Arraste para mover"
            >
              <GripVertical className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="pt-8 flex-1 flex flex-col items-center justify-center text-center">
            <div
              className={cn(
                'p-6 rounded-full border-4 mb-5 shadow-sm',
                tier.bgClass,
                tier.borderClass,
                tier.colorClass,
              )}
            >
              <tier.icon className="w-16 h-16" />
            </div>
            <h3 className={cn('text-2xl font-black uppercase tracking-wider', tier.colorClass)}>
              Nível {tier.name}
            </h3>
            <p className="text-muted-foreground mt-2 font-medium">Você possui {points} pontos</p>
            {tier.nextThreshold && (
              <p className="text-sm text-muted-foreground mt-1">
                Faltam {tier.nextThreshold - points} para o próximo nível.
              </p>
            )}
          </CardContent>
        </Card>
      )
    }

    if (id === 'events') {
      return (
        <Card className="h-full flex flex-col hover:border-primary/30 transition-colors bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/50">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" /> Lista de Eventos
            </CardTitle>
            <div
              className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-secondary transition-colors"
              title="Arraste para mover"
            >
              <GripVertical className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="pt-4 flex-1">
            <div className="space-y-3">
              {dashboardDemands.length === 0 ? (
                <div className="text-center text-muted-foreground py-8 text-sm">
                  Nenhum evento encontrado no momento.
                </div>
              ) : (
                dashboardDemands.slice(0, 4).map((d) => (
                  <div
                    key={d.id}
                    className="flex justify-between items-center p-3 rounded-xl border border-border/50 bg-secondary/30 hover:bg-secondary/60 transition-colors"
                  >
                    <div className="mr-2 overflow-hidden">
                      <p className="font-semibold text-foreground truncate">{d.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {new Date(d.date).toLocaleDateString('pt-BR')} • {d.location}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-background whitespace-nowrap">
                      {d.status === 'pending'
                        ? 'Pendente'
                        : d.status === 'negotiating'
                          ? 'Em Negociação'
                          : d.status === 'completed'
                            ? 'Concluído'
                            : 'Cancelado'}
                    </Badge>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4">
              <Button variant="ghost" className="w-full text-sm text-primary" asChild>
                <Link to="/demands">
                  Ver Todos os Eventos <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )
    }
    return null
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8 animate-slide-up pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Meu Painel</h1>
          <p className="text-muted-foreground mt-1">
            Arraste e solte os widgets para personalizar sua área de trabalho.
          </p>
        </div>
        {role === 'customer' && (
          <Button asChild>
            <Link to="/create-event">Criar Novo Evento</Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {widgets.map((id) => (
          <div
            key={id}
            draggable
            onDragStart={(e) => handleDragStart(e, id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, id)}
            onDragEnd={() => setDraggedWidget(null)}
            className={cn(
              'transition-all duration-300 h-full',
              draggedWidget === id ? 'opacity-40 scale-95 z-10' : 'opacity-100 z-0',
            )}
          >
            {renderWidget(id)}
          </div>
        ))}
      </div>
    </div>
  )
}

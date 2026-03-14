import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { useApp, Demand } from '@/store/AppContext'
import { SERVICES } from '@/lib/services'

const Demands = () => {
  const { role, demands, isSubscribed, companyProfile, proposals, currentUser } = useApp()

  const filteredDemands = useMemo(() => {
    if (role === 'customer') return demands.filter((d) => d.customerId === currentUser?.id)
    if (!companyProfile?.sectors || companyProfile.sectors.length === 0) return []
    return demands.filter((d) =>
      companyProfile.sectors.some((s) => d.requirements[s as keyof typeof d.requirements]),
    )
  }, [demands, role, companyProfile?.sectors, currentUser?.id])

  const getDisplayBudget = (demand: Demand) => {
    if (role === 'customer') return demand.budget
    let sum = 0
    if (demand.budgetBreakdown) {
      companyProfile?.sectors?.forEach((s) => {
        if (
          demand.requirements[s as keyof typeof demand.requirements] &&
          demand.budgetBreakdown?.[s]
        ) {
          sum += demand.budgetBreakdown[s]
        }
      })
    } else {
      return demand.budget * 0.9
    }
    return sum * 0.9
  }

  const getStatusBadge = (status: string, paymentStatus: string) => {
    if (paymentStatus === 'completed') {
      return (
        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 uppercase tracking-wider font-bold shrink-0 text-[10px]">
          Concluído
        </Badge>
      )
    }
    if (paymentStatus === 'escrow') {
      return (
        <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 uppercase tracking-wider font-bold shrink-0 text-[10px]">
          Serviço Pago
        </Badge>
      )
    }
    if (paymentStatus === 'pending_payment' || paymentStatus === 'pending_signature') {
      return (
        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 uppercase tracking-wider font-bold shrink-0 text-[10px]">
          Aguardando Ação
        </Badge>
      )
    }
    if (status === 'pending') {
      return (
        <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 uppercase tracking-wider font-bold shrink-0 text-[10px]">
          Pendente
        </Badge>
      )
    }
    if (status === 'negotiating') {
      return (
        <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 uppercase tracking-wider font-bold shrink-0 text-[10px]">
          Em negociação
        </Badge>
      )
    }
    return null
  }

  const myProposals = useMemo(
    () => proposals.filter((p) => p.supplierId === currentUser?.id),
    [proposals, currentUser],
  )
  const sentCount = myProposals.length
  const acceptedCount = myProposals.filter((p) => p.status === 'accepted').length

  const chartData = [
    { status: 'Propostas Enviadas', count: sentCount, fill: 'hsl(var(--primary))' },
    { status: 'Propostas Aceitas', count: acceptedCount, fill: 'hsl(var(--emerald-500))' },
  ]
  const chartConfig = { count: { label: 'Quantidade' } }

  if (role === 'company' && !isSubscribed) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[70vh] text-center animate-slide-up">
        <h2 className="text-2xl font-bold mb-3 text-foreground tracking-tight">Acesso Restrito</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
          Ative sua assinatura premium para visualizar todas as demandas disponíveis na plataforma.
        </p>
        <Link
          to="/subscription"
          className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium shadow-md hover:bg-primary/90 transition-all"
        >
          Assinar Agora
        </Link>
      </div>
    )
  }

  const renderDemandCard = (demand: Demand) => {
    const demandProposalsCount = proposals.filter((p) => p.demandId === demand.id).length
    return (
      <Link key={demand.id} to={`/demands/${demand.id}`} className="block">
        <Card className="hover:shadow-md transition-all duration-300 border-border group bg-card">
          <CardContent className="p-0">
            <div className="p-5 md:p-6 space-y-4">
              <div className="flex justify-between items-start gap-4">
                <h2 className="font-semibold text-foreground text-lg md:text-xl leading-tight group-hover:text-primary transition-colors">
                  {demand.title}
                </h2>
                {getStatusBadge(demand.status, demand.paymentStatus)}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">
                    {new Date(demand.date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium">{demand.location}</span>
                </div>
                {role === 'customer' && (
                  <div className="flex items-center gap-2 text-primary">
                    <span className="font-semibold">{demandProposalsCount} propostas</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-5 border-t border-border">
                <div className="flex gap-2 items-center flex-wrap">
                  {(() => {
                    const activeReqs = SERVICES.filter(
                      (s) =>
                        demand.requirements[s.id as keyof typeof demand.requirements] &&
                        (role === 'customer' || companyProfile?.sectors?.includes(s.id)),
                    )
                    return (
                      <>
                        {activeReqs.slice(0, 4).map((req) => (
                          <div
                            key={req.id}
                            className={`p-2 ${req.bg} rounded-lg`}
                            title={req.label}
                          >
                            <req.icon className={`w-4 h-4 ${req.color}`} />
                          </div>
                        ))}
                        {activeReqs.length > 4 && (
                          <div className="p-2 bg-secondary rounded-lg flex items-center justify-center text-xs font-bold text-muted-foreground min-w-[32px]">
                            +{activeReqs.length - 4}
                          </div>
                        )}
                      </>
                    )
                  })()}
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider font-semibold">
                    {role === 'customer' ? 'Orçamento Total' : 'Seu Orçamento Líquido'}
                  </p>
                  <p className="text-foreground font-bold text-lg md:text-xl">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(getDisplayBudget(demand))}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  return (
    <div className="space-y-6 animate-slide-up pb-12 p-4 sm:p-6 max-w-7xl mx-auto">
      {role === 'company' && (
        <Card className="mb-8 border-border shadow-sm bg-card">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <CardTitle className="text-xl text-foreground">Meu Desempenho</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Sua taxa de conversão de propostas na plataforma
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="space-y-4 md:col-span-1">
                <div className="bg-secondary/50 p-4 rounded-xl border border-border">
                  <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">
                    Total Enviadas
                  </p>
                  <p className="text-3xl font-bold text-foreground">{sentCount}</p>
                </div>
                <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                  <p className="text-xs uppercase tracking-wider font-semibold text-emerald-600 mb-1">
                    Total Aceitas
                  </p>
                  <p className="text-3xl font-bold text-emerald-500">{acceptedCount}</p>
                </div>
              </div>
              <div className="md:col-span-2">
                <ChartContainer config={chartConfig} className="h-[220px] w-full">
                  <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="status"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      className="text-xs font-medium"
                    />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      cursor={{ fill: 'hsl(var(--secondary))' }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={60} />
                  </BarChart>
                </ChartContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          {role === 'customer' ? 'Meus Eventos' : 'Oportunidades Compatíveis'}
        </h1>
      </div>

      {role === 'customer' ? (
        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="bg-secondary p-1 h-auto flex flex-wrap w-full sm:max-w-md">
            <TabsTrigger value="events" className="flex-1 py-2 text-sm font-semibold">
              Eventos Ativos
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex-1 py-2 text-sm font-semibold">
              Cronograma de Pagamentos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-4 mt-4">
            {filteredDemands.length === 0 ? (
              <div className="text-center text-muted-foreground py-16 border-2 border-dashed border-border rounded-xl bg-secondary/30">
                Nenhum evento encontrado no momento.
              </div>
            ) : (
              filteredDemands.map(renderDemandCard)
            )}
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4 mt-4">
            {filteredDemands.filter((d) =>
              ['pending_payment', 'escrow', 'completed'].includes(d.paymentStatus),
            ).length === 0 ? (
              <div className="text-center text-muted-foreground py-16 border-2 border-dashed border-border rounded-xl bg-secondary/30">
                Nenhum pagamento pendente ou agendado.
              </div>
            ) : (
              filteredDemands
                .filter((d) => ['pending_payment', 'escrow', 'completed'].includes(d.paymentStatus))
                .map((demand) => {
                  const isPaid =
                    demand.paymentStatus === 'escrow' || demand.paymentStatus === 'completed'
                  const deadline = new Date(demand.date)
                  deadline.setDate(deadline.getDate() - 15)

                  const totalContracted = proposals
                    .filter((p) => p.demandId === demand.id && p.status === 'accepted')
                    .reduce((acc, p) => acc + p.value, 0)

                  return (
                    <Card
                      key={demand.id}
                      className="bg-card shadow-sm border-border hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-5 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="w-full md:w-auto">
                          <h3 className="font-bold text-lg mb-1">{demand.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Vencimento (15 dias antes):{' '}
                            <span className="font-medium text-foreground">
                              {deadline.toLocaleDateString('pt-BR')}
                            </span>
                          </p>
                        </div>
                        <div className="text-left md:text-right w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-border">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                            Valor Contratado
                          </p>
                          <p className="font-bold text-2xl text-foreground mb-2">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(totalContracted)}
                          </p>
                          <Badge
                            variant={isPaid ? 'default' : 'secondary'}
                            className={
                              isPaid
                                ? 'bg-emerald-500 text-white'
                                : 'bg-amber-500 text-white border-transparent'
                            }
                          >
                            {isPaid ? 'Pago via Plataforma' : 'Pagamento Pendente'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-4">
          {filteredDemands.length === 0 ? (
            <div className="text-center text-muted-foreground py-16 border-2 border-dashed border-border rounded-xl bg-secondary/30">
              Configure suas áreas de atuação no perfil para ver oportunidades compatíveis.
            </div>
          ) : (
            filteredDemands.map(renderDemandCard)
          )}
        </div>
      )}
    </div>
  )
}

export default Demands

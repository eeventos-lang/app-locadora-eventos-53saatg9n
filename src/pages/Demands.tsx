import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { useApp, Demand } from '@/store/AppContext'
import { SERVICES } from '@/lib/services'

const Demands = () => {
  const { role, demands, isSubscribed, companyProfile, proposals, currentUser } = useApp()

  const filteredDemands = useMemo(() => {
    if (role === 'customer') return demands
    if (!companyProfile?.sectors || companyProfile.sectors.length === 0) return []
    return demands.filter((d) =>
      companyProfile.sectors.some((s) => d.requirements[s as keyof typeof d.requirements]),
    )
  }, [demands, role, companyProfile?.sectors])

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 uppercase tracking-wider font-bold shrink-0 text-[10px]">
            Pendente
          </Badge>
        )
      case 'negotiating':
        return (
          <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 uppercase tracking-wider font-bold shrink-0 text-[10px]">
            Em negociação
          </Badge>
        )
      case 'completed':
        return (
          <Badge className="bg-green-500/10 text-green-500 border-green-500/20 uppercase tracking-wider font-bold shrink-0 text-[10px]">
            Concluído
          </Badge>
        )
      default:
        return null
    }
  }

  // Performance Dashboard Data
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

      <div className="space-y-4">
        {filteredDemands.length === 0 ? (
          <div className="text-center text-muted-foreground py-16 border-2 border-dashed border-border rounded-xl bg-secondary/30">
            {role === 'company'
              ? companyProfile?.sectors && companyProfile.sectors.length > 0
                ? 'Não há demandas para as suas áreas de atuação no momento.'
                : 'Configure suas áreas de atuação no perfil para ver oportunidades.'
              : 'Nenhuma demanda encontrada no momento.'}
          </div>
        ) : (
          filteredDemands.map((demand) => {
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
                        {getStatusBadge(demand.status)}
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
          })
        )}
      </div>
    </div>
  )
}

export default Demands

import { useMemo, useState } from 'react'
import {
  LineChart as LineChartIcon,
  Star,
  Trophy,
  MessageSquareHeart,
  Award,
  Download,
  Loader2,
  Gift,
  Zap,
  Percent,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { useApp } from '@/store/AppContext'
import { useToast } from '@/hooks/use-toast'
import { getLoyaltyTier, cn } from '@/lib/utils'

const POSITIVE_KEYWORDS = [
  'excelente',
  'pontual',
  'profissional',
  'qualidade',
  'ótimo',
  'incrível',
  'bom',
  'recomendo',
  'maravilhosa',
  'educada',
]

export default function Insights() {
  const { currentUser, role, reviews, companyProfile, redeemLoyaltyPoints } = useApp()
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)

  const [redeemModalOpen, setRedeemModalOpen] = useState(false)
  const [selectedReward, setSelectedReward] = useState<{ name: string; points: number } | null>(
    null,
  )

  const myReviews = useMemo(() => {
    return reviews.filter((r) => r.supplierId === currentUser?.id)
  }, [reviews, currentUser])

  const { avgRating, fiveStarCount, wordCloud } = useMemo(() => {
    let sum = 0
    let fiveStar = 0
    const words: Record<string, number> = {}

    myReviews.forEach((r) => {
      sum += r.rating
      if (r.rating === 5) {
        fiveStar++
        const tokens = r.comment
          .toLowerCase()
          .replace(/[^a-zÀ-ÿ\s]/g, '')
          .split(' ')
        tokens.forEach((t) => {
          if (POSITIVE_KEYWORDS.includes(t) || (t.length > 5 && r.rating >= 4)) {
            words[t] = (words[t] || 0) + 1
          }
        })
      }
    })

    const topWords = Object.entries(words)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({ text: word, value: count }))

    return {
      avgRating: myReviews.length ? (sum / myReviews.length).toFixed(1) : '0.0',
      fiveStarCount: fiveStar,
      wordCloud: topWords,
    }
  }, [myReviews])

  const trendData = useMemo(() => {
    if (myReviews.length < 2) {
      return [
        { month: 'Jan', rating: 4.5 },
        { month: 'Fev', rating: 4.7 },
        { month: 'Mar', rating: 4.8 },
        { month: 'Abr', rating: 4.9 },
        { month: 'Mai', rating: 5.0 },
      ]
    }
    return [
      { month: 'Mês 1', rating: 4.0 },
      { month: 'Mês 2', rating: 4.5 },
      { month: 'Mês 3', rating: 4.8 },
      { month: 'Atual', rating: Number(avgRating) },
    ]
  }, [myReviews.length, avgRating])

  const chartConfig = { rating: { label: 'Avaliação Média', color: 'hsl(var(--primary))' } }

  const handleExportPDF = () => {
    setIsExporting(true)
    setTimeout(() => {
      window.print()
      setIsExporting(false)
      toast({
        title: 'Relatório Gerado',
        description: 'Seu PDF profissional está pronto para ser salvo.',
      })
    }, 800)
  }

  const handleRedeem = () => {
    if (selectedReward) {
      try {
        redeemLoyaltyPoints(selectedReward.points, selectedReward.name)
        setRedeemModalOpen(false)
      } catch (err: any) {
        toast({ title: 'Erro', description: err.message, variant: 'destructive' })
      }
    }
  }

  if (role !== 'company') {
    return (
      <div className="p-8 text-center text-muted-foreground animate-fade-in">
        Acesso exclusivo para fornecedores.
      </div>
    )
  }

  const isExpert = fiveStarCount >= 10
  const isHighPerformance = fiveStarCount >= 25

  const points = companyProfile?.loyaltyPoints || 0
  const tier = getLoyaltyTier(points)
  const TierIcon = tier.icon
  const progressToNextReward = tier.nextThreshold
    ? Math.min((points / tier.nextThreshold) * 100, 100)
    : 100

  const stats = companyProfile?.monthlyStats || {
    pointsEarned: 0,
    pointsEarnedPrev: 0,
    feeSavings: 0,
    feeSavingsPrev: 0,
  }
  const pointsTrend = stats.pointsEarnedPrev
    ? ((stats.pointsEarned - stats.pointsEarnedPrev) / stats.pointsEarnedPrev) * 100
    : 0
  const savingsTrend = stats.feeSavingsPrev
    ? ((stats.feeSavings - stats.feeSavingsPrev) / stats.feeSavingsPrev) * 100
    : 0

  return (
    <>
      <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto animate-slide-up pb-12 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
              <LineChartIcon className="w-8 h-8 text-primary" />
              Insights & Desempenho
            </h1>
            <p className="text-muted-foreground">
              Acompanhe a evolução da sua reputação na plataforma e entenda os pontos fortes do seu
              serviço.
            </p>
          </div>
          <Button onClick={handleExportPDF} disabled={isExporting} className="shrink-0 shadow-md">
            {isExporting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Baixar Relatório (PDF)
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Loyalty Program Section */}
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 shadow-sm relative overflow-hidden flex flex-col">
            <div className="absolute -right-10 -top-10 text-primary/10 w-48 h-48 rotate-12">
              <Trophy className="w-full h-full" />
            </div>
            <CardHeader className="relative z-10 pb-4 border-b border-border/50">
              <CardTitle className="text-xl flex items-center gap-2 text-foreground">
                <Gift className="w-5 h-5 text-primary" /> Programa de Fidelidade
              </CardTitle>
              <CardDescription>
                Acumule pontos ao concluir eventos e suba de nível para obter mais visibilidade.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 pt-6 flex-1 flex flex-col justify-center">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div
                  className={cn(
                    'flex flex-col items-center justify-center p-6 rounded-2xl border shadow-sm min-w-[200px] transition-all',
                    tier.bgClass,
                    tier.borderClass,
                  )}
                >
                  <TierIcon className={cn('w-10 h-10 mb-2', tier.colorClass)} />
                  <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground mb-1">
                    Nível {tier.name}
                  </span>
                  <span className={cn('text-5xl font-black drop-shadow-sm', tier.colorClass)}>
                    {points}
                  </span>
                  <span className={cn('text-sm font-semibold mt-1', tier.colorClass)}>Pontos</span>
                </div>

                <div className="flex-1 w-full space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-muted-foreground">
                        Progresso para {tier.nextThreshold ? 'próximo nível' : 'nível máximo'}
                      </span>
                      <span className={cn(tier.colorClass)}>
                        {points} {tier.nextThreshold ? `/ ${tier.nextThreshold} pts` : 'pts'}
                      </span>
                    </div>
                    <Progress value={progressToNextReward} className="h-3 bg-primary/10" />
                    {tier.nextThreshold && (
                      <p className="text-xs text-muted-foreground mt-1 text-right">
                        Faltam {Math.max(0, tier.nextThreshold - points)} pontos para o próximo
                        nível.
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <Button
                      variant={points >= 100 ? 'default' : 'secondary'}
                      className="w-full font-bold shadow-sm h-11"
                      disabled={points < 100}
                      onClick={() => {
                        setSelectedReward({ name: 'Destaque nas Buscas (1 Semana)', points: 100 })
                        setRedeemModalOpen(true)
                      }}
                    >
                      <Zap className="w-4 h-4 mr-2" /> Resgatar Destaque (100 pts)
                    </Button>
                    <Button
                      variant={points >= 200 ? 'default' : 'secondary'}
                      className="w-full font-bold shadow-sm h-11"
                      disabled={points < 200}
                      onClick={() => {
                        setSelectedReward({ name: 'Desconto em Taxas (1 Transação)', points: 200 })
                        setRedeemModalOpen(true)
                      }}
                    >
                      <Percent className="w-4 h-4 mr-2" /> Resgatar Desconto (200 pts)
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Performance Report */}
          <Card className="bg-card border-border shadow-sm flex flex-col relative overflow-hidden">
            <div className="absolute -right-10 -top-10 text-muted/5 w-48 h-48 rotate-12 pointer-events-none">
              <Activity className="w-full h-full" />
            </div>
            <CardHeader className="relative z-10 pb-4 border-b border-border/50">
              <CardTitle className="text-xl flex items-center gap-2 text-foreground">
                <Activity className="w-5 h-5 text-primary" /> Relatório Mensal
              </CardTitle>
              <CardDescription>
                Resumo do seu desempenho e economia nos últimos 30 dias.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 pt-6 flex-1 flex flex-col justify-center gap-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 bg-secondary/30 p-5 rounded-2xl border border-border/50">
                  <p className="text-xs uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5" /> Pontos Ganhos
                  </p>
                  <p className="text-4xl font-black text-foreground">{stats.pointsEarned}</p>
                  <div className="flex items-center gap-1 pt-1 border-t border-border/50">
                    {pointsTrend >= 0 ? (
                      <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-destructive" />
                    )}
                    <span
                      className={cn(
                        'text-xs font-bold',
                        pointsTrend >= 0 ? 'text-emerald-500' : 'text-destructive',
                      )}
                    >
                      {Math.abs(pointsTrend).toFixed(1)}% {pointsTrend >= 0 ? 'a mais' : 'a menos'}
                    </span>
                    <span className="text-[10px] text-muted-foreground ml-1 font-medium">
                      vs mês ant.
                    </span>
                  </div>
                </div>
                <div className="space-y-2 bg-secondary/30 p-5 rounded-2xl border border-border/50">
                  <p className="text-xs uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5" /> Economia (Taxas)
                  </p>
                  <p className="text-3xl sm:text-4xl font-black text-primary">
                    R$ {stats.feeSavings.toFixed(0)}
                  </p>
                  <div className="flex items-center gap-1 pt-1 border-t border-border/50">
                    {savingsTrend >= 0 ? (
                      <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-destructive" />
                    )}
                    <span
                      className={cn(
                        'text-xs font-bold',
                        savingsTrend >= 0 ? 'text-emerald-500' : 'text-destructive',
                      )}
                    >
                      {Math.abs(savingsTrend).toFixed(1)}%{' '}
                      {savingsTrend >= 0 ? 'a mais' : 'a menos'}
                    </span>
                    <span className="text-[10px] text-muted-foreground ml-1 font-medium">
                      vs mês ant.
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-4 bg-amber-500/10 rounded-full">
                <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Nota Geral
                </p>
                <h2 className="text-4xl font-extrabold text-foreground">{avgRating}</h2>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <MessageSquareHeart className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Avaliações 5 Estrelas
                </p>
                <h2 className="text-4xl font-extrabold text-foreground">{fiveStarCount}</h2>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm flex flex-col justify-center">
            <CardContent className="p-6">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Conquistas
              </p>
              <div className="flex flex-col gap-2">
                {isHighPerformance ? (
                  <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30 py-1.5 px-3 text-sm justify-center w-full">
                    <Trophy className="w-4 h-4 mr-2" /> Alta Performance
                  </Badge>
                ) : isExpert ? (
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 py-1.5 px-3 text-sm justify-center w-full">
                    <Award className="w-4 h-4 mr-2" /> Fornecedor Expert
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground italic text-center w-full block py-1.5">
                    Faltam {10 - fiveStarCount} avaliações 5 estrelas para a primeira conquista!
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border shadow-sm h-full">
            <CardHeader>
              <CardTitle className="text-lg">Destaques Positivos</CardTitle>
              <p className="text-sm text-muted-foreground">
                Palavras mais frequentes nos comentários 5 estrelas.
              </p>
            </CardHeader>
            <CardContent>
              {wordCloud.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground border-dashed border-2 border-border/50 rounded-xl bg-secondary/20">
                  Receba mais avaliações para gerar seus destaques.
                </div>
              ) : (
                <div className="flex flex-wrap gap-3 p-4 bg-secondary/20 rounded-xl border border-border">
                  {wordCloud.map((w) => (
                    <Badge
                      key={w.text}
                      variant="outline"
                      className="text-sm capitalize py-1.5 px-3 border-primary/30 bg-primary/5 text-primary shadow-sm hover:scale-105 transition-transform cursor-default"
                      style={{
                        fontSize: `${Math.max(0.8, Math.min(1.5, 0.8 + w.value * 0.1))}rem`,
                      }}
                    >
                      {w.text} ({w.value})
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Evolução da Reputação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={trendData}
                      margin={{ top: 20, right: 20, bottom: 20, left: -20 }}
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
                        className="text-xs font-medium"
                      />
                      <YAxis
                        domain={[0, 5]}
                        ticks={[0, 1, 2, 3, 4, 5]}
                        allowDecimals={false}
                        tickLine={false}
                        axisLine={false}
                      />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        cursor={{ stroke: 'hsl(var(--secondary))', strokeWidth: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="rating"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={{ r: 5, fill: 'hsl(var(--primary))' }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={redeemModalOpen} onOpenChange={setRedeemModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Resgate</DialogTitle>
            <DialogDescription>
              Você está prestes a utilizar seus pontos de fidelidade.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="bg-secondary p-4 rounded-xl border border-border flex justify-between items-center">
              <span className="font-semibold text-foreground">{selectedReward?.name}</span>
              <span className="text-xl font-bold text-primary">-{selectedReward?.points} pts</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Seu saldo final será de{' '}
              <strong className="text-foreground">
                {points - (selectedReward?.points || 0)} pontos
              </strong>
              .
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRedeemModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleRedeem}>Confirmar Resgate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hidden Printable PDF Layout */}
      <div className="hidden print:block print:bg-white print:text-black print:absolute print:inset-0 print:z-[99999] print:p-12 print:min-h-screen font-sans">
        <div className="flex items-center justify-between border-b-4 border-black pb-6 mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tighter">e-eventos</h1>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mt-1">
              Plataforma de Locação
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">Relatório Oficial de Desempenho</p>
            <p className="text-gray-500 text-sm mt-1">
              Gerado em {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-5xl font-extrabold mb-3">{companyProfile.name}</h2>
          <p className="text-gray-700 text-xl font-medium mb-4">{companyProfile.specialties}</p>
          <div className="flex items-center gap-2 mb-6">
            <div className="px-4 py-1.5 bg-black text-white text-sm font-bold uppercase tracking-wider rounded-full">
              Fornecedor Verificado
            </div>
            {isHighPerformance && (
              <div className="px-4 py-1.5 border-2 border-amber-500 text-amber-600 text-sm font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                ★ Alta Performance
              </div>
            )}
            {isExpert && !isHighPerformance && (
              <div className="px-4 py-1.5 border-2 border-purple-500 text-purple-600 text-sm font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                ★ Fornecedor Expert
              </div>
            )}
          </div>
          {companyProfile.observations && (
            <p className="text-gray-600 leading-relaxed text-lg bg-gray-50 p-6 rounded-2xl border border-gray-200">
              "{companyProfile.observations}"
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-8 mb-12 border-y-2 border-gray-200 py-10">
          <div className="text-center border-r-2 border-gray-200">
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-2">
              Avaliação Média
            </p>
            <p className="text-6xl font-black">{avgRating}</p>
            <p className="text-amber-500 text-3xl mt-2">★★★★★</p>
          </div>
          <div className="text-center border-r-2 border-gray-200">
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-2">
              Total de Avaliações
            </p>
            <p className="text-6xl font-black">{myReviews.length}</p>
            <p className="text-gray-400 text-lg font-medium mt-2">clientes atendidos</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-2">
              Excelência Comprovada
            </p>
            <p className="text-6xl font-black">{fiveStarCount}</p>
            <p className="text-gray-400 text-lg font-medium mt-2">avaliações 5 estrelas</p>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-2xl font-bold border-b border-gray-200 pb-3 mb-6">
            O que os clientes mais elogiam
          </h3>
          {wordCloud.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {wordCloud.map((w) => (
                <span
                  key={w.text}
                  className="px-5 py-2.5 bg-gray-100 border border-gray-300 text-gray-800 font-bold rounded-xl uppercase tracking-wider"
                  style={{ fontSize: `${Math.max(0.8, Math.min(1.5, 0.8 + w.value * 0.1))}rem` }}
                >
                  {w.text}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">Sem dados suficientes para destaque.</p>
          )}
        </div>

        <div className="mt-auto pt-10 border-t border-gray-200 flex justify-between items-center text-sm text-gray-400 font-medium">
          <span>Este relatório é gerado automaticamente pelo sistema e-eventos.</span>
          <span>app-locadora-eventos.com</span>
        </div>
      </div>
    </>
  )
}

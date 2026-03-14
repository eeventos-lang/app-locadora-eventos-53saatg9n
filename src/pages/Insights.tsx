import { useMemo } from 'react'
import { LineChart as LineChartIcon, Star, Trophy, MessageSquareHeart, Award } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { useApp } from '@/store/AppContext'

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
  const { currentUser, role, reviews } = useApp()

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
        // Simple extraction logic
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

  // Mock trend data based on reviews length or fallback
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
    // Very simple mock grouping just for visual representation
    return [
      { month: 'Mês 1', rating: 4.0 },
      { month: 'Mês 2', rating: 4.5 },
      { month: 'Mês 3', rating: 4.8 },
      { month: 'Atual', rating: Number(avgRating) },
    ]
  }, [myReviews.length, avgRating])

  const chartConfig = { rating: { label: 'Avaliação Média', color: 'hsl(var(--primary))' } }

  if (role !== 'company') {
    return (
      <div className="p-8 text-center text-muted-foreground animate-fade-in">
        Acesso exclusivo para fornecedores.
      </div>
    )
  }

  const isExpert = fiveStarCount >= 10
  const isHighPerformance = fiveStarCount >= 25

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto animate-slide-up pb-12">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <LineChartIcon className="w-8 h-8 text-primary" />
          Insights & Desempenho
        </h1>
        <p className="text-muted-foreground">
          Acompanhe a evolução da sua reputação na plataforma e entenda os pontos fortes do seu
          serviço.
        </p>
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
              Conquistas (Gamificação)
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
                {wordCloud.map((w, i) => (
                  <Badge
                    key={w.text}
                    variant="outline"
                    className="text-sm capitalize py-1.5 px-3 border-primary/30 bg-primary/5 text-primary shadow-sm hover:scale-105 transition-transform cursor-default"
                    style={{ fontSize: `${Math.max(0.8, Math.min(1.5, 0.8 + w.value * 0.1))}rem` }}
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
  )
}

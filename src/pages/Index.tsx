import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Speaker,
  Lightbulb,
  Layers,
  ClipboardList,
  ArrowRight,
  CalendarPlus,
  TrendingUp,
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Index() {
  return (
    <div className="flex flex-col gap-16 animate-in fade-in duration-500 pb-12">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center space-y-6 pt-12 md:pt-20 pb-8 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
          Experiência Premium em <span className="text-muted-foreground">Eventos</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
          Conectamos você aos melhores serviços de locação e estrutura para o seu evento. Qualidade,
          confiança e excelência com a assinatura LH Show Eventos.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
          <Link to="/demandas" className="w-full sm:w-auto">
            <Button size="lg" className="w-full gap-2 text-base h-12 px-8 shadow-md">
              <CalendarPlus className="h-5 w-5" />
              Nova Demanda
            </Button>
          </Link>
          <Link to="/perfil" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full gap-2 text-base h-12 px-8">
              Meu Perfil
            </Button>
          </Link>
        </div>
      </section>

      {/* Services Showcase Grid */}
      <section className="space-y-8">
        <div className="flex flex-col items-center text-center space-y-3 mb-4">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Nossos Serviços Principais
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            Tudo o que você precisa para tornar seu evento inesquecível, com equipamentos de última
            geração e profissionais capacitados.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-lg transition-all duration-300 border-border bg-card group">
            <CardHeader>
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-4 text-foreground group-hover:scale-110 transition-transform">
                <Speaker className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">Sonorização</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground text-sm leading-relaxed">
                Sistemas de som profissionais para todos os tamanhos de eventos, garantindo clareza
                e potência acústica superior.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-all duration-300 border-border bg-card group">
            <CardHeader>
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-4 text-foreground group-hover:scale-110 transition-transform">
                <Lightbulb className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">Iluminação</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground text-sm leading-relaxed">
                Projetos luminotécnicos incríveis, iluminação cênica e pista de dança para criar a
                atmosfera perfeita e marcante.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-all duration-300 border-border bg-card group">
            <CardHeader>
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-4 text-foreground group-hover:scale-110 transition-transform">
                <Layers className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">Estruturas</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground text-sm leading-relaxed">
                Grids, palcos e tendas com montagem segura, acabamento premium e design moderno para
                suportar todo o seu evento.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-all duration-300 border-border bg-card group">
            <CardHeader>
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-4 text-foreground group-hover:scale-110 transition-transform">
                <ClipboardList className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">Planejamento</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground text-sm leading-relaxed">
                Assessoria e cerimonial dedicados para garantir que cada detalhe do seu evento
                ocorra exatamente como sonhado.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="space-y-6 pt-10 border-t border-border mt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Painel de Atividades
            </h2>
            <p className="text-muted-foreground mt-1">
              Resumo das suas locações e demandas recentes.
            </p>
          </div>
          <Link to="/demandas">
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
              Ver todas as demandas <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Total de Demandas
              </CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">128</div>
              <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> +14% este mês
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Locações Ativas
              </CardTitle>
              <CalendarPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">42</div>
              <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> +5% este mês
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-primary/20 bg-primary/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-primary">Aviso do Sistema</CardTitle>
              <span className="flex h-2 w-2 rounded-full bg-primary"></span>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground font-medium leading-relaxed">
                Bem-vindo à nova interface do e-eventos! Explore os recursos atualizados e aproveite
                a melhor experiência.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

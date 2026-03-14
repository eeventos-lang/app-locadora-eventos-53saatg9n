import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarPlus, ClipboardList, TrendingUp, Users, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Index() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Painel e-eventos</h1>
          <p className="text-slate-500 mt-1">Bem-vindo(a) ao seu hub de gestão de locações.</p>
        </div>
        <Link to="/demandas">
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
            <CalendarPlus className="h-4 w-4" />
            Nova Demanda
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total de Demandas</CardTitle>
            <ClipboardList className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">128</div>
            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> +14% este mês
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Locações Ativas</CardTitle>
            <CalendarPlus className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">42</div>
            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> +5% este mês
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Novos Clientes</CardTitle>
            <Users className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">24</div>
            <p className="text-xs text-slate-500 mt-1">Cadastrados nos últimos 30 dias</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Faturamento Previsto
            </CardTitle>
            <span className="h-4 w-4 text-purple-600 font-bold flex items-center justify-center">
              R$
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">R$ 45.231</div>
            <p className="text-xs text-slate-500 mt-1">Para os próximos 30 dias</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Últimas Demandas</CardTitle>
              <CardDescription>Resumo das atividades recentes no sistema.</CardDescription>
            </div>
            <Link to="/demandas">
              <Button variant="ghost" size="sm" className="gap-1 text-blue-600 hover:text-blue-700">
                Ver todas <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-lg border p-3 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 shrink-0">
                    <CalendarPlus className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-sm font-medium leading-none truncate">
                      Casamento Silva & Souza
                    </p>
                    <p className="text-sm text-slate-500 truncate">Mobiliário e Iluminação</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full inline-block">
                      Pendente
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Há 2 horas</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-blue-900">Avisos</CardTitle>
            <CardDescription className="text-blue-700/70">
              Atualizações da plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-white/70 p-4 text-sm text-blue-950 shadow-sm border border-white">
              <p className="mb-2 font-semibold flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
                Nova Identidade Visual
              </p>
              <p className="leading-relaxed">
                Bem-vindo ao <strong>e-eventos</strong>! Nossa plataforma mudou de nome e identidade
                visual para refletir melhor nossa marca profissional. Aproveite as funcionalidades!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

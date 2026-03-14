import { Link } from 'react-router-dom'
import { Plus, Speaker, MapPin, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useApp } from '@/store/AppContext'
import { SERVICES } from '@/lib/services'

const Index = () => {
  const { role, demands, isSubscribed } = useApp()

  if (role === 'customer') {
    const myDemands = demands.slice(0, 2)
    return (
      <div className="p-6 space-y-8 animate-slide-up">
        <section className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold">Olá, Organizador!</h1>
            <p className="text-muted-foreground text-sm mt-1">
              O que você precisa para o seu próximo evento?
            </p>
          </div>

          <Link to="/novo-evento" className="block">
            <Card className="bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/30 hover:border-primary/50 transition-colors cursor-pointer group">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-lg text-white group-hover:text-primary transition-colors">
                    Criar Nova Demanda
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">Receba propostas em minutos</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-[0_0_15px_rgba(0,82,255,0.5)] group-hover:scale-105 transition-transform">
                  <Plus className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </section>

        <section>
          <h3 className="font-semibold mb-4 text-white">Categorias Populares</h3>
          <div className="grid grid-cols-4 gap-4">
            {[SERVICES[0], SERVICES[4], SERVICES[7], SERVICES[12]].map((cat, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center">
                  <cat.icon className={`w-6 h-6 ${cat.color}`} />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground text-center leading-tight">
                  {cat.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Minhas Demandas Recentes</h3>
            <Link to="/demandas" className="text-xs font-medium text-primary flex items-center">
              Ver todas <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
          <div className="space-y-3">
            {myDemands.map((demand) => (
              <Card key={demand.id} className="bg-card/50 border-border overflow-hidden">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-sm text-white">{demand.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {demand.proposals} propostas recebidas
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-accent font-semibold text-sm">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(demand.budget)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    )
  }

  // Company View
  if (!isSubscribed) {
    return (
      <div className="p-6 space-y-6 animate-slide-up flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
          <Speaker className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold">Assinatura Necessária</h2>
        <p className="text-muted-foreground text-sm max-w-[250px]">
          Assine o plano Premium no seu perfil para visualizar as demandas de clientes e enviar
          orçamentos.
        </p>
        <Button asChild className="mt-4">
          <Link to="/perfil">Ir para Perfil</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Painel de Oportunidades</h1>
          <p className="text-muted-foreground text-sm mt-1">Encontre novos clientes agora</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{demands.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Demandas Abertas</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent">12</div>
            <p className="text-xs text-muted-foreground mt-1">Eventos Fechados</p>
          </CardContent>
        </Card>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">Últimas Demandas Publicadas</h3>
        </div>
        <div className="space-y-4">
          {demands.slice(0, 3).map((demand) => (
            <Link key={demand.id} to={`/demanda/${demand.id}`} className="block">
              <Card className="bg-card border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-white line-clamp-1">{demand.title}</h4>
                    <span className="bg-primary/20 text-primary text-[10px] px-2 py-1 rounded-full font-medium whitespace-nowrap ml-2">
                      Nova
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {demand.location}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      {(() => {
                        const activeReqs = SERVICES.filter(
                          (s) => demand.requirements[s.id as keyof typeof demand.requirements],
                        )
                        return (
                          <>
                            <div className="flex gap-1.5">
                              {activeReqs.slice(0, 3).map((req) => (
                                <req.icon key={req.id} className={`w-4 h-4 ${req.color}`} />
                              ))}
                            </div>
                            {activeReqs.length > 3 && (
                              <span className="text-[10px] text-muted-foreground font-medium">
                                +{activeReqs.length - 3}
                              </span>
                            )}
                          </>
                        )
                      })()}
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground mb-0.5">Valor Líquido</p>
                      <span className="text-accent font-semibold text-sm">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(demand.budget * 0.9)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <Button
          asChild
          variant="outline"
          className="w-full mt-4 bg-transparent border-primary/30 text-primary hover:bg-primary/10"
        >
          <Link to="/demandas">Ver Todas as Demandas</Link>
        </Button>
      </section>
    </div>
  )
}

export default Index

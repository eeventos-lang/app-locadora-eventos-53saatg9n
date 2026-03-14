import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/store/AppContext'
import { SERVICES } from '@/lib/services'

const Demands = () => {
  const { role, demands, isSubscribed, companyProfile } = useApp()

  const activeSector = SERVICES.find((s) => s.id === companyProfile?.sector)

  const filteredDemands = useMemo(() => {
    if (role === 'customer') return demands
    if (!companyProfile?.sector) return []
    return demands.filter(
      (d) => d.requirements[companyProfile.sector as keyof typeof d.requirements],
    )
  }, [demands, role, companyProfile?.sector])

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
    <div className="space-y-6 animate-slide-up pb-12">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          {role === 'customer'
            ? 'Meus Eventos'
            : activeSector
              ? `Oportunidades: ${activeSector.label}`
              : 'Demandas Disponíveis'}
        </h1>
      </div>

      <div className="space-y-4">
        {filteredDemands.length === 0 ? (
          <div className="text-center text-muted-foreground py-16 border-2 border-dashed border-border rounded-xl bg-secondary/30">
            {role === 'company' && companyProfile?.sector
              ? `Não há demandas de ${activeSector?.label.toLowerCase()} no momento.`
              : role === 'company'
                ? 'Configure seu setor no perfil para ver oportunidades.'
                : 'Nenhuma demanda encontrada no momento.'}
          </div>
        ) : (
          filteredDemands.map((demand) => (
            <Link key={demand.id} to={`/demands/${demand.id}`} className="block">
              <Card className="hover:shadow-md transition-all duration-300 border-border group bg-card">
                <CardContent className="p-0">
                  <div className="p-5 md:p-6 space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <h2 className="font-semibold text-foreground text-lg md:text-xl leading-tight group-hover:text-primary transition-colors">
                        {demand.title}
                      </h2>
                      {demand.status === 'open' && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] uppercase tracking-wider font-bold bg-primary/10 text-primary hover:bg-primary/20 shrink-0"
                        >
                          Aberto
                        </Badge>
                      )}
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
                    </div>

                    <div className="flex items-center justify-between pt-5 border-t border-border">
                      <div className="flex gap-2 items-center flex-wrap">
                        {(() => {
                          const activeReqs = SERVICES.filter(
                            (s) => demand.requirements[s.id as keyof typeof demand.requirements],
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
                          {role === 'customer' ? 'Orçamento' : 'Valor Líquido'}
                        </p>
                        <p className="text-foreground font-bold text-lg md:text-xl">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(role === 'customer' ? demand.budget : demand.budget * 0.9)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

export default Demands

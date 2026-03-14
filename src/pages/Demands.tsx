import { Link } from 'react-router-dom'
import { Calendar, MapPin, Speaker, Lightbulb, Monitor, Layers } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/store/AppContext'

const Demands = () => {
  const { role, demands, isSubscribed } = useApp()

  if (role === 'company' && !isSubscribed) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[70vh] text-center animate-slide-up">
        <h2 className="text-xl font-bold mb-2">Acesso Restrito</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Ative sua assinatura premium para visualizar as demandas disponíveis.
        </p>
        <Link to="/perfil" className="px-6 py-2 bg-primary text-white rounded-md font-medium">
          Assinar Agora
        </Link>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 animate-slide-up">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">
          {role === 'customer' ? 'Meus Eventos' : 'Demandas Disponíveis'}
        </h1>
      </div>

      <div className="space-y-4">
        {demands.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">Nenhuma demanda encontrada.</div>
        ) : (
          demands.map((demand) => (
            <Link key={demand.id} to={`/demanda/${demand.id}`} className="block">
              <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 overflow-hidden group">
                <CardContent className="p-0">
                  <div className="p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <h2 className="font-semibold text-white text-lg leading-tight group-hover:text-primary transition-colors">
                        {demand.title}
                      </h2>
                      {demand.status === 'open' && (
                        <Badge
                          variant="secondary"
                          className="bg-primary/20 text-primary border-none text-[10px] uppercase tracking-wider font-bold"
                        >
                          Aberto
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(demand.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{demand.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="flex gap-2">
                        {demand.requirements.sound && (
                          <div className="p-1.5 bg-blue-500/10 rounded-md">
                            <Speaker className="w-4 h-4 text-blue-400" />
                          </div>
                        )}
                        {demand.requirements.lighting && (
                          <div className="p-1.5 bg-yellow-500/10 rounded-md">
                            <Lightbulb className="w-4 h-4 text-yellow-400" />
                          </div>
                        )}
                        {demand.requirements.led && (
                          <div className="p-1.5 bg-purple-500/10 rounded-md">
                            <Monitor className="w-4 h-4 text-purple-400" />
                          </div>
                        )}
                        {demand.requirements.grid && (
                          <div className="p-1.5 bg-gray-500/10 rounded-md">
                            <Layers className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-muted-foreground mb-0.5">
                          {role === 'customer' ? 'Orçamento' : 'Valor Líquido'}
                        </p>
                        <p className="text-accent font-bold text-base">
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

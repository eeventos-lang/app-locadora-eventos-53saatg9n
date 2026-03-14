import { useParams, useNavigate } from 'react-router-dom'
import { Calendar, MapPin, DollarSign, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useApp } from '@/store/AppContext'
import { SERVICES } from '@/lib/services'

const DemandDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { role, demands } = useApp()

  const demand = demands.find((d) => d.id === id)

  if (!demand) {
    return <div className="p-6 text-center text-muted-foreground">Demanda não encontrada.</div>
  }

  const handleProposal = () => {
    toast({
      title: 'Proposta Enviada!',
      description: 'O cliente receberá sua notificação em breve.',
    })
    navigate('/demandas')
  }

  return (
    <div className="flex flex-col animate-slide-up relative min-h-full">
      <div className="p-6 space-y-6 flex-1">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">{demand.title}</h2>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{new Date(demand.date).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>{demand.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>{demand.guests} convidados</span>
            </div>
          </div>
        </div>

        <Card className="bg-card border-border border-l-4 border-l-accent overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                {role === 'customer' ? 'Orçamento Estimado' : 'Valor Líquido (-10% Taxa)'}
              </p>
              <p className="text-2xl font-bold text-accent mt-1 flex items-center gap-2">
                <DollarSign className="w-6 h-6" />
                {new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(
                  role === 'customer' ? demand.budget : demand.budget * 0.9,
                )}
              </p>
            </div>
            {role === 'customer' && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  Propostas
                </p>
                <p className="text-xl font-bold text-white mt-1">{demand.proposals}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <section className="space-y-4">
          <h3 className="font-semibold text-white text-lg">Serviços Solicitados</h3>
          <div className="grid grid-cols-2 gap-3">
            {SERVICES.map(({ id, icon: Icon, label, color, bg }) => {
              if (!demand.requirements[id as keyof typeof demand.requirements]) return null
              return (
                <div
                  key={id}
                  className={`${bg} border border-border rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2`}
                >
                  <Icon className={`w-8 h-8 ${color}`} />
                  <span className="text-xs font-medium text-white">{label}</span>
                </div>
              )
            })}
          </div>
        </section>

        {demand.requirements.details && (
          <section className="space-y-3">
            <h3 className="font-semibold text-white text-lg">Detalhes Adicionais</h3>
            <div className="bg-card border border-border rounded-xl p-4 text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {demand.requirements.details}
            </div>
          </section>
        )}
      </div>

      {role === 'company' && (
        <div className="sticky bottom-0 w-full p-4 bg-background/95 backdrop-blur border-t border-border/50 z-40 mt-auto">
          <Button
            onClick={handleProposal}
            className="w-full h-14 text-lg font-semibold shadow-[0_4px_20px_0_rgba(0,82,255,0.4)] transition-transform active:scale-95"
          >
            Responder / Orçamento
          </Button>
        </div>
      )}
    </div>
  )
}

export default DemandDetail

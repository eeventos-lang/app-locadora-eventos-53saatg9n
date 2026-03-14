import { useParams, useNavigate } from 'react-router-dom'
import { Calendar, MapPin, DollarSign, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useApp } from '@/store/AppContext'
import { SERVICES } from '@/lib/services'
import { BackButton } from '@/components/BackButton'

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
    <div className="flex flex-col animate-slide-up relative min-h-full space-y-6 pb-24">
      <div className="flex items-center gap-2">
        <BackButton className="-ml-2" />
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex-1 truncate tracking-tight">
          {demand.title}
        </h1>
      </div>

      <div className="space-y-8 flex-1">
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-full">
            <Calendar className="w-4 h-4" />
            <span className="font-medium">{new Date(demand.date).toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-full">
            <MapPin className="w-4 h-4" />
            <span className="font-medium">{demand.location}</span>
          </div>
          <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-full">
            <Users className="w-4 h-4" />
            <span className="font-medium">{demand.guests} convidados</span>
          </div>
        </div>

        <Card className="border-border border-l-4 border-l-primary overflow-hidden shadow-sm">
          <CardContent className="p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-2">
                {role === 'customer' ? 'Orçamento Estimado' : 'Valor Líquido (-10% Taxa)'}
              </p>
              <p className="text-4xl font-extrabold text-foreground flex items-center gap-2">
                <DollarSign className="w-8 h-8 text-primary" />
                {new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(
                  role === 'customer' ? demand.budget : demand.budget * 0.9,
                )}
              </p>
            </div>
            {role === 'customer' && (
              <div className="sm:text-right bg-secondary p-5 rounded-xl border border-border/50">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">
                  Propostas Recebidas
                </p>
                <p className="text-3xl font-bold text-foreground">{demand.proposals}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <section className="space-y-4">
          <h3 className="font-semibold text-foreground text-xl border-b border-border pb-2">
            Serviços Solicitados
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-2">
            {SERVICES.map(({ id, icon: Icon, label, color, bg }) => {
              if (!demand.requirements[id as keyof typeof demand.requirements]) return null
              return (
                <div
                  key={id}
                  className={`${bg} border border-border rounded-xl p-5 flex flex-col items-center justify-center text-center gap-3 transition-transform hover:scale-105`}
                >
                  <Icon className={`w-8 h-8 ${color}`} />
                  <span className="text-sm font-semibold text-foreground">{label}</span>
                </div>
              )
            })}
          </div>
        </section>

        {demand.requirements.details && (
          <section className="space-y-4">
            <h3 className="font-semibold text-foreground text-xl border-b border-border pb-2">
              Detalhes Adicionais
            </h3>
            <div className="bg-card border border-border rounded-xl p-6 text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed shadow-sm">
              {demand.requirements.details}
            </div>
          </section>
        )}
      </div>

      {role === 'company' && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-md border-t border-border z-40 md:sticky md:bg-transparent md:backdrop-blur-none md:border-t-0 md:p-0">
          <Button
            size="lg"
            onClick={handleProposal}
            className="w-full h-14 text-lg font-semibold shadow-lg"
          >
            Responder Demanda
          </Button>
        </div>
      )}
    </div>
  )
}

export default DemandDetail

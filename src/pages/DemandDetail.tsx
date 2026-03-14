import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, MapPin, DollarSign } from 'lucide-react'
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
    <div className="min-h-screen bg-background flex flex-col animate-slide-up relative z-50 pb-20">
      <header className="flex items-center p-4 border-b border-border/50 sticky top-0 bg-background/95 backdrop-blur z-10">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-muted-foreground hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-semibold ml-2 text-white">Detalhes da Demanda</h1>
      </header>

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
          </div>
        </div>

        <Card className="bg-card border-border border-l-4 border-l-accent overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                {role === 'customer' ? 'Orçamento Cliente' : 'Valor Líquido (-10% Taxa)'}
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
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border/50 max-w-md mx-auto">
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

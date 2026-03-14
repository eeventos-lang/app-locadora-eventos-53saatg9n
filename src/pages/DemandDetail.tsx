import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Calendar, MapPin, DollarSign, Users, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useApp } from '@/store/AppContext'
import { SERVICES } from '@/lib/services'
import { BackButton } from '@/components/BackButton'

const DemandDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { role, demands, proposals, addProposal, acceptProposal, currentUser, companyProfile } =
    useApp()

  const [isProposalOpen, setIsProposalOpen] = useState(false)
  const [proposalValue, setProposalValue] = useState('')
  const [proposalMessage, setProposalMessage] = useState('')

  const demand = demands.find((d) => d.id === id)

  if (!demand) {
    return <div className="p-6 text-center text-muted-foreground">Demanda não encontrada.</div>
  }

  const demandProposals = proposals.filter((p) => p.demandId === demand.id)

  const supplierProposal =
    role === 'company' ? demandProposals.find((p) => p.supplierId === currentUser?.id) : null

  const handleSubmitProposal = () => {
    if (!proposalValue || !proposalMessage) {
      toast({
        title: 'Atenção',
        description: 'Preencha o valor e a mensagem.',
        variant: 'destructive',
      })
      return
    }

    addProposal({
      demandId: demand.id,
      supplierId: currentUser?.id || 'unknown',
      supplierName: companyProfile?.name || currentUser?.name || 'Fornecedor',
      value: Number(proposalValue),
      message: proposalMessage,
    })

    toast({
      title: 'Proposta Enviada!',
      description: 'O cliente receberá sua notificação em breve.',
    })
    setIsProposalOpen(false)
  }

  const handleAccept = (proposalId: string) => {
    acceptProposal(proposalId)
    toast({
      title: 'Proposta Aceita',
      description: 'O fornecedor será notificado. Evento concluído com sucesso!',
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20 uppercase tracking-wider font-bold shrink-0">
            Pendente
          </Badge>
        )
      case 'negotiating':
        return (
          <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20 uppercase tracking-wider font-bold shrink-0">
            Em negociação
          </Badge>
        )
      case 'completed':
        return (
          <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20 uppercase tracking-wider font-bold shrink-0">
            Concluído
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col animate-slide-up relative min-h-full space-y-6 pb-24 p-4 sm:p-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between gap-4 mb-2 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <BackButton className="-ml-2" />
          <h1 className="text-2xl md:text-3xl font-bold text-foreground truncate tracking-tight">
            {demand.title}
          </h1>
        </div>
        {getStatusBadge(demand.status)}
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
                <p className="text-3xl font-bold text-foreground">{demandProposals.length}</p>
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

        {role === 'customer' && (
          <section className="space-y-4 mt-8 animate-fade-in">
            <h3 className="font-semibold text-foreground text-xl border-b border-border pb-2">
              Propostas Recebidas ({demandProposals.length})
            </h3>
            {demandProposals.length === 0 ? (
              <div className="bg-secondary/30 border-2 border-dashed border-border rounded-xl p-8 text-sm text-muted-foreground text-center">
                Nenhuma proposta recebida até o momento.
              </div>
            ) : (
              <div className="space-y-4">
                {demandProposals.map((proposal) => (
                  <Card
                    key={proposal.id}
                    className="border-border shadow-sm hover:border-primary/50 transition-colors bg-card"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-foreground flex items-center gap-2 flex-wrap">
                            {proposal.supplierName}
                            {proposal.status === 'accepted' && (
                              <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
                                Aceita
                              </Badge>
                            )}
                            {proposal.status === 'rejected' && (
                              <Badge variant="secondary">Recusada</Badge>
                            )}
                          </h4>
                          <div className="mt-4 flex items-start gap-3 bg-secondary/50 p-4 rounded-lg">
                            <MessageSquare className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                              {proposal.message}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-start md:items-end justify-between min-w-[140px] border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                          <div className="text-left md:text-right w-full mb-4">
                            <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1">
                              Valor Proposto
                            </p>
                            <span className="text-2xl font-bold text-primary">
                              {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              }).format(proposal.value)}
                            </span>
                          </div>
                          {proposal.status === 'pending' && demand.status !== 'completed' && (
                            <Button
                              onClick={() => handleAccept(proposal.id)}
                              className="w-full shadow-sm"
                            >
                              Aceitar Proposta
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {role === 'company' && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-md border-t border-border z-40 md:sticky md:bg-transparent md:backdrop-blur-none md:border-t-0 md:p-0 mt-6">
          {supplierProposal ? (
            <div className="p-5 bg-secondary rounded-xl text-center border border-border shadow-sm flex flex-col items-center gap-2">
              <Badge
                variant={supplierProposal.status === 'accepted' ? 'default' : 'secondary'}
                className="mb-1 text-xs"
              >
                {supplierProposal.status === 'accepted'
                  ? 'Proposta Aceita'
                  : supplierProposal.status === 'rejected'
                    ? 'Proposta Recusada'
                    : 'Proposta Enviada'}
              </Badge>
              <p className="text-sm text-muted-foreground">
                Sua proposta de{' '}
                <strong className="text-foreground">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    supplierProposal.value,
                  )}
                </strong>{' '}
                foi registrada.
              </p>
            </div>
          ) : demand.status === 'completed' ? (
            <div className="p-5 bg-secondary rounded-xl text-center border border-border shadow-sm text-muted-foreground">
              Esta demanda já foi concluída.
            </div>
          ) : (
            <Dialog open={isProposalOpen} onOpenChange={setIsProposalOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="w-full h-14 text-lg font-semibold shadow-lg">
                  Enviar Proposta
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Enviar Proposta Comercial</DialogTitle>
                  <DialogDescription>
                    Descreva os detalhes da sua oferta e o valor final. O cliente será notificado
                    instantaneamente.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="value" className="font-semibold">
                      Valor da Proposta (R$)
                    </Label>
                    <Input
                      id="value"
                      type="number"
                      placeholder="Ex: 5000"
                      value={proposalValue}
                      onChange={(e) => setProposalValue(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="font-semibold">
                      Mensagem / Detalhes
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Descreva o que está incluso no seu serviço, prazos, etc..."
                      className="min-h-[120px] resize-none"
                      value={proposalMessage}
                      onChange={(e) => setProposalMessage(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsProposalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSubmitProposal}>Enviar ao Cliente</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}
    </div>
  )
}

export default DemandDetail

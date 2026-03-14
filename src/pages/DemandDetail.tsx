import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Calendar,
  MapPin,
  DollarSign,
  Users,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useApp, TechRequirement } from '@/store/AppContext'
import { SERVICES } from '@/lib/services'
import { BackButton } from '@/components/BackButton'
import { cn } from '@/lib/utils'

const DemandDetail = () => {
  const { id } = useParams()
  const { toast } = useToast()
  const {
    role,
    demands,
    proposals,
    addProposal,
    acceptProposal,
    signContracts,
    payEvent,
    updateSectorStatus,
    disputeService,
    currentUser,
    companyProfile,
    reviews,
    addReview,
  } = useApp()

  const [isProposalOpen, setIsProposalOpen] = useState(false)
  const [proposalValue, setProposalValue] = useState('')
  const [proposalMessage, setProposalMessage] = useState('')
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)

  const [isDisputeOpen, setIsDisputeOpen] = useState(false)
  const [disputeReason, setDisputeReason] = useState('')
  const [disputeSector, setDisputeSector] = useState('')

  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [reviewSupplierId, setReviewSupplierId] = useState('')
  const [reviewSupplierName, setReviewSupplierName] = useState('')
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const [hoverRating, setHoverRating] = useState(0)

  const demand = demands.find((d) => d.id === id)

  const applicableSectors = demand
    ? SERVICES.filter(
        (s) =>
          demand.requirements[s.id as keyof TechRequirement] &&
          companyProfile?.sectors?.includes(s.id),
      )
    : []

  const [selectedSectors, setSelectedSectors] = useState<string[]>(
    applicableSectors.map((s) => s.id),
  )

  if (!demand) {
    return <div className="p-6 text-center text-muted-foreground">Demanda não encontrada.</div>
  }

  const demandProposals = proposals.filter((p) => p.demandId === demand.id)

  const supplierProposal =
    role === 'company' ? demandProposals.find((p) => p.supplierId === currentUser?.id) : null

  const getDisplayBudget = () => {
    if (role === 'customer') return demand.budget
    let sum = 0
    if (demand.budgetBreakdown) {
      companyProfile?.sectors?.forEach((s) => {
        if (
          demand.requirements[s as keyof typeof demand.requirements] &&
          demand.budgetBreakdown?.[s]
        ) {
          sum += demand.budgetBreakdown[s]
        }
      })
    } else {
      return demand.budget * 0.9
    }
    return sum * 0.9
  }

  const handleSubmitProposal = () => {
    if (!proposalValue || !proposalMessage || selectedSectors.length === 0) {
      toast({
        title: 'Atenção',
        description: 'Preencha o valor, a mensagem e selecione pelo menos um serviço.',
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
      offeredSectors: selectedSectors,
    })

    toast({
      title: 'Proposta Enviada!',
      description: 'O cliente receberá sua notificação com a garantia da plataforma em breve.',
    })
    setIsProposalOpen(false)
  }

  const handleAccept = (proposalId: string) => {
    acceptProposal(proposalId)
    toast({
      title: 'Fornecedor Selecionado',
      description: 'O serviço foi marcado como atendido para esta etapa do evento.',
    })
  }

  const handleReviewSubmit = () => {
    if (reviewRating === 0 || !reviewComment.trim()) {
      toast({
        title: 'Atenção',
        description: 'Por favor, selecione uma nota e escreva um comentário.',
        variant: 'destructive',
      })
      return
    }

    addReview({
      demandId: demand.id,
      customerId: currentUser?.id || 'unknown',
      supplierId: reviewSupplierId,
      rating: reviewRating,
      comment: reviewComment,
    })

    toast({
      title: 'Avaliação Enviada',
      description: 'Sua opinião é muito importante e ajuda outros clientes!',
    })

    setIsReviewOpen(false)
    setReviewRating(0)
    setReviewComment('')
  }

  const getStatusBadge = () => {
    const hasDispute = Object.values(demand.sectorStatus || {}).some((s) => s === 'disputed')
    if (hasDispute) {
      return (
        <Badge className="bg-red-500/10 text-red-600 border-red-500/20 uppercase tracking-wider font-bold shrink-0">
          Em Disputa
        </Badge>
      )
    }

    if (demand.paymentStatus === 'completed') {
      return (
        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 uppercase tracking-wider font-bold shrink-0">
          Concluído
        </Badge>
      )
    }
    if (demand.paymentStatus === 'escrow') {
      return (
        <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 uppercase tracking-wider font-bold shrink-0">
          Serviço Pago
        </Badge>
      )
    }
    if (
      demand.paymentStatus === 'pending_payment' ||
      demand.paymentStatus === 'pending_signature'
    ) {
      return (
        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 uppercase tracking-wider font-bold shrink-0">
          Aguardando Ação
        </Badge>
      )
    }
    if (demand.status === 'pending') {
      return (
        <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 uppercase tracking-wider font-bold shrink-0">
          Pendente
        </Badge>
      )
    }
    if (demand.status === 'negotiating') {
      return (
        <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 uppercase tracking-wider font-bold shrink-0">
          Em negociação
        </Badge>
      )
    }
    return null
  }

  const isProviderContracted =
    role === 'company' &&
    demand.paymentStatus === 'escrow' &&
    supplierProposal?.status === 'accepted'

  const totalContractedValue = demandProposals
    .filter((p) => p.status === 'accepted')
    .reduce((sum, p) => sum + p.value, 0)

  return (
    <div className="flex flex-col animate-slide-up relative min-h-full space-y-6 pb-24 p-4 sm:p-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between gap-4 mb-2 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <BackButton className="-ml-2" />
          <h1 className="text-2xl md:text-3xl font-bold text-foreground truncate tracking-tight">
            {demand.title}
          </h1>
        </div>
        {getStatusBadge()}
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

        {isProviderContracted && supplierProposal && (
          <Card className="border-emerald-500/30 bg-emerald-500/5 shadow-sm mt-8 animate-fade-in">
            <CardHeader className="pb-4 border-b border-emerald-500/10 mb-4">
              <CardTitle className="text-lg text-emerald-700 flex items-center gap-2">
                <DollarSign className="w-5 h-5" /> Gestão Financeira e Repasse
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm border-b border-emerald-500/10 pb-3">
                <span className="text-muted-foreground font-medium">Valor Total Acordado</span>
                <span className="font-bold text-base">
                  R$ {supplierProposal.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-emerald-500/10 pb-3">
                <span className="text-muted-foreground font-medium">
                  Adiantamento Liberado (30% Custos)
                </span>
                <span className="font-bold text-emerald-600">
                  R${' '}
                  {(supplierProposal.value * 0.3).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm pb-1">
                <span className="text-muted-foreground font-medium">
                  Retido pela Plataforma (70%)
                </span>
                <span className="font-bold text-amber-600">
                  R${' '}
                  {(supplierProposal.value * 0.7).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="bg-emerald-500/10 p-3 rounded-lg mt-2 text-xs text-emerald-800 leading-relaxed font-medium">
                O cliente realizou o pagamento total. Os 70% restantes estão em custódia segura na
                plataforma e serão depositados na sua conta assim que o cliente confirmar a
                conclusão do serviço no sistema.
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-border border-l-4 border-l-primary overflow-hidden shadow-sm">
          <CardContent className="p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-2">
                {role === 'customer'
                  ? 'Orçamento Total Estimado'
                  : 'Valor Líquido da sua Parte (-10% Taxa)'}
              </p>
              <p className="text-4xl font-extrabold text-foreground flex items-center gap-2">
                <DollarSign className="w-8 h-8 text-primary" />
                {new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(
                  getDisplayBudget(),
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

        {role === 'customer' && demand.paymentStatus === 'escrow' && (
          <section className="space-y-4 mt-8 animate-fade-in-up">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <h3 className="font-semibold text-foreground text-xl">
                Garantia de Serviço e Pagamento
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Confirme a entrega dos serviços para liberar o repasse final aos fornecedores. Caso
              algum serviço não tenha sido entregue, solicite o reembolso proporcional ou abra uma
              disputa.
            </p>
            <div className="grid grid-cols-1 gap-4">
              {SERVICES.filter((s) => demand.requirements[s.id as keyof TechRequirement]).map(
                (s) => {
                  const status = demand.sectorStatus[s.id]
                  if (status === 'pending') return null

                  const pId = demand.contractedProviders[s.id]
                  const providerName =
                    proposals.find((p) => p.id === pId)?.supplierName || 'Desconhecido'

                  return (
                    <Card
                      key={s.id}
                      className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card border-border shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${s.bg}`}>
                          <s.icon className={`w-6 h-6 ${s.color}`} />
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-base">{s.label}</p>
                          <p className="text-sm text-muted-foreground">
                            Fornecedor:{' '}
                            <span className="font-medium text-foreground">{providerName}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                        {status === 'contracted' && (
                          <>
                            <Button
                              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white shadow-md order-1 sm:order-2"
                              onClick={() => updateSectorStatus(demand.id, s.id, 'concluded')}
                            >
                              Concluído
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full sm:w-auto text-destructive border-destructive/30 hover:bg-destructive hover:text-destructive-foreground order-2 sm:order-1"
                              onClick={() => updateSectorStatus(demand.id, s.id, 'not_delivered')}
                            >
                              Não Entregue
                            </Button>
                          </>
                        )}
                        {status === 'concluded' && (
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-4 py-2 text-sm">
                            Serviço Concluído
                          </Badge>
                        )}
                        {status === 'not_delivered' && (
                          <Badge className="bg-destructive/10 text-destructive border-destructive/20 px-4 py-2 text-sm">
                            Reembolso Solicitado
                          </Badge>
                        )}
                        {status === 'disputed' && (
                          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 px-4 py-2 text-sm">
                            Em Disputa (Retido)
                          </Badge>
                        )}

                        {(status === 'contracted' || status === 'concluded') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 underline decoration-dashed underline-offset-4 order-3"
                            onClick={() => {
                              setDisputeSector(s.id)
                              setIsDisputeOpen(true)
                            }}
                          >
                            Abrir Disputa
                          </Button>
                        )}
                      </div>
                    </Card>
                  )
                },
              )}
            </div>

            <Dialog open={isDisputeOpen} onOpenChange={setIsDisputeOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Disputar Serviço</DialogTitle>
                  <DialogDescription>
                    Houve algum problema com a entrega? Descreva o motivo da disputa. Os pagamentos
                    serão retidos até que um administrador da plataforma faça a mediação.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Label htmlFor="reason">Motivo da Disputa</Label>
                  <Textarea
                    id="reason"
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    placeholder="Descreva detalhadamente o problema ocorrido..."
                    className="mt-2"
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDisputeOpen(false)}>
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (!disputeReason) return
                      disputeService(demand.id, disputeSector, disputeReason)
                      setIsDisputeOpen(false)
                      setDisputeReason('')
                    }}
                  >
                    Confirmar Disputa
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </section>
        )}

        {role === 'customer' && demand.paymentStatus === 'completed' && (
          <section className="space-y-4 mt-8 animate-fade-in-up">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
              <h3 className="font-semibold text-foreground text-xl">Avaliar Fornecedores</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              O evento foi concluído! Por favor, avalie os fornecedores para ajudar a manter a
              qualidade na plataforma.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {demandProposals
                .filter((p) => p.status === 'accepted')
                .map((provider) => {
                  const existingReview = reviews.find(
                    (r) => r.demandId === demand.id && r.supplierId === provider.supplierId,
                  )

                  return (
                    <Card key={provider.id} className="bg-card shadow-sm border-border">
                      <CardContent className="p-5 flex flex-col gap-3">
                        <div>
                          <p className="font-bold text-base text-foreground">
                            {provider.supplierName}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {provider.offeredSectors?.map((sec) => {
                              const s = SERVICES.find((x) => x.id === sec)
                              return s ? (
                                <Badge key={sec} variant="secondary" className="text-[10px]">
                                  {s.label}
                                </Badge>
                              ) : null
                            })}
                          </div>
                        </div>

                        {existingReview ? (
                          <div className="bg-secondary/50 p-3 rounded-lg border border-border/50">
                            <div className="flex items-center gap-1 mb-1">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={cn(
                                    'w-4 h-4',
                                    s <= existingReview.rating
                                      ? 'fill-amber-500 text-amber-500'
                                      : 'text-muted-foreground/30',
                                  )}
                                />
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground italic line-clamp-2">
                              "{existingReview.comment}"
                            </p>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            className="w-full gap-2 hover:bg-secondary"
                            onClick={() => {
                              setReviewSupplierId(provider.supplierId)
                              setReviewSupplierName(provider.supplierName)
                              setIsReviewOpen(true)
                            }}
                          >
                            <Star className="w-4 h-4" /> Avaliar Serviço
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
            </div>

            <Dialog
              open={isReviewOpen}
              onOpenChange={(open) => {
                setIsReviewOpen(open)
                if (!open) {
                  setReviewRating(0)
                  setReviewComment('')
                }
              }}
            >
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Avaliar {reviewSupplierName}</DialogTitle>
                  <DialogDescription>
                    Compartilhe sua experiência. Sua avaliação ficará visível no perfil do
                    fornecedor.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-6 flex flex-col items-center gap-6">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          'w-10 h-10 cursor-pointer transition-colors',
                          (hoverRating || reviewRating) >= star
                            ? 'fill-amber-500 text-amber-500'
                            : 'text-muted-foreground/30 hover:text-amber-500/50',
                        )}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setReviewRating(star)}
                      />
                    ))}
                  </div>
                  <div className="w-full space-y-2">
                    <Label htmlFor="reviewComment">Comentário</Label>
                    <Textarea
                      id="reviewComment"
                      placeholder="Descreva o que você achou do serviço prestado..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsReviewOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleReviewSubmit}>Enviar Avaliação</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </section>
        )}

        {role === 'customer' &&
          demand.paymentStatus !== 'escrow' &&
          demand.paymentStatus !== 'completed' && (
            <section className="space-y-4 mt-8">
              <h3 className="font-semibold text-foreground text-xl border-b border-border pb-2">
                Status da Contratação (Multi-Fornecedores)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {SERVICES.filter((s) => demand.requirements[s.id as keyof TechRequirement]).map(
                  (s) => {
                    const status = demand.sectorStatus[s.id] || 'pending'
                    const pId = demand.contractedProviders[s.id]
                    const providerName = pId
                      ? proposals.find((p) => p.id === pId)?.supplierName
                      : null

                    return (
                      <div
                        key={s.id}
                        className="flex items-center justify-between p-4 bg-card border border-border rounded-xl shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${s.bg}`}>
                            <s.icon className={`w-5 h-5 ${s.color}`} />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{s.label}</p>
                            {providerName && (
                              <p className="text-xs text-muted-foreground">{providerName}</p>
                            )}
                          </div>
                        </div>
                        {status === 'pending' ? (
                          <Badge variant="secondary" className="text-[10px]">
                            Pendente
                          </Badge>
                        ) : (
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] shrink-0 gap-1 pl-1.5">
                            <CheckCircle2 className="w-3 h-3" /> Definido
                          </Badge>
                        )}
                      </div>
                    )
                  },
                )}
              </div>
            </section>
          )}

        {role === 'customer' && demand.paymentStatus === 'pending_signature' && (
          <Card className="bg-primary/5 border-primary/20 shadow-sm mt-8 animate-fade-in-up">
            <CardContent className="p-6 text-center space-y-4">
              <h3 className="text-2xl font-bold text-foreground tracking-tight">
                Todos os fornecedores selecionados!
              </h3>
              <p className="text-muted-foreground text-lg">
                Assine os contratos digitais para avançar à etapa de pagamento seguro.
              </p>
              <Button
                size="lg"
                onClick={() => signContracts(demand.id)}
                className="w-full sm:w-auto h-14 text-base px-8 shadow-md"
              >
                Assinar Todos os Contratos Digitais
              </Button>
            </CardContent>
          </Card>
        )}

        {role === 'customer' && demand.paymentStatus === 'pending_payment' && (
          <Card className="bg-primary/5 border-primary/20 shadow-sm mt-8 animate-fade-in-up">
            <CardContent className="p-6 text-center space-y-4">
              <h3 className="text-2xl font-bold text-foreground tracking-tight">
                Contratos Assinados
              </h3>
              <p className="text-muted-foreground text-lg">
                Realize o pagamento para garantir a reserva. O valor fica retido com segurança pela
                plataforma até a entrega do evento.
              </p>
              <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="w-full sm:w-auto h-14 text-base px-8 shadow-md bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Realizar Pagamento Seguro (
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(totalContractedValue)}
                    )
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[475px]">
                  <DialogHeader>
                    <DialogTitle>Pagamento Seguro Integrado</DialogTitle>
                    <DialogDescription>
                      O pagamento será mantido em custódia pela plataforma e-eventos.
                    </DialogDescription>
                  </DialogHeader>

                  <Tabs defaultValue="credit-card" className="w-full py-4">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="credit-card">Cartão de Crédito</TabsTrigger>
                      <TabsTrigger value="pix">PIX</TabsTrigger>
                    </TabsList>
                    <TabsContent value="credit-card" className="space-y-4 pt-4">
                      <div className="bg-secondary p-4 rounded-xl flex justify-between items-center">
                        <span className="font-semibold text-muted-foreground">Valor Total</span>
                        <span className="text-2xl font-bold text-foreground">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(totalContractedValue)}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <Label>Número do Cartão</Label>
                        <Input placeholder="0000 0000 0000 0000" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Validade</Label>
                          <Input placeholder="MM/AA" />
                        </div>
                        <div className="space-y-2">
                          <Label>CVV</Label>
                          <Input placeholder="123" type="password" />
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent
                      value="pix"
                      className="space-y-4 pt-4 text-center flex flex-col items-center"
                    >
                      <div className="bg-secondary p-4 rounded-xl flex justify-between items-center w-full mb-2">
                        <span className="font-semibold text-muted-foreground">Valor Total</span>
                        <span className="text-2xl font-bold text-foreground">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(totalContractedValue)}
                        </span>
                      </div>
                      <div className="bg-white p-3 inline-block rounded-xl border-2 border-border shadow-sm">
                        <img
                          src="https://img.usecurling.com/i?q=qr-code&color=black&shape=outline"
                          alt="QR Code PIX"
                          className="w-32 h-32 object-contain"
                        />
                      </div>
                      <div className="space-y-2 w-full text-left">
                        <Label>Chave Copia e Cola</Label>
                        <div className="flex gap-2">
                          <Input
                            readOnly
                            value="00020101021126580014br.gov.bcb.pix..."
                            className="bg-muted font-mono text-xs"
                          />
                          <Button
                            variant="outline"
                            onClick={() => toast({ title: 'Chave Copiada!' })}
                          >
                            Copiar
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsPaymentOpen(false)}>
                      Cancelar
                    </Button>
                    <Button
                      onClick={() => {
                        payEvent(demand.id)
                        setIsPaymentOpen(false)
                        toast({
                          title: 'Pagamento Aprovado!',
                          description:
                            'O evento está totalmente garantido e os fornecedores foram notificados.',
                        })
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Confirmar Pagamento
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        )}

        <section className="space-y-4">
          <h3 className="font-semibold text-foreground text-xl border-b border-border pb-2">
            Serviços Solicitados {role === 'company' && '(Sua Área)'}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-2">
            {SERVICES.map(({ id, icon: Icon, label, color, bg }) => {
              if (!demand.requirements[id as keyof typeof demand.requirements]) return null
              if (role === 'company' && !companyProfile?.sectors?.includes(id)) return null

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

            {demandProposals.length > 0 && demand.paymentStatus === 'gathering' && (
              <Alert className="bg-primary/5 border-primary/20 shadow-sm mt-4">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <AlertTitle className="text-primary font-bold">
                  Segurança Financeira Garantida
                </AlertTitle>
                <AlertDescription className="text-muted-foreground mt-1">
                  A plataforma assegura que o seu dinheiro será preservado e repassado aos
                  fornecedores apenas após o fornecimento dos serviços.
                </AlertDescription>
              </Alert>
            )}

            {demandProposals.length === 0 ? (
              <div className="bg-secondary/30 border-2 border-dashed border-border rounded-xl p-8 text-sm text-muted-foreground text-center">
                Nenhuma proposta recebida até o momento.
              </div>
            ) : (
              <div className="space-y-4">
                {demandProposals.map((proposal) => {
                  const canAccept =
                    proposal.offeredSectors?.every((s) => demand.sectorStatus[s] === 'pending') ??
                    true

                  return (
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
                            <div className="flex flex-wrap gap-2 mt-3">
                              {proposal.offeredSectors?.map((sec) => {
                                const s = SERVICES.find((x) => x.id === sec)
                                if (!s) return null
                                return (
                                  <Badge
                                    key={sec}
                                    variant="outline"
                                    className="bg-secondary/50 text-xs text-muted-foreground border-border"
                                  >
                                    {s.label}
                                  </Badge>
                                )
                              })}
                            </div>
                            <div className="mt-4 flex items-start gap-3 bg-secondary/50 p-4 rounded-lg">
                              <MessageSquare className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                {proposal.message}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-start md:items-end justify-between min-w-[150px] border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
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
                            {proposal.status === 'pending' &&
                              demand.paymentStatus === 'gathering' && (
                                <Button
                                  onClick={() => handleAccept(proposal.id)}
                                  className="w-full shadow-sm"
                                  disabled={!canAccept}
                                >
                                  {canAccept ? 'Aceitar Proposta' : 'Serviço Já Contratado'}
                                </Button>
                              )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
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
          ) : demand.status === 'completed' || demand.paymentStatus === 'escrow' ? (
            <div className="p-5 bg-secondary rounded-xl text-center border border-border shadow-sm text-muted-foreground">
              Esta demanda já foi preenchida ou concluída.
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
                    Descreva os detalhes da sua oferta e selecione os serviços inclusos.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-5 py-4">
                  <div className="space-y-3">
                    <Label className="font-semibold text-foreground">
                      Serviços Inclusos na Proposta
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {applicableSectors.map((s) => {
                        const isSelected = selectedSectors.includes(s.id)
                        return (
                          <Badge
                            key={s.id}
                            variant={isSelected ? 'default' : 'outline'}
                            className={cn(
                              'cursor-pointer text-xs py-1.5 px-3 transition-all',
                              isSelected
                                ? `border-transparent shadow-sm ${s.bg} ${s.color}`
                                : 'bg-transparent text-muted-foreground hover:bg-secondary',
                            )}
                            onClick={() => {
                              setSelectedSectors((prev) =>
                                prev.includes(s.id)
                                  ? prev.filter((x) => x !== s.id)
                                  : [...prev, s.id],
                              )
                            }}
                          >
                            {s.label}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="value" className="font-semibold">
                      Valor Final da Proposta (R$)
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
                      placeholder="Descreva o que está incluso, equipamentos, prazos..."
                      className="min-h-[100px] resize-none"
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

import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '@/store/AppContext'
import {
  MapPin,
  Star,
  Heart,
  BadgeCheck,
  Trophy,
  Award,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BackButton } from '@/components/BackButton'
import { SERVICES } from '@/lib/services'
import { cn } from '@/lib/utils'

export default function ProviderProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { users, reviews, favorites, toggleFavorite, currentUser, createChat, getSafetyIndex } =
    useApp()

  const supplier = users.find((u) => u.id === id)

  if (!supplier || supplier.role !== 'company' || !supplier.companyProfile) {
    return (
      <div className="p-8 text-center text-muted-foreground animate-fade-in">
        Fornecedor não encontrado.
      </div>
    )
  }

  const profile = supplier.companyProfile
  const supplierReviews = reviews.filter((r) => r.supplierId === supplier.id)
  const avgRating = supplierReviews.length
    ? supplierReviews.reduce((sum, r) => sum + r.rating, 0) / supplierReviews.length
    : 0
  const fiveStarCount = supplierReviews.filter((r) => r.rating === 5).length
  const isFav = favorites.some(
    (f) => f.customerId === currentUser?.id && f.supplierId === supplier.id,
  )

  const isExpert = fiveStarCount >= 10
  const isHighPerformance = fiveStarCount >= 25
  const safetyIndex = getSafetyIndex(supplier.id)

  const handleMessage = () => {
    if (!currentUser) return
    const chatId = createChat(supplier.id)
    navigate(`/messages?chat=${chatId}`)
  }

  return (
    <div className="animate-slide-up pb-12 p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      <header className="flex items-center gap-2 mb-2">
        <BackButton />
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Perfil do Fornecedor</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 shadow-sm border-border bg-card h-fit sticky top-24">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center border border-border shadow-sm overflow-hidden mb-4 relative">
              {profile.logo ? (
                <img src={profile.logo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-muted-foreground uppercase">
                  {profile.name.charAt(0)}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-foreground flex items-center justify-center gap-2 flex-wrap">
              {profile.name}
              {profile.isVerified && (
                <BadgeCheck className="w-5 h-5 text-blue-500 shrink-0" title="Verificado" />
              )}
            </h2>

            <div className="flex flex-col gap-2 mt-3 w-full">
              <Badge
                className={cn(
                  'justify-center py-1.5 shadow-sm',
                  safetyIndex >= 90
                    ? 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-600 border-amber-500/30',
                )}
              >
                <ShieldCheck className="w-4 h-4 mr-1.5" /> Índice de Segurança: {safetyIndex}%
              </Badge>

              {isHighPerformance && (
                <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30 justify-center py-1">
                  <Trophy className="w-3.5 h-3.5 mr-1.5" /> Alta Performance
                </Badge>
              )}
              {isExpert && !isHighPerformance && (
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 justify-center py-1">
                  <Award className="w-3.5 h-3.5 mr-1.5" /> Fornecedor Expert
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{profile.address || 'Endereço não informado'}</span>
            </div>

            <div className="flex items-center gap-1 mt-4 bg-secondary/50 px-4 py-2 rounded-full">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
              <span className="font-bold text-foreground">
                {avgRating > 0 ? avgRating.toFixed(1) : 'Novo'}
              </span>
              <span className="text-muted-foreground text-sm ml-1">
                ({supplierReviews.length} avaliações)
              </span>
            </div>

            <div className="flex flex-col w-full gap-3 mt-8">
              {currentUser?.id !== supplier.id && (
                <Button onClick={handleMessage} className="w-full shadow-sm font-semibold gap-2">
                  <MessageSquare className="w-4 h-4" /> Enviar Mensagem
                </Button>
              )}
              <Button
                variant="outline"
                className={cn(
                  'w-full gap-2 transition-colors',
                  isFav && 'border-pink-500 text-pink-600 hover:bg-pink-50 hover:text-pink-700',
                )}
                onClick={() => toggleFavorite(supplier.id)}
              >
                <Heart className={cn('w-4 h-4', isFav && 'fill-pink-600')} />
                {isFav ? 'Remover dos Favoritos' : 'Salvar Favorito'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-sm border-border bg-card">
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold border-b border-border pb-2 mb-4">
                  Sobre a Empresa
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                  {profile.observations || 'Nenhuma informação adicional fornecida.'}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold border-b border-border pb-2 mb-4">
                  Especialidades
                </h3>
                <p className="text-foreground text-sm font-medium">
                  {profile.specialties || 'Especialidades não informadas'}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold border-b border-border pb-2 mb-4">
                  Serviços Oferecidos
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.sectors.map((sec) => {
                    const s = SERVICES.find((x) => x.id === sec)
                    if (!s) return null
                    return (
                      <span
                        key={sec}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${s.bg} ${s.color}`}
                      >
                        <s.icon className="w-4 h-4" />
                        {s.label}
                      </span>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border bg-card">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold border-b border-border pb-2 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                Avaliações de Clientes
              </h3>

              <div className="space-y-4">
                {supplierReviews.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-8 border-2 border-dashed border-border rounded-xl">
                    Nenhuma avaliação até o momento.
                  </p>
                ) : (
                  supplierReviews.map((r) => {
                    const customer = users.find((u) => u.id === r.customerId)
                    return (
                      <div
                        key={r.id}
                        className="p-4 bg-secondary/30 rounded-xl border border-border/50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {customer?.name || 'Cliente'}
                            </p>
                            <div className="flex items-center gap-0.5 mt-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={cn(
                                    'w-3 h-3',
                                    star <= r.rating
                                      ? 'fill-amber-500 text-amber-500'
                                      : 'text-muted',
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(r.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{r.comment}</p>
                      </div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

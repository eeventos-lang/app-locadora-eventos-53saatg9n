import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MapPin, Star, BadgeCheck, Calendar as CalendarIcon, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useApp } from '@/store/AppContext'
import { SERVICES } from '@/lib/services'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

export default function Favorites() {
  const {
    users,
    favorites,
    toggleFavorite,
    currentUser,
    role,
    reviews,
    addScheduledInvitation,
    getSupplierUnavailableDates,
  } = useApp()
  const { toast } = useToast()

  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null)
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(undefined)
  const [scheduleTitle, setScheduleTitle] = useState('')

  const myFavorites = useMemo(() => {
    if (!currentUser) return []
    const favSupplierIds = favorites
      .filter((f) => f.customerId === currentUser.id)
      .map((f) => f.supplierId)
    return users.filter((u) => favSupplierIds.includes(u.id))
  }, [users, favorites, currentUser])

  const unavailableDateObjs = useMemo(() => {
    if (!selectedSupplierId) return []
    return getSupplierUnavailableDates(selectedSupplierId)
  }, [selectedSupplierId, getSupplierUnavailableDates])

  if (role !== 'customer') {
    return (
      <div className="p-8 text-center text-muted-foreground animate-fade-in">
        Acesso exclusivo para clientes.
      </div>
    )
  }

  const handleOpenSchedule = (supplierId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedSupplierId(supplierId)
    setScheduleDate(undefined)
    setScheduleTitle('')
    setIsScheduleOpen(true)
  }

  const handleConfirmSchedule = () => {
    if (!scheduleDate || !scheduleTitle || !selectedSupplierId || !currentUser) {
      toast({
        title: 'Atenção',
        description: 'Preencha a data e o título do evento.',
        variant: 'destructive',
      })
      return
    }
    addScheduledInvitation({
      customerId: currentUser.id,
      supplierId: selectedSupplierId,
      title: scheduleTitle,
      date: scheduleDate.toISOString(),
    })
    setIsScheduleOpen(false)
    toast({
      title: 'Agendamento Salvo!',
      description: 'O convite será enviado automaticamente quando a data se aproximar.',
    })
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto animate-slide-up pb-12">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <Heart className="w-8 h-8 fill-pink-600 text-pink-600" />
          Meus Favoritos
        </h1>
        <p className="text-muted-foreground">
          Sua rede de confiança. Salve os melhores profissionais para os seus próximos eventos ou
          agende convites antecipados.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myFavorites.length === 0 ? (
          <div className="col-span-full p-16 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-2xl bg-secondary/20">
            <Heart className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">Você ainda não tem fornecedores favoritos.</p>
            <p className="text-sm mt-1">
              Navegue na busca e clique no coração para salvar os melhores.
            </p>
            <Button asChild variant="outline" className="mt-6">
              <Link to="/suppliers">Buscar Fornecedores</Link>
            </Button>
          </div>
        ) : (
          myFavorites.map((supplier) => {
            const profile = supplier.companyProfile!
            const supplierReviews = reviews.filter((r) => r.supplierId === supplier.id)
            const avgRating = supplierReviews.length
              ? supplierReviews.reduce((sum, r) => sum + r.rating, 0) / supplierReviews.length
              : 0

            return (
              <Card
                key={supplier.id}
                className="overflow-hidden hover:border-primary/50 transition-colors shadow-sm bg-card group flex flex-col relative"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 z-10 bg-background/50 hover:bg-background/80 backdrop-blur-sm"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toggleFavorite(supplier.id)
                  }}
                >
                  <Heart className="w-5 h-5 fill-pink-600 text-pink-600" />
                </Button>

                <Link to={`/suppliers/${supplier.id}`} className="flex-1 flex flex-col h-full">
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-start gap-4 mb-5 pr-10">
                        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center border border-border shadow-sm shrink-0 overflow-hidden">
                          {profile.logo ? (
                            <img
                              src={profile.logo}
                              alt="Logo"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl font-bold text-muted-foreground uppercase">
                              {profile.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="pt-1">
                          <h3 className="font-bold text-lg text-foreground flex items-center gap-1.5 leading-tight group-hover:text-primary transition-colors">
                            {profile.name}
                            {profile.isVerified && (
                              <BadgeCheck
                                className="w-5 h-5 text-blue-500 shrink-0"
                                title="Verificado"
                              />
                            )}
                          </h3>
                          <div className="flex items-center gap-1 mt-1.5 text-sm font-medium text-amber-500">
                            <Star className="w-4 h-4 fill-amber-500" />
                            {avgRating > 0 ? avgRating.toFixed(1) : 'Novo'}
                            <span className="text-muted-foreground ml-1">
                              ({supplierReviews.length})
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 bg-secondary/50 p-2.5 rounded-lg border border-border/50">
                        <MapPin className="w-4 h-4 shrink-0 text-primary" />
                        <span className="truncate font-medium">
                          {profile.address || 'Endereço não informado'}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                        {profile.sectors.slice(0, 4).map((sec) => {
                          const service = SERVICES.find((s) => s.id === sec)
                          return service ? (
                            <span
                              key={sec}
                              className={`text-[10px] font-bold px-2.5 py-1.5 rounded-md flex items-center gap-1.5 ${service.bg} ${service.color}`}
                            >
                              <service.icon className="w-3 h-3" />
                              {service.label}
                            </span>
                          ) : null
                        })}
                        {profile.sectors.length > 4 && (
                          <span className="text-[10px] font-bold px-2.5 py-1.5 rounded-md bg-secondary text-muted-foreground">
                            +{profile.sectors.length - 4}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2 z-20">
                        <Button className="flex-1 shadow-sm font-semibold" variant="outline">
                          Ver Perfil
                        </Button>
                        <Button
                          className="flex-1 shadow-sm font-semibold bg-primary text-primary-foreground gap-2"
                          onClick={(e) => handleOpenSchedule(supplier.id, e)}
                        >
                          <Clock className="w-4 h-4" /> Agendar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            )
          })
        )}
      </div>

      <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agendar Convite Recorrente</DialogTitle>
            <DialogDescription>
              Planeje com antecedência! O fornecedor receberá um convite na plataforma 30 dias antes
              da data selecionada. Consulte a agenda do profissional abaixo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Evento</Label>
              <Input
                id="title"
                placeholder="Ex: Jantar Corporativo Anual"
                value={scheduleTitle}
                onChange={(e) => setScheduleTitle(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2 flex flex-col">
              <Label>Data do Evento (Veja disponibilidade)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'justify-start text-left font-normal h-11 w-full',
                      !scheduleDate && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduleDate ? (
                      format(scheduleDate, 'PPP', { locale: ptBR })
                    ) : (
                      <span>Selecione a data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={scheduleDate}
                    onSelect={setScheduleDate}
                    initialFocus
                    disabled={(date) => {
                      if (date < new Date(new Date().setHours(0, 0, 0, 0))) return true
                      return unavailableDateObjs.some(
                        (ud) =>
                          ud.getDate() === date.getDate() &&
                          ud.getMonth() === date.getMonth() &&
                          ud.getFullYear() === date.getFullYear(),
                      )
                    }}
                    modifiers={{ blocked: unavailableDateObjs }}
                    modifiersClassNames={{
                      blocked:
                        'text-destructive bg-destructive/10 line-through opacity-70 hover:bg-destructive/10 hover:text-destructive',
                    }}
                  />
                </PopoverContent>
              </Popover>
              <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-2 mt-1">
                <span className="w-3 h-3 rounded-full bg-destructive/20 inline-block border border-destructive/30"></span>
                Datas destacadas estão indisponíveis na agenda do fornecedor.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmSchedule}>Salvar Agendamento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

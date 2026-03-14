import { useState, useMemo } from 'react'
import { Search, BadgeCheck, MapPin, Send, FilterX } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { useApp } from '@/store/AppContext'
import { SERVICES } from '@/lib/services'
import { useToast } from '@/hooks/use-toast'

export default function SupplierSearch() {
  const { users, demands, inviteSupplier, role } = useApp()
  const { toast } = useToast()

  const [searchTerm, setSearchTerm] = useState('')
  const [sectorFilter, setSectorFilter] = useState('all')
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null)
  const [selectedDemand, setSelectedDemand] = useState('')

  const suppliers = useMemo(() => {
    return users.filter(
      (u) =>
        u.role === 'company' &&
        u.companyProfile &&
        (sectorFilter === 'all' || u.companyProfile.sectors.includes(sectorFilter)) &&
        (u.companyProfile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.companyProfile.specialties.toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }, [users, searchTerm, sectorFilter])

  const activeDemands = useMemo(() => demands.filter((d) => d.status !== 'completed'), [demands])

  const handleInvite = () => {
    if (!selectedSupplier || !selectedDemand) return
    inviteSupplier(selectedSupplier, selectedDemand)
    toast({
      title: 'Convite enviado!',
      description: 'O fornecedor foi notificado sobre o seu evento com sucesso.',
    })
    setSelectedSupplier(null)
    setSelectedDemand('')
  }

  if (role !== 'customer') {
    return (
      <div className="p-8 text-center text-muted-foreground animate-fade-in">
        Acesso exclusivo para clientes.
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto animate-slide-up pb-12">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Buscar Fornecedores</h1>
        <p className="text-muted-foreground">
          Encontre os melhores profissionais e convide-os diretamente para seus eventos.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-10 h-11 bg-background"
            placeholder="Buscar por nome ou especialidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={sectorFilter} onValueChange={setSectorFilter}>
          <SelectTrigger className="w-full sm:w-[280px] h-11 bg-background">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Categorias</SelectItem>
            {SERVICES.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(searchTerm || sectorFilter !== 'all') && (
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 shrink-0"
            onClick={() => {
              setSearchTerm('')
              setSectorFilter('all')
            }}
          >
            <FilterX className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.length === 0 ? (
          <div className="col-span-full p-16 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-2xl bg-secondary/20">
            <Search className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">Nenhum fornecedor encontrado.</p>
            <p className="text-sm mt-1">Tente ajustar seus filtros de busca.</p>
          </div>
        ) : (
          suppliers.map((supplier) => {
            const profile = supplier.companyProfile!
            return (
              <Card
                key={supplier.id}
                className="overflow-hidden hover:border-primary/50 transition-colors shadow-sm bg-card group flex flex-col"
              >
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start gap-4 mb-5">
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
                        <h3 className="font-bold text-lg text-foreground flex items-center gap-1.5 leading-tight">
                          {profile.name}
                          {profile.isVerified && (
                            <BadgeCheck
                              className="w-5 h-5 text-blue-500 shrink-0"
                              title="Fornecedor Verificado"
                            />
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                          {profile.specialties || 'Especialidades não informadas'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 bg-secondary/50 p-2.5 rounded-lg border border-border/50">
                      <MapPin className="w-4 h-4 shrink-0 text-primary" />
                      <span className="truncate font-medium">
                        {profile.address || 'Endereço não informado'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                      {profile.sectors.slice(0, 5).map((sec) => {
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
                      {profile.sectors.length > 5 && (
                        <span className="text-[10px] font-bold px-2.5 py-1.5 rounded-md bg-secondary text-muted-foreground">
                          +{profile.sectors.length - 5}
                        </span>
                      )}
                    </div>

                    <Button
                      className="w-full h-12 shadow-sm font-semibold group-hover:bg-primary/90 transition-all"
                      onClick={() => setSelectedSupplier(supplier.id)}
                    >
                      <Send className="w-4 h-4 mr-2" /> Convidar para Evento
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      <Dialog open={!!selectedSupplier} onOpenChange={(open) => !open && setSelectedSupplier(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Enviar Convite Direto</DialogTitle>
            <DialogDescription className="pt-2">
              Selecione um dos seus eventos ativos para convidar este fornecedor a enviar uma
              proposta exclusiva.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            {activeDemands.length === 0 ? (
              <div className="p-6 bg-secondary border border-border text-sm text-muted-foreground rounded-xl text-center shadow-inner">
                Você não possui eventos ativos no momento. <br />
                <a
                  href="/create-event"
                  className="text-primary font-bold hover:underline mt-3 inline-block"
                >
                  Criar meu primeiro evento
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">Escolha o Evento</label>
                <Select value={selectedDemand} onValueChange={setSelectedDemand}>
                  <SelectTrigger className="w-full h-12 text-base">
                    <SelectValue placeholder="Selecione um evento..." />
                  </SelectTrigger>
                  <SelectContent>
                    {activeDemands.map((d) => (
                      <SelectItem key={d.id} value={d.id} className="py-3 cursor-pointer">
                        <span className="font-medium">{d.title}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedSupplier(null)} className="h-11">
              Cancelar
            </Button>
            <Button
              onClick={handleInvite}
              disabled={!selectedDemand || activeDemands.length === 0}
              className="h-11 px-8"
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar Convite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

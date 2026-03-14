import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MapPin, Star, BadgeCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useApp } from '@/store/AppContext'
import { SERVICES } from '@/lib/services'
import { cn } from '@/lib/utils'

export default function Favorites() {
  const { users, favorites, toggleFavorite, currentUser, role, reviews } = useApp()

  const myFavorites = useMemo(() => {
    if (!currentUser) return []
    const favSupplierIds = favorites
      .filter((f) => f.customerId === currentUser.id)
      .map((f) => f.supplierId)
    return users.filter((u) => favSupplierIds.includes(u.id))
  }, [users, favorites, currentUser])

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
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <Heart className="w-8 h-8 fill-pink-600 text-pink-600" />
          Meus Favoritos
        </h1>
        <p className="text-muted-foreground">
          Sua rede de confiança. Salve os melhores profissionais para os seus próximos eventos.
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

                      <Button className="w-full shadow-sm font-semibold" variant="outline">
                        Ver Perfil Completo
                      </Button>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

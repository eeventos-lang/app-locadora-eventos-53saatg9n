import { useEffect, useRef } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Menu,
  Calendar,
  PlusCircle,
  CreditCard,
  LayoutDashboard,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Bell,
  Users,
  Receipt,
  Heart,
  LineChart,
  CalendarClock,
  MessageSquare,
  PieChart,
  Package,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import logoImg from '@/assets/e-eventos-novo-62817.png'
import { useApp } from '@/store/AppContext'
import { useToast } from '@/hooks/use-toast'

export function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { currentUser, logout, role, companyProfile, notifications, markNotificationsAsRead } =
    useApp()

  const prevNotifsRef = useRef(notifications.length)

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  useEffect(() => {
    if (notifications.length > prevNotifsRef.current) {
      const newCount = notifications.length - prevNotifsRef.current
      const newNotifs = notifications.slice(0, newCount)

      newNotifs.forEach((n) => {
        const isForMe =
          role === 'company'
            ? n.targetSupplierId === currentUser?.id ||
              companyProfile?.sectors?.includes(n.sector || '')
            : n.customerId === currentUser?.id

        if (isForMe && !n.read) {
          toast({
            title: n.title,
            description: n.message,
          })
        }
      })
      prevNotifsRef.current = notifications.length
    }
  }, [notifications, role, currentUser, companyProfile, toast])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navItems = [
    { name: 'Início', path: '/', icon: LayoutDashboard },
    { name: 'Mensagens', path: '/messages', icon: MessageSquare },
    { name: 'Demandas', path: '/demands', icon: Calendar },
    ...(role === 'customer'
      ? [
          { name: 'Fornecedores', path: '/suppliers', icon: Users },
          { name: 'Favoritos', path: '/favorites', icon: Heart },
          { name: 'Agendamentos', path: '/schedules', icon: CalendarClock },
        ]
      : [
          { name: 'Insights', path: '/insights', icon: LineChart },
          { name: 'Cadastros', path: '/registrations', icon: Users },
          { name: 'Estoque', path: '/inventory', icon: Package },
          { name: 'Relatórios', path: '/reports', icon: PieChart },
        ]),
    { name: 'Fluxo de Caixa', path: '/finance', icon: Receipt },
    { name: 'Criar Evento', path: '/create-event', icon: PlusCircle },
    { name: 'Planos', path: '/subscription', icon: CreditCard },
  ]

  const myNotifications =
    role === 'company'
      ? notifications
          .filter(
            (n) =>
              n.targetSupplierId === currentUser?.id ||
              companyProfile?.sectors?.includes(n.sector || ''),
          )
          .slice(0, 5)
      : notifications.filter((n) => n.customerId === currentUser?.id).slice(0, 5)

  const unreadCount = myNotifications.filter((n) => !n.read).length

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 print:hidden">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu principal</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 sm:max-w-xs flex flex-col">
                <SheetHeader>
                  <SheetTitle className="text-left flex items-center gap-3">
                    <img
                      src={logoImg}
                      alt="e-eventos"
                      className="h-8 w-8 rounded-lg object-contain shadow-sm bg-white/5 p-1 border border-white/10"
                    />
                    <span className="font-bold tracking-tight text-lg">e-eventos</span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-2 mt-6 flex-1 overflow-y-auto">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                          location.pathname === item.path
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted',
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    )
                  })}
                  {currentUser && (
                    <Link
                      to="/profile"
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                        location.pathname === '/profile'
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted',
                      )}
                    >
                      <User className="h-4 w-4" />
                      Meu Perfil
                    </Link>
                  )}
                </nav>
                <div className="flex flex-col gap-2 mt-auto pt-6 border-t border-border">
                  {currentUser ? (
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium hover:bg-muted transition-colors text-destructive"
                    >
                      <LogOut className="h-4 w-4" /> Sair da conta
                    </button>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium hover:bg-muted transition-colors"
                      >
                        <LogIn className="h-4 w-4" /> Entrar
                      </Link>
                      <Link
                        to="/register"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium hover:bg-muted transition-colors text-primary"
                      >
                        <UserPlus className="h-4 w-4" /> Cadastrar
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
              <img
                src={logoImg}
                alt="e-eventos"
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl object-contain drop-shadow-sm bg-white/5 p-1 border border-white/10"
              />
              <span className="hidden sm:inline-block font-extrabold text-xl tracking-tight text-foreground">
                e-eventos
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary whitespace-nowrap',
                  location.pathname === item.path ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {currentUser && (
              <DropdownMenu
                onOpenChange={(open) => {
                  if (!open) markNotificationsAsRead()
                }}
              >
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative mr-2 md:mr-0">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-destructive border-2 border-background" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notificações</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {myNotifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      Nenhuma notificação no momento.
                    </div>
                  ) : (
                    myNotifications.map((notif) => (
                      <DropdownMenuItem
                        key={notif.id}
                        className="flex flex-col items-start gap-1 p-3 cursor-pointer"
                        onClick={() =>
                          navigate(notif.demandId ? `/demands/${notif.demandId}` : '#')
                        }
                      >
                        <div className="flex items-center gap-2">
                          {!notif.read && (
                            <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                          )}
                          <span className="font-semibold text-sm text-foreground">
                            {notif.title}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                          {notif.message}
                        </span>
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <div className="hidden md:flex items-center gap-3">
              {currentUser ? (
                <div className="flex items-center gap-4">
                  <Link
                    to="/profile"
                    className="text-sm font-medium hover:text-primary transition-colors whitespace-nowrap"
                  >
                    Olá, {currentUser.name.split(' ')[0]}
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    Sair
                  </Button>
                </div>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/login">Entrar</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to="/register">Cadastrar</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full print:p-0 print:m-0 flex flex-col">
        <Outlet />
      </main>

      {location.pathname !== '/messages' && (
        <footer className="border-t border-border bg-card/50 pt-12 pb-8 mt-auto print:hidden">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div className="col-span-1 md:col-span-2">
                <Link
                  to="/"
                  className="flex items-center gap-3 transition-opacity hover:opacity-90 mb-4 inline-flex"
                >
                  <img
                    src={logoImg}
                    alt="e-eventos"
                    className="h-10 w-10 rounded-xl object-contain drop-shadow-sm bg-white/5 p-1 border border-white/10"
                  />
                  <span className="font-extrabold text-xl tracking-tight text-foreground">
                    e-eventos
                  </span>
                </Link>
                <p className="text-muted-foreground text-sm max-w-sm">
                  A plataforma líder em locação de equipamentos e serviços para eventos. Conectando
                  você aos melhores fornecedores do mercado.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-foreground">Plataforma</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link to="/demands" className="hover:text-primary transition-colors">
                      Demandas
                    </Link>
                  </li>
                  {role === 'customer' && (
                    <>
                      <li>
                        <Link to="/suppliers" className="hover:text-primary transition-colors">
                          Buscar Fornecedores
                        </Link>
                      </li>
                      <li>
                        <Link to="/schedules" className="hover:text-primary transition-colors">
                          Agendamentos
                        </Link>
                      </li>
                    </>
                  )}
                  {role === 'company' && (
                    <>
                      <li>
                        <Link to="/insights" className="hover:text-primary transition-colors">
                          Insights & Desempenho
                        </Link>
                      </li>
                      <li>
                        <Link to="/registrations" className="hover:text-primary transition-colors">
                          Gestão de Cadastros
                        </Link>
                      </li>
                      <li>
                        <Link to="/inventory" className="hover:text-primary transition-colors">
                          Estoque
                        </Link>
                      </li>
                      <li>
                        <Link to="/reports" className="hover:text-primary transition-colors">
                          Relatórios
                        </Link>
                      </li>
                    </>
                  )}
                  <li>
                    <Link to="/create-event" className="hover:text-primary transition-colors">
                      Criar Evento
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-foreground">Suporte</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link to="#" className="hover:text-primary transition-colors">
                      Central de Ajuda
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="hover:text-primary transition-colors">
                      Termos de Uso
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="hover:text-primary transition-colors">
                      Privacidade
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground text-center md:text-left">
                © {new Date().getFullYear()} e-eventos. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}

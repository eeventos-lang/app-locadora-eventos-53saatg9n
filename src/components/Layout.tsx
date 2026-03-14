import { Outlet, Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Calendar, Home, Settings, User, Menu, Bell, Instagram, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import logoUrl from '../assets/logo-marca-e-eventos-66b1b.png'

const navigation = [
  { name: 'Início', href: '/', icon: Home },
  { name: 'Demandas', href: '/demandas', icon: Calendar },
  { name: 'Assinatura', href: '/assinatura', icon: Settings },
  { name: 'Perfil', href: '/perfil', icon: User },
]

export default function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-4 md:px-6 transition-all duration-200 shadow-sm">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 sm:w-80 overflow-y-auto flex flex-col">
              <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
              <SheetDescription className="sr-only">
                Navegue pelas páginas do e-eventos
              </SheetDescription>
              <div className="flex items-center gap-3 mb-8 mt-4 px-2">
                <img
                  src={logoUrl}
                  alt="e-eventos logo"
                  className="h-9 w-auto rounded object-contain"
                />
                <span className="text-xl font-bold tracking-tight text-foreground">e-eventos</span>
              </div>
              <nav className="flex flex-col gap-2 flex-1">
                {navigation.map((item) => {
                  const isActive =
                    location.pathname === item.href ||
                    (item.href !== '/' && location.pathname.startsWith(item.href))
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                        isActive
                          ? 'bg-secondary text-foreground'
                          : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground',
                      )}
                    >
                      <item.icon
                        className={cn(
                          'h-5 w-5',
                          isActive ? 'text-foreground' : 'text-muted-foreground',
                        )}
                      />
                      {item.name}
                    </Link>
                  )
                })}

                <div className="mt-6 pt-6 border-t border-border">
                  <span className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                    Redes Sociais
                  </span>
                  <a
                    href="https://www.instagram.com/lhshoweventos?igsh=MWp6amc0bDUyZjU4cA=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-pink-600 transition-all"
                  >
                    <Instagram className="h-5 w-5 group-hover:text-pink-600 transition-colors" />
                    @lhshoweventos
                  </a>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          <Link
            to="/"
            className="hidden md:flex items-center gap-3 transition-opacity hover:opacity-90"
          >
            <img
              src={logoUrl}
              alt="e-eventos logo"
              className="h-9 w-auto rounded-sm object-contain"
            />
            <span className="text-xl font-extrabold tracking-tight text-foreground">e-eventos</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-2 mx-6 flex-1 justify-center">
          {navigation.map((item) => {
            const isActive =
              location.pathname === item.href ||
              (item.href !== '/' && location.pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground',
                )}
              >
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <a
            href="https://www.instagram.com/lhshoweventos?igsh=MWp6amc0bDUyZjU4cA=="
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-pink-600 transition-colors p-2 rounded-full hover:bg-secondary flex items-center justify-center"
            aria-label="Instagram @lhshoweventos"
            title="Siga-nos no Instagram"
          >
            <Instagram className="h-5 w-5" />
          </a>
          <Button
            variant="ghost"
            size="icon"
            className="relative text-muted-foreground hover:text-foreground rounded-full"
          >
            <Bell className="h-5 w-5" />
          </Button>
          <Link to="/perfil">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-secondary text-foreground hover:ring-2 hover:ring-border hover:ring-offset-1 transition-all ml-1 sm:ml-2"
            >
              <User className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 relative">
        <Outlet />
      </main>

      <footer className="w-full border-t border-border bg-card py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 opacity-90">
              <img src={logoUrl} alt="e-eventos logo" className="h-8 w-auto grayscale" />
              <span className="text-xl font-extrabold text-foreground">e-eventos</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Plataforma premium para gestão e locação de estruturas para eventos, com a qualidade
              de assinatura LH Show Eventos.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Navegação</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Início
                </Link>
              </li>
              <li>
                <Link
                  to="/demandas"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Demandas
                </Link>
              </li>
              <li>
                <Link
                  to="/perfil"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Perfil
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Contato & Redes</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://www.instagram.com/lhshoweventos?igsh=MWp6amc0bDUyZjU4cA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-pink-600 transition-colors group"
                >
                  <Instagram className="h-4 w-4 group-hover:text-pink-600" />
                  @lhshoweventos
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                contato@lhshoweventos.com.br
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                (11) 99999-9999
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm font-medium text-muted-foreground">
            © {new Date().getFullYear()} e-eventos. Todos os direitos reservados.
          </span>
        </div>
      </footer>
    </div>
  )
}

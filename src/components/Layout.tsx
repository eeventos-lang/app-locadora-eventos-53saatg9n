import { Link, Outlet, useLocation } from 'react-router-dom'
import { Home, ClipboardList, User, Bell, CreditCard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useApp } from '@/store/AppContext'
import { BackButton } from '@/components/BackButton'

export default function Layout() {
  const location = useLocation()
  const { role } = useApp()

  const navItems = [
    { path: '/', icon: Home, label: 'Início' },
    {
      path: '/demandas',
      icon: ClipboardList,
      label: role === 'customer' ? 'Meus Eventos' : 'Demandas',
    },
    ...(role === 'company' ? [{ path: '/assinatura', icon: CreditCard, label: 'Assinatura' }] : []),
    { path: '/perfil', icon: User, label: 'Perfil' },
  ]

  const isRoot = location.pathname === '/'

  return (
    <div className="bg-black min-h-screen flex justify-center">
      <div className="mobile-container w-full flex flex-col relative bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border/50 min-h-[72px]">
          <div className="flex items-center gap-2">
            {!isRoot ? (
              <BackButton className="-ml-3" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_15px_rgba(0,82,255,0.4)]">
                <span className="font-bold text-white text-lg leading-none">E</span>
              </div>
            )}
            <span className="font-bold text-lg tracking-tight">EventMatch</span>
          </div>
          <button className="relative w-11 h-11 flex items-center justify-center -mr-3 text-muted-foreground hover:text-white transition-colors rounded-full hover:bg-white/10 active:scale-95">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full animate-pulse"></span>
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-24 animate-fade-in relative flex flex-col">
          <Outlet />
        </main>

        {/* Bottom Navigation */}
        <nav className="absolute bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border/50 pb-safe">
          <ul className="flex justify-around items-center h-16 px-2">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path === '/demandas' && location.pathname.startsWith('/demanda/'))
              return (
                <li key={item.path} className="flex-1">
                  <Link
                    to={item.path}
                    className="flex flex-col items-center justify-center w-full h-full gap-1"
                  >
                    <item.icon
                      className={cn(
                        'w-6 h-6 transition-all duration-300',
                        isActive
                          ? 'text-primary scale-110 drop-shadow-[0_0_8px_rgba(0,82,255,0.6)]'
                          : 'text-muted-foreground',
                      )}
                    />
                    <span
                      className={cn(
                        'text-[10px] font-medium transition-colors',
                        isActive ? 'text-primary' : 'text-muted-foreground',
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </div>
  )
}

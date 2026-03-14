import { Outlet, Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Calendar, Home, Settings, User, Menu, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import logoUrl from '../assets/logo-marca-e-eventos-66b1b.png'

const navigation = [
  { name: 'Painel', href: '/', icon: Home },
  { name: 'Demandas', href: '/demandas', icon: Calendar },
  { name: 'Assinatura', href: '/subscription', icon: Settings },
  { name: 'Perfil', href: '/profile', icon: User },
]

export default function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-white px-4 md:px-6 shadow-sm">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 sm:w-80">
              <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
              <div className="flex items-center gap-3 mb-8 mt-4 px-2">
                <img
                  src={logoUrl}
                  alt="e-eventos logo"
                  className="h-9 w-auto rounded object-contain"
                />
                <span className="text-xl font-bold tracking-tight text-slate-900">e-eventos</span>
              </div>
              <nav className="flex flex-col gap-2">
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
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                      )}
                    >
                      <item.icon
                        className={cn('h-5 w-5', isActive ? 'text-blue-700' : 'text-slate-400')}
                      />
                      {item.name}
                    </Link>
                  )
                })}
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
              className="h-9 w-auto rounded-sm object-contain drop-shadow-sm"
            />
            <span className="text-xl font-bold tracking-tight text-slate-900">e-eventos</span>
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
                  'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
                )}
              >
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-slate-500 hover:text-slate-900"
          >
            <Bell className="h-5 w-5" />
          </Button>
          <Link to="/profile">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 text-blue-700 overflow-hidden hover:ring-2 hover:ring-blue-100 hover:ring-offset-1 transition-all ml-2">
              <User className="h-4 w-4" />
            </div>
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 relative">
        <Outlet />
      </main>
    </div>
  )
}

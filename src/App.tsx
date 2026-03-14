import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import Index from '@/pages/Index'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Demands from '@/pages/Demands'
import DemandDetail from '@/pages/DemandDetail'
import CreateEvent from '@/pages/CreateEvent'
import Profile from '@/pages/Profile'
import Subscription from '@/pages/Subscription'
import SupplierSearch from '@/pages/SupplierSearch'
import ProviderProfile from '@/pages/ProviderProfile'
import Favorites from '@/pages/Favorites'
import Transactions from '@/pages/Transactions'
import Insights from '@/pages/Insights'
import Schedules from '@/pages/Schedules'
import Messages from '@/pages/Messages'
import NotFound from '@/pages/NotFound'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppProvider } from '@/store/AppContext'

// Global fix for CSS Security Exception (CORS) when accessing cross-origin stylesheets.
// This prevents crashes in external image capture/PDF generation libraries that iterate over document.styleSheets.
if (typeof window !== 'undefined' && typeof CSSStyleSheet !== 'undefined') {
  const originalCssRules = Object.getOwnPropertyDescriptor(CSSStyleSheet.prototype, 'cssRules')
  if (originalCssRules) {
    Object.defineProperty(CSSStyleSheet.prototype, 'cssRules', {
      get() {
        try {
          return originalCssRules.get ? originalCssRules.get.call(this) : []
        } catch (e) {
          if (e instanceof DOMException && e.name === 'SecurityError') {
            console.warn(
              'CORS SecurityError: Blocked access to cross-origin stylesheet cssRules safely bypassed.',
            )
            return []
          }
          throw e
        }
      },
    })
  }
}

function App() {
  return (
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="demands" element={<Demands />} />
              <Route path="demands/:id" element={<DemandDetail />} />
              <Route path="create-event" element={<CreateEvent />} />
              <Route path="profile" element={<Profile />} />
              <Route path="subscription" element={<Subscription />} />
              <Route path="suppliers" element={<SupplierSearch />} />
              <Route path="suppliers/:id" element={<ProviderProfile />} />
              <Route path="favorites" element={<Favorites />} />
              <Route path="schedules" element={<Schedules />} />
              <Route path="finance" element={<Transactions />} />
              <Route path="insights" element={<Insights />} />
              <Route path="messages" element={<Messages />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </TooltipProvider>
    </AppProvider>
  )
}

export default App

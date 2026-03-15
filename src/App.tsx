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
import Registrations from '@/pages/Registrations'
import Inventory from '@/pages/Inventory'
import Reports from '@/pages/Reports'
import NotFound from '@/pages/NotFound'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppProvider } from '@/store/AppContext'

// Global fix for CSS Security Exception (CORS) when accessing cross-origin stylesheets.
// This prevents crashes in external image capture/PDF generation libraries that iterate over document.styleSheets.
if (typeof window !== 'undefined' && typeof CSSStyleSheet !== 'undefined') {
  const patchSheetProperty = (property: string) => {
    const originalDescriptor = Object.getOwnPropertyDescriptor(CSSStyleSheet.prototype, property)
    if (originalDescriptor && originalDescriptor.get) {
      Object.defineProperty(CSSStyleSheet.prototype, property, {
        get() {
          try {
            // Attempt to read the property. Will natively throw SecurityError if cross-origin without CORS.
            return originalDescriptor.get!.call(this) || []
          } catch (e) {
            // Silently bypass blocked access to cross-origin stylesheets to prevent html-to-image crashes
            return []
          }
        },
        configurable: true,
        enumerable: true,
      })
    }
  }

  patchSheetProperty('cssRules')
  patchSheetProperty('rules')
}

// Global fetch interceptor to prevent html-to-image / document generation from crashing
// when a stylesheet or asset returns 404, preventing rendering sequence interruptions.
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch
  window.fetch = async function (...args) {
    try {
      const response = await originalFetch.apply(this, args)
      if (!response.ok && (response.status === 404 || response.status === 403)) {
        const url =
          typeof args[0] === 'string' ? args[0] : args[0] instanceof Request ? args[0].url : ''
        const isAsset =
          url.match(/\.(css|png|jpe?g|svg|woff2?|ttf)(\?.*)?$/i) || url.includes('/assets/')

        if (isAsset) {
          console.warn(`Gracefully intercepted failed fetch for asset: ${url}`)
          let contentType = 'text/plain'
          let body: BodyInit = ''

          if (url.includes('.css')) {
            contentType = 'text/css'
          } else if (url.includes('.svg')) {
            contentType = 'image/svg+xml'
            body = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>'
          } else if (url.match(/\.(png|jpe?g)$/i)) {
            contentType = url.includes('.png') ? 'image/png' : 'image/jpeg'
            const imgData =
              'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
            const binaryString = atob(imgData)
            const bytes = new Uint8Array(binaryString.length)
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i)
            }
            body = bytes
          }

          return new Response(body, {
            status: 200,
            statusText: 'OK',
            headers: new Headers({ 'Content-Type': contentType }),
          })
        }
      }
      return response
    } catch (error) {
      const url =
        typeof args[0] === 'string' ? args[0] : args[0] instanceof Request ? args[0].url : ''
      const isAsset =
        url.match(/\.(css|png|jpe?g|svg|woff2?|ttf)(\?.*)?$/i) || url.includes('/assets/')

      if (isAsset) {
        console.warn(`Gracefully intercepted network error for asset: ${url}`)
        let contentType = 'text/plain'
        let body: BodyInit = ''

        if (url.includes('.css')) {
          contentType = 'text/css'
        } else if (url.includes('.svg')) {
          contentType = 'image/svg+xml'
          body = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>'
        }

        return new Response(body, {
          status: 200,
          statusText: 'OK',
          headers: new Headers({ 'Content-Type': contentType }),
        })
      }
      throw error
    }
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
              <Route path="registrations" element={<Registrations />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="reports" element={<Reports />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </TooltipProvider>
    </AppProvider>
  )
}

export default App

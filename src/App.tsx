import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppProvider } from '@/store/AppContext'

import Layout from './components/Layout'
import Index from './pages/Index'
import Demands from './pages/Demands'
import DemandDetail from './pages/DemandDetail'
import CreateEvent from './pages/CreateEvent'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

const App = () => (
  <AppProvider>
    <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/demandas" element={<Demands />} />
            <Route path="/demanda/:id" element={<DemandDetail />} />
            <Route path="/perfil" element={<Profile />} />
          </Route>
          {/* Create Event is outside main Layout to hide bottom nav for focus */}
          <Route path="/novo-evento" element={<CreateEvent />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </AppProvider>
)

export default App

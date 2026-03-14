import { useApp } from '@/store/AppContext'
import Dashboard from '@/components/home/Dashboard'
import LandingPage from '@/components/home/LandingPage'

export default function Index() {
  const { currentUser } = useApp()
  return currentUser ? <Dashboard /> : <LandingPage />
}

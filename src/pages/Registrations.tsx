import { Navigate } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, Truck } from 'lucide-react'
import { useApp } from '@/store/AppContext'
import ClientsTab from '@/components/registrations/ClientsTab'
import SuppliersTab from '@/components/registrations/SuppliersTab'

export default function Registrations() {
  const { role } = useApp()
  if (role !== 'company') return <Navigate to="/" replace />

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto animate-slide-up pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Users className="w-8 h-8 text-primary" /> Cadastros
        </h1>
        <p className="text-muted-foreground mt-1">
          Gerencie sua base de contatos, clientes e fornecedores em um só lugar.
        </p>
      </div>

      <Tabs defaultValue="clients" className="space-y-6">
        <TabsList className="grid w-full sm:w-[400px] grid-cols-2 bg-secondary p-1 h-auto">
          <TabsTrigger value="clients" className="gap-2 py-2 text-sm font-semibold">
            <Users className="w-4 h-4" /> Clientes
          </TabsTrigger>
          <TabsTrigger value="suppliers" className="gap-2 py-2 text-sm font-semibold">
            <Truck className="w-4 h-4" /> Fornecedores
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clients" className="space-y-4 animate-fade-in">
          <ClientsTab />
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4 animate-fade-in">
          <SuppliersTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

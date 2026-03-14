import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SupplierCRM } from '@/store/AppContext'
import { Truck } from 'lucide-react'
import { SERVICES } from '@/lib/services'

export function SupplierDetailsDialog({
  supplier,
  onClose,
}: {
  supplier: SupplierCRM | null
  onClose: () => void
}) {
  if (!supplier) return null

  const categoryName = SERVICES.find((s) => s.id === supplier.category)?.label || supplier.category

  return (
    <Dialog open={!!supplier} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Truck className="w-5 h-5 text-primary" /> {supplier.name}
          </DialogTitle>
          <DialogDescription className="text-sm">{supplier.email}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Dados do Fornecedor</TabsTrigger>
            <TabsTrigger value="history">Histórico de Contratos</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 pt-4 animate-fade-in">
            <div className="grid grid-cols-2 gap-4 text-sm bg-secondary/20 p-4 rounded-xl border border-border">
              <div>
                <span className="text-muted-foreground block text-xs font-semibold mb-1">
                  CNPJ/CPF
                </span>
                {supplier.cnpjCpf}
              </div>
              <div>
                <span className="text-muted-foreground block text-xs font-semibold mb-1">
                  Inscrição Estadual
                </span>
                {supplier.stateRegistration || 'Não informado'}
              </div>
              <div>
                <span className="text-muted-foreground block text-xs font-semibold mb-1">
                  Telefone
                </span>
                {supplier.phone}
              </div>
              <div>
                <span className="text-muted-foreground block text-xs font-semibold mb-1">
                  Categoria
                </span>
                {categoryName}
              </div>
              <div className="col-span-2 border-t border-border pt-3 mt-1">
                <span className="text-muted-foreground block text-xs font-semibold mb-1">
                  Endereço Completo
                </span>
                {supplier.street}, {supplier.number}{' '}
                {supplier.complement ? `- ${supplier.complement}` : ''}
                <br />
                {supplier.neighborhood} - {supplier.city}/{supplier.state}
                <br />
                CEP: {supplier.cep}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="pt-4 animate-fade-in">
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <Truck className="w-10 h-10 mb-3 opacity-20" />
              <p className="text-sm font-medium">Nenhum contrato registrado nesta visão.</p>
              <p className="text-xs mt-1">
                Este fornecedor ainda não tem histórico detalhado aqui.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

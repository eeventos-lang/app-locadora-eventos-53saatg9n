import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SupplierCRM } from '@/store/AppContext'
import { Truck, FileText } from 'lucide-react'
import { SERVICES } from '@/lib/services'
import { SupplierDocumentsTab } from './SupplierDocumentsTab'
import pb from '@/lib/pocketbase/client'
import { SupplierFinanceTab } from './SupplierFinanceTab'

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
      <DialogContent className="sm:max-w-[750px] p-0 overflow-hidden">
        <div className="p-6 pb-2">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Truck className="w-5 h-5 text-primary" /> {supplier.name}
            </DialogTitle>
            <DialogDescription className="text-sm">{supplier.email}</DialogDescription>
          </DialogHeader>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <div className="px-6 border-b border-border">
            <TabsList className="grid w-full grid-cols-4 bg-transparent p-0 h-auto gap-4">
              <TabsTrigger
                value="details"
                className="pb-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent data-[state=active]:bg-transparent px-0"
              >
                Dados
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="pb-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent data-[state=active]:bg-transparent px-0"
              >
                Contratos
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="pb-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent data-[state=active]:bg-transparent px-0"
              >
                Documentos
              </TabsTrigger>
              <TabsTrigger
                value="finance"
                className="pb-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent data-[state=active]:bg-transparent px-0"
              >
                Financeiro
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6 pt-2 h-[450px] overflow-y-auto">
            <TabsContent value="details" className="space-y-4 pt-4 animate-fade-in m-0">
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

                {supplier.attachments && supplier.attachments.length > 0 && (
                  <div className="col-span-2 border-t border-border pt-3 mt-1">
                    <span className="text-muted-foreground block text-xs font-semibold mb-3">
                      Anexos (CRM)
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      {supplier.attachments.map((filename, i) => {
                        const url = pb.files.getUrl(
                          { collectionId: supplier.collectionId, id: supplier.id } as any,
                          filename,
                        )
                        return (
                          <a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2.5 border rounded-lg hover:bg-muted transition-colors bg-background"
                          >
                            <FileText className="w-4 h-4 text-primary shrink-0" />
                            <span className="text-xs font-medium truncate" title={filename}>
                              {filename}
                            </span>
                          </a>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="history" className="pt-4 animate-fade-in m-0">
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground border border-dashed rounded-xl bg-secondary/5">
                <Truck className="w-10 h-10 mb-3 opacity-20" />
                <p className="text-sm font-medium">Nenhum contrato registrado nesta visão.</p>
                <p className="text-xs mt-1">
                  Este fornecedor ainda não tem histórico detalhado aqui.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="m-0">
              <SupplierDocumentsTab supplierId={supplier.id} />
            </TabsContent>

            <TabsContent value="finance" className="m-0">
              <SupplierFinanceTab supplierId={supplier.id} />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

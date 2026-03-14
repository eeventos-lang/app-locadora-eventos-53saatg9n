import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { FileText, Upload, Trash2, Download } from 'lucide-react'
import { useApp } from '@/store/AppContext'

export function SupplierDocumentsTab({ supplierId }: { supplierId: string }) {
  const { supplierDocuments, addSupplierDocument, deleteSupplierDocument } = useApp()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const docs = supplierDocuments.filter((d) => d.supplierId === supplierId)

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      addSupplierDocument({ supplierId, name: file.name, type: file.type || 'Desconhecido' })
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="space-y-4 pt-2 animate-fade-in">
      <div className="flex justify-between items-center bg-secondary/10 p-4 rounded-xl border border-border">
        <div>
          <h3 className="text-sm font-semibold">Gerenciamento de Documentos</h3>
          <p className="text-xs text-muted-foreground">
            Armazene contratos, certidões e alvarás deste fornecedor.
          </p>
        </div>
        <input type="file" className="hidden" ref={fileInputRef} onChange={handleUpload} />
        <Button onClick={() => fileInputRef.current?.click()} size="sm">
          <Upload className="w-4 h-4 mr-2" /> Upload
        </Button>
      </div>

      {docs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground border border-dashed rounded-xl bg-secondary/5">
          <FileText className="w-10 h-10 mb-3 opacity-20" />
          <p className="text-sm font-medium">Nenhum documento anexado.</p>
          <p className="text-xs mt-1">Faça o upload do primeiro documento para começar.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 border border-border rounded-lg bg-background hover:bg-secondary/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-md">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium line-clamp-1">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(doc.uploadDate).toLocaleDateString()} • {doc.type}
                  </p>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" title="Baixar documento">
                  <Download className="w-4 h-4 text-muted-foreground" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteSupplierDocument(doc.id)}
                  title="Excluir documento"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

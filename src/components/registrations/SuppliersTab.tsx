import { useState, useMemo } from 'react'
import { Plus, Search, FileText, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useApp, SupplierCRM } from '@/store/AppContext'
import { SupplierFormDialog } from '@/components/registrations/SupplierFormDialog'
import { SupplierDetailsDialog } from '@/components/registrations/SupplierDetailsDialog'
import { SERVICES } from '@/lib/services'

export default function SuppliersTab() {
  const { suppliersCRM, currentUser } = useApp()
  const [filterName, setFilterName] = useState('')
  const [filterCnpj, setFilterCnpj] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierCRM | null>(null)

  const mySuppliers = useMemo(() => {
    return suppliersCRM
      .filter((s) => {
        if (s.companyId !== currentUser?.id) return false
        const matchName =
          filterName === '' || s.name.toLowerCase().includes(filterName.toLowerCase())
        const matchCnpj =
          filterCnpj === '' || s.cnpjCpf.replace(/\D/g, '').includes(filterCnpj.replace(/\D/g, ''))
        return matchName && matchCnpj
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [suppliersCRM, currentUser, filterName, filterCnpj])

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Buscar por Nome..."
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="pl-9 bg-card h-11"
            />
          </div>
          <div className="relative">
            <FileText className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Buscar por CNPJ/CPF..."
              value={filterCnpj}
              onChange={(e) => setFilterCnpj(e.target.value)}
              className="pl-9 bg-card h-11"
            />
          </div>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="w-full sm:w-auto shrink-0 shadow-sm h-11"
        >
          <Plus className="w-4 h-4 mr-2" /> Novo Fornecedor
        </Button>
      </div>

      <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CNPJ/CPF</TableHead>
              <TableHead className="hidden md:table-cell">Categoria</TableHead>
              <TableHead className="hidden sm:table-cell">Telefone</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mySuppliers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-12 text-muted-foreground bg-secondary/20"
                >
                  Nenhum fornecedor encontrado.
                </TableCell>
              </TableRow>
            ) : (
              mySuppliers.map((supplier) => {
                const categoryLabel =
                  SERVICES.find((s) => s.id === supplier.category)?.label || supplier.category
                return (
                  <TableRow key={supplier.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium text-foreground">{supplier.name}</TableCell>
                    <TableCell className="text-muted-foreground">{supplier.cnpjCpf}</TableCell>
                    <TableCell className="text-muted-foreground capitalize hidden md:table-cell">
                      {categoryLabel}
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden sm:table-cell">
                      {supplier.phone}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedSupplier(supplier)}
                        className="h-8 gap-2 text-primary hover:text-primary hover:bg-primary/10"
                      >
                        <Eye className="w-4 h-4" /> Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <SupplierFormDialog isOpen={isFormOpen} onOpenChange={setIsFormOpen} />
      <SupplierDetailsDialog
        supplier={selectedSupplier}
        onClose={() => setSelectedSupplier(null)}
      />
    </div>
  )
}

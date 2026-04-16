import { useState, useMemo } from 'react'
import { Plus, Search, FileText, Eye, FileDown, Printer } from 'lucide-react'
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

  const exportCSV = () => {
    const headers = [
      'Nome/Razão Social',
      'CNPJ/CPF',
      'Categoria',
      'E-mail',
      'Telefone',
      'Cidade/UF',
    ]
    const rows = mySuppliers.map((s) => {
      const cat = SERVICES.find((x) => x.id === s.category)?.label || s.category
      return [s.name, s.cnpjCpf, cat, s.email, s.phone, `${s.city}/${s.state}`]
        .map((v) => `"${(v || '').replace(/"/g, '""')}"`)
        .join(',')
    })
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'fornecedores_crm.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportPDF = () => {
    const printWindow = window.open('', '', 'width=800,height=600')
    if (!printWindow) return
    const html = `
      <html>
        <head>
          <title>Relatório de Fornecedores CRM</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
            th { background-color: #f4f4f4; }
            h2 { color: #333; margin-bottom: 5px; }
          </style>
        </head>
        <body>
          <h2>Relatório de Fornecedores</h2>
          <p style="font-size:12px;color:#666;margin-top:0;">Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
          <table>
            <thead>
              <tr><th>Nome</th><th>CNPJ/CPF</th><th>Categoria</th><th>Telefone</th><th>Cidade/UF</th></tr>
            </thead>
            <tbody>
              ${mySuppliers
                .map((s) => {
                  const cat = SERVICES.find((x) => x.id === s.category)?.label || s.category
                  return `<tr><td>${s.name}</td><td>${s.cnpjCpf}</td><td>${cat}</td><td>${s.phone}</td><td>${s.city}/${s.state}</td></tr>`
                })
                .join('')}
            </tbody>
          </table>
        </body>
      </html>
    `
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

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
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <Button
            variant="outline"
            onClick={exportCSV}
            className="h-11 shadow-sm"
            title="Exportar CSV"
          >
            <FileDown className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">CSV</span>
          </Button>
          <Button
            variant="outline"
            onClick={exportPDF}
            className="h-11 shadow-sm"
            title="Exportar PDF"
          >
            <Printer className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">PDF</span>
          </Button>
          <Button onClick={() => setIsFormOpen(true)} className="shadow-sm h-11">
            <Plus className="w-4 h-4 mr-2" /> Novo Fornecedor
          </Button>
        </div>
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

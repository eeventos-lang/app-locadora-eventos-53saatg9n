import { useState, useMemo } from 'react'
import { Navigate } from 'react-router-dom'
import { Package, Plus, Trash2, Box, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useApp } from '@/store/AppContext'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function Inventory() {
  const {
    role,
    currentUser,
    inventoryItems,
    inventoryAllocations,
    addInventoryItem,
    deleteInventoryItem,
    demands,
  } = useApp()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [newItem, setNewItem] = useState({ name: '', category: '', totalQuantity: '' })
  const [searchTerm, setSearchTerm] = useState('')

  if (role !== 'company') return <Navigate to="/" replace />

  const myItems = useMemo(() => {
    return inventoryItems
      .filter((i) => i.companyId === currentUser?.id)
      .filter((i) => i.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .map((item) => {
        const itemAllocations = inventoryAllocations.filter((a) => {
          if (a.inventoryItemId !== item.id) return false
          const demand = demands.find((d) => d.id === a.demandId)
          return demand && demand.status !== 'completed' && demand.status !== 'canceled'
        })
        const allocated = itemAllocations.reduce((sum, a) => sum + a.quantity, 0)
        return {
          ...item,
          allocated,
          available: item.totalQuantity - allocated,
        }
      })
  }, [inventoryItems, currentUser, searchTerm, inventoryAllocations, demands])

  const handleSave = () => {
    if (!newItem.name || !newItem.category || !newItem.totalQuantity) {
      return toast.error('Preencha todos os campos')
    }
    addInventoryItem({
      name: newItem.name,
      category: newItem.category,
      totalQuantity: Number(newItem.totalQuantity),
    })
    toast.success('Item cadastrado com sucesso!')
    setIsOpenForm(false)
  }

  const setIsOpenForm = (open: boolean) => {
    setIsFormOpen(open)
    if (!open) setNewItem({ name: '', category: '', totalQuantity: '' })
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto animate-slide-up pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Package className="w-8 h-8 text-primary" /> Estoque
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie seus itens físicos e acompanhe a disponibilidade para eventos.
          </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsOpenForm}>
          <DialogTrigger asChild>
            <Button className="shrink-0 gap-2 h-11">
              <Plus className="w-4 h-4" /> Cadastrar Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Novo Item no Estoque</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nome do Item</Label>
                <Input
                  placeholder="Ex: Mesa Bistrô"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select
                  value={newItem.category}
                  onValueChange={(val) => setNewItem({ ...newItem, category: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Móveis">Móveis</SelectItem>
                    <SelectItem value="Equipamento Áudio/Luz">Equipamento Áudio/Luz</SelectItem>
                    <SelectItem value="Decoração">Decoração</SelectItem>
                    <SelectItem value="Utensílios">Utensílios (Copos, Pratos)</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Quantidade Total Disponível</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newItem.totalQuantity}
                  onChange={(e) => setNewItem({ ...newItem, totalQuantity: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpenForm(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>Salvar Item</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border shadow-sm">
        <CardContent className="p-0">
          <div className="p-4 border-b border-border">
            <Input
              placeholder="Buscar itens por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md bg-background"
            />
          </div>
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-center">Quantidade Total</TableHead>
                <TableHead className="text-center">Em Uso (Alocados)</TableHead>
                <TableHead className="text-center">Disponível</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    <Box className="w-10 h-10 mx-auto mb-3 opacity-20" />
                    Nenhum item encontrado no estoque.
                  </TableCell>
                </TableRow>
              ) : (
                myItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium text-foreground">{item.name}</TableCell>
                    <TableCell className="text-muted-foreground">{item.category}</TableCell>
                    <TableCell className="text-center font-semibold">
                      {item.totalQuantity}
                    </TableCell>
                    <TableCell className="text-center text-amber-600 font-medium">
                      {item.allocated > 0 ? item.allocated : '-'}
                    </TableCell>
                    <TableCell
                      className={cn(
                        'text-center font-bold',
                        item.available > 0 ? 'text-emerald-600' : 'text-destructive',
                      )}
                    >
                      {item.available}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          if (item.allocated > 0) {
                            toast.error('Não é possível excluir um item que está alocado.')
                            return
                          }
                          deleteInventoryItem(item.id)
                          toast.success('Item excluído.')
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-start gap-2 bg-primary/5 p-4 rounded-xl border border-primary/20 text-sm text-muted-foreground">
        <Info className="w-5 h-5 text-primary shrink-0" />
        <p>
          A <strong>quantidade disponível</strong> é calculada subtraindo o total dos itens alocados
          para eventos que ainda não foram concluídos ou cancelados. Quando um evento é finalizado,
          os itens retornam automaticamente ao estoque.
        </p>
      </div>
    </div>
  )
}

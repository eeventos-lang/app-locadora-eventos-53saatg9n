import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EventFormData } from '@/types/event'

type Totals = {
  total: number
  lines: Array<{
    name: string
    detail: string
    qty: number
    unit: number
    subtotal: number
  }>
}

type Props = {
  formData: EventFormData
  totals: Totals
}

const fmt = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

export const Step3Review = ({ formData, totals }: Props) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-card border border-border rounded-xl p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm text-muted-foreground">Evento</h3>
            <p className="font-medium text-lg text-foreground">
              {formData.title || 'Não informado'}
            </p>
          </div>
          <div className="text-right">
            <h3 className="text-sm text-muted-foreground">Convidados</h3>
            <p className="text-foreground font-medium">{formData.guests}</p>
          </div>
        </div>
        <div>
          <h3 className="text-sm text-muted-foreground mb-3">Resumo e Orçamento</h3>
          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="py-2 h-9 text-xs">Serviço</TableHead>
                  <TableHead className="py-2 h-9 text-xs text-right">Qtd</TableHead>
                  <TableHead className="py-2 h-9 text-xs text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {totals.lines.map((l, i) => (
                  <TableRow key={i}>
                    <TableCell className="py-2">
                      <p className="font-medium text-sm leading-none text-foreground">{l.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {l.detail} • {fmt(l.unit)}
                      </p>
                    </TableCell>
                    <TableCell className="py-2 text-right text-sm text-foreground">
                      {l.qty}
                    </TableCell>
                    <TableCell className="py-2 text-right font-medium text-sm text-foreground">
                      {fmt(l.subtotal)}
                    </TableCell>
                  </TableRow>
                ))}
                {totals.lines.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4 text-xs">
                      Nenhum serviço
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter className="bg-primary/10">
                <TableRow>
                  <TableCell colSpan={2} className="font-bold py-3 text-foreground">
                    Resultado Final
                  </TableCell>
                  <TableCell className="text-right font-bold text-primary py-3">
                    {fmt(totals.total)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useMemo } from 'react'
import { CalendarClock, CheckCircle2, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/store/AppContext'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function Schedules() {
  const { scheduledInvitations, users, currentUser, role } = useApp()

  const mySchedules = useMemo(() => {
    return scheduledInvitations
      .filter((s) => s.customerId === currentUser?.id)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [scheduledInvitations, currentUser])

  if (role !== 'customer') {
    return (
      <div className="p-8 text-center text-muted-foreground animate-fade-in">
        Acesso exclusivo para clientes.
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto animate-slide-up pb-12">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <CalendarClock className="w-8 h-8 text-primary" />
          Convites Agendados
        </h1>
        <p className="text-muted-foreground">
          Gerencie os eventos futuros que você já programou com seus fornecedores favoritos.
        </p>
      </div>

      <div className="space-y-4">
        {mySchedules.length === 0 ? (
          <div className="col-span-full p-16 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-2xl bg-secondary/20">
            <CalendarClock className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">Nenhum agendamento ativo.</p>
            <p className="text-sm mt-1">
              Vá até seus favoritos para agendar convites para eventos futuros.
            </p>
          </div>
        ) : (
          mySchedules.map((schedule) => {
            const supplier = users.find((u) => u.id === schedule.supplierId)
            const eventDate = new Date(schedule.date)
            const isSent = schedule.status === 'sent'

            return (
              <Card
                key={schedule.id}
                className="border-border shadow-sm hover:shadow-md transition-shadow bg-card"
              >
                <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-xl text-foreground flex items-center gap-2">
                      {schedule.title}
                    </h3>
                    <p className="text-muted-foreground text-sm flex items-center gap-2">
                      <span className="font-semibold text-foreground">Fornecedor:</span>
                      {supplier?.companyProfile?.name || 'Desconhecido'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Agendado em:{' '}
                      {format(new Date(schedule.createdAt), "dd 'de' MMM, yyyy", { locale: ptBR })}
                    </p>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-3 min-w-[200px] bg-secondary/30 p-4 rounded-xl border border-border/50">
                    <div className="text-left md:text-right w-full">
                      <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1">
                        Data do Evento
                      </p>
                      <span className="text-lg font-bold text-primary">
                        {format(eventDate, "dd 'de' MMMM, yyyy", { locale: ptBR })}
                      </span>
                    </div>
                    {isSent ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 gap-1 w-full justify-center md:w-auto">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Convite Enviado
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 gap-1 w-full justify-center md:w-auto">
                        <Clock className="w-3.5 h-3.5" /> Aguardando Envio
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

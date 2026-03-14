import { Navigate } from 'react-router-dom'
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  History,
  Smartphone,
  Megaphone,
  Receipt,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { useApp } from '@/store/AppContext'

const Subscription = () => {
  const { role, isSubscribed, setIsSubscribed } = useApp()
  const { toast } = useToast()

  if (role !== 'company') {
    return <Navigate to="/" replace />
  }

  const handlePayment = () => {
    setIsSubscribed(true)
    toast({
      title: 'Pagamento Confirmado',
      description: 'Sua assinatura foi reativada com sucesso. Você já pode receber demandas!',
    })
  }

  const monthlyFee = 49.9

  const history = [
    { id: '1', month: 'Abril / 2026', date: '10/04/2026', amount: monthlyFee, status: 'paid' },
    { id: '2', month: 'Março / 2026', date: '10/03/2026', amount: monthlyFee, status: 'paid' },
    { id: '3', month: 'Fevereiro / 2026', date: '10/02/2026', amount: monthlyFee, status: 'paid' },
  ]

  return (
    <div className="p-6 space-y-6 animate-slide-up pb-24">
      <header className="mb-2">
        <h1 className="text-2xl font-bold">Assinatura Premium</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Gerencie sua taxa mensal de administração
        </p>
      </header>

      {/* Status Card */}
      <Card
        className={`border transition-colors ${
          isSubscribed
            ? 'border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.05)]'
            : 'border-amber-500/50 bg-amber-500/5 shadow-[0_0_20px_rgba(245,158,11,0.05)]'
        }`}
      >
        <CardContent className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                Status Atual
              </p>
              <div className="flex items-center gap-2">
                {isSubscribed ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-lg font-bold text-emerald-500">Ativo</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    <span className="text-lg font-bold text-amber-500">Pendente</span>
                  </>
                )}
              </div>
            </div>
            <Badge
              variant="outline"
              className={
                isSubscribed
                  ? 'text-emerald-400 border-emerald-500/30'
                  : 'text-amber-400 border-amber-500/30'
              }
            >
              {isSubscribed ? 'Regular' : 'Atrasado'}
            </Badge>
          </div>

          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-muted-foreground">Valor Mensal</span>
              <span className="text-lg font-semibold text-white">
                R$ {monthlyFee.toFixed(2).replace('.', ',')}
              </span>
            </div>

            {!isSubscribed && (
              <div className="space-y-3 animate-fade-in">
                <p className="text-xs text-amber-500/80 bg-amber-500/10 p-2 rounded-md">
                  Sua fatura deste mês está aguardando pagamento. Regularize para visualizar novas
                  demandas.
                </p>
                <Button
                  onClick={handlePayment}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)] gap-2 h-12"
                >
                  <CreditCard className="w-5 h-5" />
                  Pagar Agora
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Details Card */}
      <Card className="bg-card border-border">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-base flex items-center gap-2 text-white">
            <Receipt className="w-5 h-5 text-primary" />
            Detalhes da Taxa 01
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-0 space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Taxa mensal para manutenção do aplicativo e divulgação em redes sociais.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/30 border border-border/50 p-3 rounded-lg flex flex-col items-center text-center gap-2">
              <Smartphone className="w-6 h-6 text-blue-400" />
              <span className="text-xs font-medium text-white">Manutenção App</span>
            </div>
            <div className="bg-muted/30 border border-border/50 p-3 rounded-lg flex flex-col items-center text-center gap-2">
              <Megaphone className="w-6 h-6 text-pink-400" />
              <span className="text-xs font-medium text-white">Divulgação Redes</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History */}
      <section className="space-y-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <History className="w-5 h-5 text-muted-foreground" />
          Histórico de Pagamentos
        </h3>
        <div className="space-y-3">
          {!isSubscribed && (
            <div className="flex items-center justify-between p-4 bg-card border border-amber-500/30 rounded-xl">
              <div>
                <p className="font-medium text-white">Maio / 2026</p>
                <p className="text-xs text-amber-500 mt-0.5">Vencido em 10/05/2026</p>
              </div>
              <div className="text-right flex flex-col items-end gap-1">
                <p className="font-bold text-white">R$ {monthlyFee.toFixed(2).replace('.', ',')}</p>
                <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full font-medium">
                  Pendente
                </span>
              </div>
            </div>
          )}
          {history.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-card border border-border/50 rounded-xl"
            >
              <div>
                <p className="font-medium text-white">{item.month}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Pago em {item.date}</p>
              </div>
              <div className="text-right flex flex-col items-end gap-1">
                <p className="font-bold text-white">
                  R$ {item.amount.toFixed(2).replace('.', ',')}
                </p>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full font-medium">
                  Pago
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Subscription

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
    <div className="space-y-8 animate-slide-up pb-12">
      <header className="mb-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Assinatura Premium</h1>
        <p className="text-muted-foreground mt-1 text-lg">
          Gerencie sua taxa mensal de administração e benefícios
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Status Card */}
        <Card
          className={`border transition-colors ${
            isSubscribed ? 'border-emerald-500/30 shadow-sm' : 'border-amber-500/50 shadow-sm'
          }`}
        >
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Status Atual
                </p>
                <div className="flex items-center gap-2">
                  {isSubscribed ? (
                    <>
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      <span className="text-2xl font-bold text-foreground">Ativo</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-6 h-6 text-amber-500" />
                      <span className="text-2xl font-bold text-foreground">Pendente</span>
                    </>
                  )}
                </div>
              </div>
              <Badge
                variant="outline"
                className={
                  isSubscribed
                    ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs'
                    : 'text-amber-400 border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs'
                }
              >
                {isSubscribed ? 'Regular' : 'Atrasado'}
              </Badge>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-medium text-muted-foreground">Valor Mensal</span>
                <span className="text-3xl font-bold text-foreground">
                  R$ {monthlyFee.toFixed(2).replace('.', ',')}
                </span>
              </div>

              {!isSubscribed && (
                <div className="space-y-4 animate-fade-in">
                  <p className="text-sm text-amber-400 bg-amber-500/10 p-4 rounded-lg border border-amber-500/20 leading-relaxed">
                    Sua fatura deste mês está aguardando pagamento. Regularize para visualizar novas
                    demandas na plataforma.
                  </p>
                  <Button
                    size="lg"
                    onClick={handlePayment}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-zinc-50 gap-2 h-14 text-base shadow-md"
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
        <Card className="border-border shadow-sm bg-card">
          <CardHeader className="p-6 pb-4">
            <CardTitle className="text-lg flex items-center gap-2 text-foreground border-b border-border pb-4">
              <Receipt className="w-5 h-5 text-primary" />
              Detalhes do Plano
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2 space-y-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sua assinatura garante o acesso contínuo à plataforma e-eventos e promove a divulgação
              ativa dos seus serviços nas nossas redes sociais oficiais.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary p-5 rounded-xl flex flex-col items-center text-center gap-3">
                <Smartphone className="w-8 h-8 text-primary" />
                <span className="text-sm font-semibold text-foreground">Acesso ao App</span>
              </div>
              <div className="bg-secondary p-5 rounded-xl flex flex-col items-center text-center gap-3">
                <Megaphone className="w-8 h-8 text-pink-500" />
                <span className="text-sm font-semibold text-foreground">Marketing Redes</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History */}
      <section className="space-y-6 pt-4">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
          <History className="w-5 h-5 text-muted-foreground" />
          Histórico de Faturas
        </h3>
        <div className="space-y-3">
          {!isSubscribed && (
            <div className="flex items-center justify-between p-5 bg-card border border-amber-500/30 shadow-sm rounded-xl">
              <div>
                <p className="font-semibold text-foreground text-lg">Maio / 2026</p>
                <p className="text-sm text-amber-400 mt-1">Vencido em 10/05/2026</p>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <p className="text-xl font-bold text-foreground">
                  R$ {monthlyFee.toFixed(2).replace('.', ',')}
                </p>
                <Badge
                  variant="outline"
                  className="bg-amber-500/10 text-amber-400 border-amber-500/20"
                >
                  Pendente
                </Badge>
              </div>
            </div>
          )}
          {history.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-5 bg-card border border-border shadow-sm rounded-xl hover:border-primary/50 transition-colors"
            >
              <div>
                <p className="font-semibold text-foreground text-lg">{item.month}</p>
                <p className="text-sm text-muted-foreground mt-1">Pago em {item.date}</p>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <p className="text-xl font-bold text-foreground">
                  R$ {item.amount.toFixed(2).replace('.', ',')}
                </p>
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                >
                  Pago
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Subscription

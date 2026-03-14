import { useApp } from '@/store/AppContext'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const Profile = () => {
  const { role, setRole, isSubscribed, setIsSubscribed } = useApp()

  const isCompany = role === 'company'

  return (
    <div className="p-6 space-y-8 animate-slide-up">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary">
          <span className="text-2xl font-bold text-primary">JD</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">João Doe</h1>
          <p className="text-muted-foreground text-sm">joao.doe@exemplo.com</p>
        </div>
      </div>

      <div className="space-y-4">
        <Card className="bg-card border-border">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <Label className="text-base text-white font-semibold">Modo Locadora</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Ative para ver oportunidades de eventos
              </p>
            </div>
            <Switch
              checked={isCompany}
              onCheckedChange={(checked) => setRole(checked ? 'company' : 'customer')}
            />
          </CardContent>
        </Card>

        {isCompany && (
          <Card className="bg-card border-border animate-fade-in border-primary/50">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <Label className="text-base text-white font-semibold">Assinatura Premium</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Taxa mensal para receber demandas
                </p>
              </div>
              <Switch checked={isSubscribed} onCheckedChange={setIsSubscribed} />
            </CardContent>
          </Card>
        )}
      </div>

      <section className="space-y-4">
        <h3 className="font-semibold text-white">Dados Pessoais</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nome Completo</Label>
            <Input defaultValue="João Doe" className="bg-card border-border" />
          </div>
          <div className="space-y-2">
            <Label>Telefone</Label>
            <Input defaultValue="(11) 98765-4321" className="bg-card border-border" />
          </div>
          <div className="space-y-2">
            <Label>CPF / CNPJ</Label>
            <Input defaultValue="123.456.789-00" className="bg-card border-border" />
          </div>
        </div>
      </section>

      {isCompany && (
        <section className="space-y-4 animate-fade-in">
          <h3 className="font-semibold text-white">Perfil da Locadora</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome da Empresa</Label>
              <Input defaultValue="JD Eventos Tech" className="bg-card border-border" />
            </div>
            <div className="space-y-2">
              <Label>Especialidades</Label>
              <Input
                defaultValue="Som, Iluminação, Painel de LED"
                className="bg-card border-border"
              />
            </div>
          </div>
        </section>
      )}

      <Button
        variant="outline"
        className="w-full mt-8 border-destructive/50 text-destructive hover:bg-destructive hover:text-white"
      >
        Sair da Conta
      </Button>
    </div>
  )
}

export default Profile

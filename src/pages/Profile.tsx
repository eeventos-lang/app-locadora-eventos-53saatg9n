import { useRef, useState, useEffect } from 'react'
import { useApp } from '@/store/AppContext'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Upload } from 'lucide-react'

const Profile = () => {
  const { role, setRole, isSubscribed, setIsSubscribed, companyProfile, updateCompanyProfile } =
    useApp()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [localProfile, setLocalProfile] = useState(companyProfile)

  useEffect(() => {
    setLocalProfile(companyProfile)
  }, [companyProfile])

  const isCompany = role === 'company'

  const handleSave = () => {
    updateCompanyProfile(localProfile)
    toast({
      title: 'Cadastro Salvo',
      description: 'Os dados da sua locadora foram atualizados com sucesso.',
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setLocalProfile({ ...localProfile, logo: url })
    }
  }

  return (
    <div className="p-6 space-y-8 animate-slide-up pb-24">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary overflow-hidden">
          {isCompany && companyProfile.logo ? (
            <img src={companyProfile.logo} alt="Logo" className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-bold text-primary">JD</span>
          )}
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
              <Label>Logo Marca da Empresa</Label>
              <div
                className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-primary/50 transition-colors bg-card/50"
                onClick={() => fileInputRef.current?.click()}
              >
                {localProfile.logo ? (
                  <img
                    src={localProfile.logo}
                    alt="Logo Preview"
                    className="h-24 w-auto object-contain rounded"
                  />
                ) : (
                  <div className="flex flex-col items-center text-muted-foreground">
                    <Upload className="h-8 w-8 mb-2 opacity-50" />
                    <span className="text-sm">Clique para fazer upload</span>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Nome da Empresa</Label>
              <Input
                value={localProfile.name}
                onChange={(e) => setLocalProfile({ ...localProfile, name: e.target.value })}
                className="bg-card border-border"
              />
            </div>

            <div className="space-y-2">
              <Label>Endereço da Empresa</Label>
              <Input
                value={localProfile.address}
                onChange={(e) => setLocalProfile({ ...localProfile, address: e.target.value })}
                placeholder="Rua, Número, Bairro, Cidade - UF"
                className="bg-card border-border"
              />
            </div>

            <div className="space-y-2">
              <Label>Especialidades</Label>
              <Input
                value={localProfile.specialties}
                onChange={(e) => setLocalProfile({ ...localProfile, specialties: e.target.value })}
                className="bg-card border-border"
              />
            </div>

            <div className="space-y-2">
              <Label>Obs:</Label>
              <Textarea
                value={localProfile.observations}
                onChange={(e) => setLocalProfile({ ...localProfile, observations: e.target.value })}
                placeholder="Detalhes, história ou informações adicionais da sua empresa..."
                className="bg-card border-border min-h-[100px] resize-none"
              />
            </div>

            <Button onClick={handleSave} className="w-full mt-4 h-12 text-md">
              Salvar Cadastro
            </Button>
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

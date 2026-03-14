import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '@/store/AppContext'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Upload } from 'lucide-react'
import { SERVICES } from '@/lib/services'
import { cn } from '@/lib/utils'

const Profile = () => {
  const {
    role,
    setRole,
    isSubscribed,
    setIsSubscribed,
    companyProfile,
    updateCompanyProfile,
    currentUser,
    logout,
  } = useApp()
  const { toast } = useToast()
  const navigate = useNavigate()
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
      description: 'Os dados da sua conta foram atualizados com sucesso.',
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setLocalProfile({ ...localProfile, logo: url })
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="space-y-8 animate-slide-up pb-12 p-6 md:p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center border border-border shadow-sm overflow-hidden">
          {isCompany && companyProfile.logo ? (
            <img src={companyProfile.logo} alt="Logo" className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl font-bold text-muted-foreground uppercase">
              {currentUser?.name?.charAt(0) || 'U'}
            </span>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {currentUser?.name || 'Usuário'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {currentUser?.email || 'usuario@exemplo.com'}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <Label className="text-base text-foreground font-semibold">Modo Locadora</Label>
              <p className="text-sm text-muted-foreground mt-1">
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
          <Card className="border-border shadow-sm animate-fade-in">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <Label className="text-base text-foreground font-semibold">
                  Assinatura Premium
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Receba e responda demandas ilimitadas
                </p>
              </div>
              <Switch checked={isSubscribed} onCheckedChange={setIsSubscribed} />
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-foreground border-b border-border pb-2">
            Dados Pessoais
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input defaultValue={currentUser?.name || ''} />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input placeholder="(11) 90000-0000" />
            </div>
            <div className="space-y-2">
              <Label>CPF / CNPJ</Label>
              <Input placeholder="000.000.000-00" />
            </div>
            {!isCompany && (
              <Button onClick={handleSave} className="w-full mt-4 h-12 text-md shadow-sm">
                Salvar Cadastro
              </Button>
            )}
          </div>
        </section>

        {isCompany && (
          <section className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold text-foreground border-b border-border pb-2">
              Perfil da Locadora
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Logo Marca da Empresa</Label>
                <div
                  className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-6 cursor-pointer hover:border-primary/50 hover:bg-secondary/50 transition-colors bg-card"
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
                      <span className="text-sm font-medium">Clique para fazer upload</span>
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
                />
              </div>

              <div className="space-y-2">
                <Label>Áreas de Atuação</Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[300px] overflow-y-auto p-1">
                  {SERVICES.map((s) => {
                    const isSelected = localProfile.sectors?.includes(s.id)
                    return (
                      <div
                        key={s.id}
                        className={cn(
                          'border rounded-xl p-3 cursor-pointer flex flex-col items-center justify-center gap-2 transition-all',
                          isSelected
                            ? 'bg-primary/10 border-primary text-foreground shadow-sm'
                            : 'bg-card border-border text-muted-foreground hover:bg-card/80',
                        )}
                        onClick={() => {
                          const val = localProfile.sectors || []
                          if (val.includes(s.id))
                            setLocalProfile({
                              ...localProfile,
                              sectors: val.filter((v) => v !== s.id),
                            })
                          else setLocalProfile({ ...localProfile, sectors: [...val, s.id] })
                        }}
                      >
                        <s.icon className={cn('w-6 h-6', isSelected ? s.color : '')} />
                        <span className="text-[10px] sm:text-xs font-semibold text-center leading-tight">
                          {s.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Você receberá apenas demandas relacionadas aos setores selecionados.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Endereço da Empresa</Label>
                <Input
                  value={localProfile.address}
                  onChange={(e) => setLocalProfile({ ...localProfile, address: e.target.value })}
                  placeholder="Rua, Número, Bairro, Cidade - UF"
                />
              </div>

              <div className="space-y-2">
                <Label>Especialidades Adicionais</Label>
                <Input
                  value={localProfile.specialties}
                  onChange={(e) =>
                    setLocalProfile({ ...localProfile, specialties: e.target.value })
                  }
                  placeholder="Ex: Flores, Arranjos..."
                />
              </div>

              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea
                  value={localProfile.observations}
                  onChange={(e) =>
                    setLocalProfile({ ...localProfile, observations: e.target.value })
                  }
                  placeholder="Detalhes, história ou informações adicionais da sua empresa..."
                  className="min-h-[120px] resize-none"
                />
              </div>

              <Button onClick={handleSave} className="w-full mt-4 h-12 text-md shadow-sm">
                Salvar Cadastro
              </Button>
            </div>
          </section>
        )}
      </div>

      <div className="pt-8 border-t border-border">
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full sm:w-auto text-destructive border-destructive/30 hover:bg-destructive hover:text-destructive-foreground"
        >
          Sair da Conta
        </Button>
      </div>
    </div>
  )
}

export default Profile

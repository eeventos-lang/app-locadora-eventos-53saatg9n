import { useRef, useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '@/store/AppContext'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { useToast } from '@/hooks/use-toast'
import {
  Upload,
  BadgeCheck,
  AlertCircle,
  ShieldCheck,
  Trophy,
  Award,
  CalendarDays,
  CalendarSync,
  RefreshCw,
  Mail,
  Chrome,
  CheckCircle2,
} from 'lucide-react'
import { SERVICES } from '@/lib/services'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

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
    reviews,
    getSafetyIndex,
  } = useApp()
  const { toast } = useToast()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [localProfile, setLocalProfile] = useState(companyProfile)
  const [isSyncing, setIsSyncing] = useState<'google' | 'outlook' | null>(null)

  useEffect(() => {
    setLocalProfile(companyProfile)
  }, [companyProfile])

  const isCompany = role === 'company'
  const isVerified = localProfile.isVerified

  const fiveStarCount = useMemo(() => {
    if (!currentUser) return 0
    return reviews.filter((r) => r.supplierId === currentUser.id && r.rating === 5).length
  }, [reviews, currentUser])

  const isExpert = fiveStarCount >= 10
  const isHighPerformance = fiveStarCount >= 25
  const safetyIndex = currentUser ? getSafetyIndex(currentUser.id) : 100

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

  const handlePortfolioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLocalProfile({ ...localProfile, portfolio: file.name })
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleToggleIntegration = (provider: 'google' | 'outlook') => {
    setIsSyncing(provider)
    setTimeout(() => {
      const current = localProfile.integrations?.[provider]
      const updatedProfile = {
        ...localProfile,
        integrations: {
          ...localProfile.integrations,
          [provider]: current?.connected
            ? { connected: false, lastSync: '' }
            : {
                connected: true,
                lastSync: new Date().toISOString(),
                account: `agenda.${provider}@empresa.com`,
              },
        },
      }
      setLocalProfile(updatedProfile)
      updateCompanyProfile(updatedProfile)
      setIsSyncing(null)
      toast({
        title: current?.connected ? 'Integração Removida' : 'Calendário Sincronizado',
        description: current?.connected
          ? `Sua conta ${provider} foi desconectada.`
          : `A partir de agora, seus eventos confirmados refletirão no ${provider}.`,
      })
    }, 1500)
  }

  return (
    <div className="space-y-8 animate-slide-up pb-12 p-6 md:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center border border-border shadow-sm overflow-hidden shrink-0">
            {isCompany && companyProfile.logo ? (
              <img src={companyProfile.logo} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-muted-foreground uppercase">
                {currentUser?.name?.charAt(0) || 'U'}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2 flex-wrap">
              {currentUser?.name || 'Usuário'}
              {isCompany && isVerified && (
                <BadgeCheck
                  className="w-7 h-7 text-blue-500 shrink-0"
                  title="Fornecedor Verificado"
                />
              )}
            </h1>
            <p className="text-muted-foreground mt-1">
              {currentUser?.email || 'usuario@exemplo.com'}
            </p>
          </div>
        </div>

        {isCompany && (
          <div className="flex flex-col gap-2 mt-4 sm:mt-0">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-[-4px]">
              Desempenho e Segurança
            </span>
            <div className="flex flex-wrap gap-2">
              <Badge
                className={cn(
                  'px-3 py-1.5 shadow-sm',
                  safetyIndex >= 90
                    ? 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-600 border-amber-500/30',
                )}
              >
                <ShieldCheck className="w-4 h-4 mr-1.5" /> Índice de Segurança: {safetyIndex}%
              </Badge>
              {isHighPerformance && (
                <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30 px-3 py-1.5 shadow-sm">
                  <Trophy className="w-4 h-4 mr-1.5" /> Alta Performance
                </Badge>
              )}
              {isExpert && !isHighPerformance && (
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-3 py-1.5 shadow-sm">
                  <Award className="w-4 h-4 mr-1.5" /> Fornecedor Expert
                </Badge>
              )}
            </div>
          </div>
        )}
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

      {isCompany && (
        <>
          <section className="space-y-6 animate-fade-in mt-8 bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-border pb-4 mb-4">
              <CalendarSync className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold text-foreground">Integrações de Calendário</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Sincronize sua agenda do e-eventos com seus calendários externos para evitar conflitos
              de horários de forma transparente e automatizada.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              {['google', 'outlook'].map((provider) => {
                const isGoogle = provider === 'google'
                const status =
                  localProfile.integrations?.[provider as keyof typeof localProfile.integrations]
                const Icon = isGoogle ? Chrome : Mail

                return (
                  <Card
                    key={provider}
                    className={cn(
                      'border transition-colors',
                      status?.connected ? 'border-primary shadow-sm bg-primary/5' : 'border-border',
                    )}
                  >
                    <CardContent className="p-5 flex flex-col items-center text-center gap-4">
                      <div
                        className={cn(
                          'p-3 rounded-full',
                          status?.connected ? 'bg-primary text-primary-foreground' : 'bg-secondary',
                        )}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold capitalize text-lg">
                          {isGoogle ? 'Google Calendar' : 'Outlook Calendar'}
                        </h4>
                        {status?.connected ? (
                          <div className="flex flex-col items-center mt-1">
                            <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Sincronizado
                            </span>
                            <span className="text-xs text-muted-foreground mt-1">
                              {status.account}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground mt-1 block">
                            Não conectado
                          </span>
                        )}
                      </div>
                      <Button
                        variant={status?.connected ? 'outline' : 'default'}
                        className="w-full mt-2"
                        onClick={() => handleToggleIntegration(provider as any)}
                        disabled={isSyncing === provider}
                      >
                        {isSyncing === provider ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Atualizando...
                          </>
                        ) : status?.connected ? (
                          'Desconectar'
                        ) : (
                          'Conectar Conta'
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>

          <section className="space-y-6 animate-fade-in mt-8 bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold text-foreground">Gerenciar Disponibilidade</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mt-2 max-w-xl">
                  Selecione as datas em que você <strong>não estará disponível</strong>. Clientes
                  não poderão enviar convites para estes dias.
                </p>
              </div>
              <Button onClick={handleSave} className="shrink-0 shadow-sm">
                Salvar Agenda
              </Button>
            </div>

            <div className="flex justify-center border border-border rounded-xl p-4 bg-background w-fit mx-auto shadow-inner">
              <Calendar
                mode="multiple"
                selected={localProfile.unavailableDates?.map((d) => {
                  const [y, m, day] = d.split('-').map(Number)
                  return new Date(y, m - 1, day)
                })}
                onSelect={(dates) => {
                  setLocalProfile((prev) => ({
                    ...prev,
                    unavailableDates: dates?.map((d) => format(d, 'yyyy-MM-dd')) || [],
                  }))
                }}
                className="p-3"
              />
            </div>
          </section>
        </>
      )}

      {isCompany && (
        <section className="space-y-6 animate-fade-in mt-8 bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold text-foreground">Verificação da Empresa</h3>
            </div>
            {isVerified ? (
              <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20">
                Fornecedor Verificado
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-muted-foreground flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Pendente
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Envie sua documentação para ganhar o selo de fornecedor verificado. Perfis verificados
            ganham mais destaque e confiança dos clientes na hora de fechar negócio.
          </p>
          <div className="grid gap-6 md:grid-cols-2 pt-2">
            <div className="space-y-2">
              <Label className="font-semibold">CNPJ</Label>
              <Input
                placeholder="00.000.000/0000-00"
                className="h-11"
                value={localProfile.cnpj || ''}
                onChange={(e) => setLocalProfile({ ...localProfile, cnpj: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Portfólio de Serviços (PDF)</Label>
              <Input
                type="file"
                accept=".pdf"
                className="h-11 cursor-pointer file:cursor-pointer"
                onChange={handlePortfolioUpload}
              />
              {localProfile.portfolio && (
                <p className="text-xs font-medium text-emerald-500 mt-2 flex items-center gap-1">
                  <BadgeCheck className="w-3.5 h-3.5" /> Arquivo atual: {localProfile.portfolio}
                </p>
              )}
            </div>
          </div>
          <div className="pt-2">
            <Button onClick={handleSave} className="w-full sm:w-auto h-11 shadow-sm px-8">
              Salvar Verificação
            </Button>
          </div>
        </section>
      )}

      <div className="grid gap-8 md:grid-cols-2 mt-8">
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-foreground border-b border-border pb-2">
            Dados Pessoais
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input defaultValue={currentUser?.name || ''} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input placeholder="(11) 90000-0000" className="h-11" />
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
                  className="h-11"
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
              </div>

              <div className="space-y-2">
                <Label>Endereço da Empresa</Label>
                <Input
                  className="h-11"
                  value={localProfile.address}
                  onChange={(e) => setLocalProfile({ ...localProfile, address: e.target.value })}
                  placeholder="Rua, Número, Bairro, Cidade - UF"
                />
              </div>

              <div className="space-y-2">
                <Label>Especialidades Adicionais</Label>
                <Input
                  className="h-11"
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
                Salvar Perfil
              </Button>
            </div>
          </section>
        )}
      </div>

      <div className="pt-8 border-t border-border print:hidden">
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full sm:w-auto text-destructive border-destructive/30 hover:bg-destructive hover:text-destructive-foreground h-11"
        >
          Sair da Conta
        </Button>
      </div>
    </div>
  )
}

export default Profile

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { useApp, TechRequirement } from '@/store/AppContext'
import { SERVICES } from '@/lib/services'

const steps = ['Básico', 'Serviços', 'Revisão']
const fmt = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

const CreateEvent = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { addDemand } = useApp()
  const [currentStep, setCurrentStep] = useState(1)

  const [formData, setFormData] = useState({
    title: '',
    guests: 100,
    date: '',
    location: '',
    requirements: {
      sound: false,
      light: false,
      led: false,
      grid: false,
      buffet: false,
      drinks: false,
      cocktails: false,
      photo: false,
      video: false,
      singer: false,
      band: false,
      dj: false,
      space: false,
      ceremonial: false,
      security: false,
      details: '',
    },
  })

  const [configs, setConfigs] = useState({
    buffetTier: 'prime' as 'prime' | 'premium' | 'top',
    cocktailsGuests: 100,
    drinksGuests: 100,
    securityCount: 2,
  })

  const updateForm = (field: string, value: any) => setFormData((p) => ({ ...p, [field]: value }))
  const updateReq = (field: string, value: boolean) =>
    setFormData((p) => ({ ...p, requirements: { ...p.requirements, [field]: value } }))

  const getTotals = () => {
    let total = 0
    const lines: Array<{
      name: string
      detail: string
      qty: number
      unit: number
      subtotal: number
    }> = []

    const addLine = (name: string, detail: string, qty: number, unit: number) => {
      const subtotal = qty * unit
      total += subtotal
      lines.push({ name, detail, qty, unit, subtotal })
    }

    const fixed = {
      sound: 1500,
      light: 1000,
      led: 2500,
      grid: 800,
      photo: 2000,
      video: 2500,
      singer: 1200,
      band: 4000,
      dj: 1000,
      space: 5000,
      ceremonial: 1500,
    }
    SERVICES.forEach((s) => {
      if (formData.requirements[s.id as keyof TechRequirement] && s.id in fixed) {
        addLine(s.label, 'Taxa Fixa', 1, fixed[s.id as keyof typeof fixed])
      }
    })

    if (formData.requirements.buffet) {
      const p = { prime: 150, premium: 200, top: 300 }[configs.buffetTier]
      addLine('Buffet', `Classe ${configs.buffetTier.toUpperCase()}`, formData.guests, p)
    }
    if (formData.requirements.drinks) addLine('Bebidas', 'Por pessoa', configs.drinksGuests, 50)
    if (formData.requirements.cocktails)
      addLine('Bar Drinks', 'Por pessoa', configs.cocktailsGuests, 70)
    if (formData.requirements.security) addLine('Seguranças', 'Qtd', configs.securityCount, 150)

    return { total, lines }
  }

  const totals = getTotals()

  const handleNext = () => currentStep < 3 && setCurrentStep((p) => p + 1)
  const handleBack = () => (currentStep > 1 ? setCurrentStep((p) => p - 1) : navigate(-1))

  const handleSubmit = () => {
    addDemand({ ...formData, title: formData.title || 'Novo Evento', budget: totals.total })
    toast({ title: 'Sucesso!', description: 'Sua demanda foi publicada para os fornecedores.' })
    navigate('/demandas')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col animate-slide-up relative z-50">
      <header className="flex items-center p-4 border-b border-border/50 bg-background/95 backdrop-blur sticky top-0">
        <button onClick={handleBack} className="p-2 -ml-2 text-muted-foreground hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-semibold ml-2">Nova Demanda</h1>
      </header>

      <div className="flex-1 p-6 overflow-y-auto pb-24">
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted rounded-full -z-10"></div>
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full -z-10 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
          {steps.map((label, i) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300 ${currentStep > i ? 'bg-primary text-white' : currentStep === i + 1 ? 'bg-primary text-white shadow-[0_0_10px_rgba(0,82,255,0.5)]' : 'bg-muted text-muted-foreground'}`}
              >
                {currentStep > i ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
              </div>
              <span
                className={`text-[10px] uppercase tracking-wider ${currentStep >= i + 1 ? 'text-primary' : 'text-muted-foreground'}`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <Label>Título do Evento</Label>
              <Input
                placeholder="Ex: Casamento João e Maria"
                value={formData.title}
                onChange={(e) => updateForm('title', e.target.value)}
                className="bg-card border-border"
              />
            </div>
            <div className="space-y-2">
              <Label>Número de Convidados (Estimativa)</Label>
              <Input
                type="number"
                value={formData.guests}
                onChange={(e) => {
                  const val = Number(e.target.value)
                  updateForm('guests', val)
                  setConfigs((p) => ({
                    ...p,
                    cocktailsGuests:
                      p.cocktailsGuests === formData.guests ? val : p.cocktailsGuests,
                    drinksGuests: p.drinksGuests === formData.guests ? val : p.drinksGuests,
                  }))
                }}
                className="bg-card border-border"
              />
            </div>
            <div className="space-y-2">
              <Label>Data do Evento</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => updateForm('date', e.target.value)}
                className="bg-card border-border block w-full text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Localização / Cidade</Label>
              <Input
                placeholder="Ex: São Paulo, SP"
                value={formData.location}
                onChange={(e) => updateForm('location', e.target.value)}
                className="bg-card border-border"
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-lg font-semibold">O que você precisa?</h2>
            <div className="grid grid-cols-3 gap-3">
              {SERVICES.map(({ id, label, icon: Icon }) => (
                <div
                  key={id}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer ${formData.requirements[id as keyof TechRequirement] ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(0,82,255,0.2)] text-white' : 'bg-card border-border text-muted-foreground hover:bg-card/80'}`}
                  onClick={() => updateReq(id, !formData.requirements[id as keyof TechRequirement])}
                >
                  <Icon className="w-6 h-6 mb-2" />
                  <span className="text-[10px] font-medium text-center leading-tight">{label}</span>
                </div>
              ))}
            </div>

            {(formData.requirements.buffet ||
              formData.requirements.cocktails ||
              formData.requirements.drinks ||
              formData.requirements.security) && (
              <div className="space-y-4 pt-4 border-t border-border/50 animate-fade-in">
                <h3 className="text-sm font-semibold text-white">Configurações de Serviços</h3>
                {formData.requirements.buffet && (
                  <div className="space-y-2">
                    <Label>Categoria do Buffet</Label>
                    <Select
                      value={configs.buffetTier}
                      onValueChange={(val: any) => setConfigs((p) => ({ ...p, buffetTier: val }))}
                    >
                      <SelectTrigger className="bg-card border-border">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prime">Prime (R$ 150/pessoa)</SelectItem>
                        <SelectItem value="premium">Premium (R$ 200/pessoa)</SelectItem>
                        <SelectItem value="top">Top (R$ 300/pessoa)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {formData.requirements.cocktails && (
                  <div className="space-y-2">
                    <Label>Pessoas no Bar de Drinks (R$ 70/pessoa)</Label>
                    <Input
                      type="number"
                      value={configs.cocktailsGuests || ''}
                      onChange={(e) =>
                        setConfigs((p) => ({ ...p, cocktailsGuests: Number(e.target.value) }))
                      }
                      className="bg-card border-border"
                    />
                  </div>
                )}
                {formData.requirements.drinks && (
                  <div className="space-y-2">
                    <Label>Pessoas para Bebidas (R$ 50/pessoa)</Label>
                    <Input
                      type="number"
                      value={configs.drinksGuests || ''}
                      onChange={(e) =>
                        setConfigs((p) => ({ ...p, drinksGuests: Number(e.target.value) }))
                      }
                      className="bg-card border-border"
                    />
                  </div>
                )}
                {formData.requirements.security && (
                  <div className="space-y-2">
                    <Label>Quantidade de Seguranças (R$ 150/cada)</Label>
                    <Input
                      type="number"
                      value={configs.securityCount || ''}
                      onChange={(e) =>
                        setConfigs((p) => ({ ...p, securityCount: Number(e.target.value) }))
                      }
                      className="bg-card border-border"
                    />
                  </div>
                )}
              </div>
            )}
            <div className="space-y-2">
              <Label>Detalhes Adicionais</Label>
              <Textarea
                placeholder="Descreva tamanhos, quantidades, cronograma, etc..."
                value={formData.requirements.details}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    requirements: { ...prev.requirements, details: e.target.value },
                  }))
                }
                className="bg-card border-border min-h-[120px]"
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-card border border-border rounded-xl p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm text-muted-foreground">Evento</h3>
                  <p className="font-medium text-lg text-white">
                    {formData.title || 'Não informado'}
                  </p>
                </div>
                <div className="text-right">
                  <h3 className="text-sm text-muted-foreground">Convidados</h3>
                  <p className="text-white font-medium">{formData.guests}</p>
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
                            <p className="font-medium text-sm leading-none">{l.name}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {l.detail} • {fmt(l.unit)}
                            </p>
                          </TableCell>
                          <TableCell className="py-2 text-right text-sm">{l.qty}</TableCell>
                          <TableCell className="py-2 text-right font-medium text-sm">
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
                    <TableFooter className="bg-primary/20">
                      <TableRow>
                        <TableCell colSpan={2} className="font-bold py-3 text-white">
                          Resultado Final
                        </TableCell>
                        <TableCell className="text-right font-bold text-accent py-3">
                          {fmt(totals.total)}
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-border/50">
        <Button
          onClick={currentStep === 3 ? handleSubmit : handleNext}
          className="w-full h-12 text-base font-semibold shadow-[0_4px_14px_0_rgba(0,82,255,0.39)]"
        >
          {currentStep === 3 ? 'Publicar Demanda' : 'Próximo Passo'}
        </Button>
      </div>
    </div>
  )
}

export default CreateEvent

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Speaker, Lightbulb, Monitor, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { useApp } from '@/store/AppContext'

const steps = ['Básico', 'Técnico', 'Revisão']

const CreateEvent = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { addDemand } = useApp()
  const [currentStep, setCurrentStep] = useState(1)

  const [formData, setFormData] = useState({
    title: '',
    budget: '',
    date: '',
    location: '',
    requirements: {
      sound: false,
      lighting: false,
      led: false,
      grid: false,
      details: '',
    },
  })

  const updateForm = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const updateReq = (field: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      requirements: { ...prev.requirements, [field]: value },
    }))
  }

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep((prev) => prev + 1)
  }
  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1)
    else navigate(-1)
  }

  const handleSubmit = () => {
    addDemand({
      title: formData.title || 'Novo Evento',
      budget: Number(formData.budget) || 0,
      date: formData.date,
      location: formData.location,
      requirements: formData.requirements,
    })
    toast({
      title: 'Sucesso!',
      description: 'Sua demanda foi publicada para as locadoras.',
    })
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
        {/* Progress */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted rounded-full -z-10"></div>
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full -z-10 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
          {steps.map((label, i) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300 ${
                  currentStep > i
                    ? 'bg-primary text-white'
                    : currentStep === i + 1
                      ? 'bg-primary text-white shadow-[0_0_10px_rgba(0,82,255,0.5)]'
                      : 'bg-muted text-muted-foreground'
                }`}
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

        {/* Step 1 */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Evento</Label>
              <Input
                id="title"
                placeholder="Ex: Casamento João e Maria"
                value={formData.title}
                onChange={(e) => updateForm('title', e.target.value)}
                className="bg-card border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Valor Disponível (R$)</Label>
              <Input
                id="budget"
                type="number"
                placeholder="5000"
                value={formData.budget}
                onChange={(e) => updateForm('budget', e.target.value)}
                className="bg-card border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Data do Evento</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => updateForm('date', e.target.value)}
                className="bg-card border-border text-white block w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Localização / Cidade</Label>
              <Input
                id="location"
                placeholder="Ex: São Paulo, SP"
                value={formData.location}
                onChange={(e) => updateForm('location', e.target.value)}
                className="bg-card border-border"
              />
            </div>
          </div>
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-lg font-semibold">O que você precisa?</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'sound', label: 'Estrutura de Som', icon: Speaker },
                { id: 'lighting', label: 'Iluminação/Luz', icon: Lightbulb },
                { id: 'led', label: 'Painel de LED', icon: Monitor },
                { id: 'grid', label: 'Estrutura Grid', icon: Layers },
              ].map(({ id, label, icon: Icon }) => (
                <div
                  key={id}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all cursor-pointer ${
                    formData.requirements[id as keyof TechRequirement]
                      ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(0,82,255,0.2)] text-white'
                      : 'bg-card border-border text-muted-foreground hover:bg-card/80'
                  }`}
                  onClick={() => updateReq(id, !formData.requirements[id as keyof TechRequirement])}
                >
                  <Icon className="w-8 h-8 mb-2" />
                  <span className="text-xs font-medium text-center">{label}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="details">Detalhes Técnicos Adicionais</Label>
              <Textarea
                id="details"
                placeholder="Descreva tamanhos, quantidades, etc..."
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

        {/* Step 3 */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div>
                <h3 className="text-sm text-muted-foreground">Evento</h3>
                <p className="font-medium text-lg text-white">
                  {formData.title || 'Não informado'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm text-muted-foreground">Orçamento</h3>
                  <p className="font-semibold text-accent">R$ {formData.budget || '0,00'}</p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">Data</h3>
                  <p className="text-white">{formData.date || 'Não informada'}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm text-muted-foreground mb-2">Equipamentos Solicitados</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.requirements.sound && (
                    <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded">
                      Som
                    </span>
                  )}
                  {formData.requirements.lighting && (
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded">
                      Luz
                    </span>
                  )}
                  {formData.requirements.led && (
                    <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded">
                      LED
                    </span>
                  )}
                  {formData.requirements.grid && (
                    <span className="bg-gray-500/20 text-gray-400 text-xs px-2 py-1 rounded">
                      Grid
                    </span>
                  )}
                  {!Object.values(formData.requirements).some(
                    (v) => typeof v === 'boolean' && v,
                  ) && (
                    <span className="text-sm text-muted-foreground">
                      Nenhum equipamento selecionado
                    </span>
                  )}
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

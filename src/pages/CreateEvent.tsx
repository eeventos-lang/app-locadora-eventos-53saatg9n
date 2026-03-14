import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Instagram } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useApp } from '@/store/AppContext'
import { EventFormData, EventConfigs } from '@/types/event'
import { Step1Basic } from '@/components/create-event/Step1Basic'
import { Step2Services } from '@/components/create-event/Step2Services'
import { Step3Review } from '@/components/create-event/Step3Review'
import { useEventTotals } from '@/hooks/use-event-totals'
import { BackButton } from '@/components/BackButton'

const steps = ['Básico', 'Serviços', 'Revisão']

const CreateEvent = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { addDemand } = useApp()
  const [currentStep, setCurrentStep] = useState(1)

  const [formData, setFormData] = useState<EventFormData>({
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

  const [configs, setConfigs] = useState<EventConfigs>({
    buffetTier: 'prime',
    buffetGuests: 100,
    cocktailsGuests: 100,
    drinksGuests: 100,
    securityCount: 2,
  })

  const updateForm = (field: string, value: any) => setFormData((p) => ({ ...p, [field]: value }))

  const totals = useEventTotals(formData, configs)

  const handleNext = () => currentStep < 3 && setCurrentStep((p) => p + 1)
  const handleBack = () => (currentStep > 1 ? setCurrentStep((p) => p - 1) : navigate(-1))

  const handleSubmit = () => {
    addDemand({ ...formData, title: formData.title || 'Novo Evento', budget: totals.total })
    toast({ title: 'Sucesso!', description: 'Sua demanda foi publicada para os fornecedores.' })
    navigate('/demandas')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col animate-slide-up relative z-50">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-background/95 backdrop-blur sticky top-0 min-h-[72px] z-10">
        <div className="flex items-center">
          <BackButton onClick={handleBack} className="-ml-3" />
          <h1 className="font-semibold text-lg tracking-tight ml-2">Nova Demanda</h1>
        </div>
        <a
          href="https://www.instagram.com/lhshoweventos?igsh=MWp6amc0bDUyZjU4cA=="
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-pink-600 transition-colors p-2 rounded-full hover:bg-pink-500/10 flex items-center justify-center"
          aria-label="Instagram @lhshoweventos"
          title="Siga-nos no Instagram"
        >
          <Instagram className="h-5 w-5" />
        </a>
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
          <Step1Basic formData={formData} updateForm={updateForm} setConfigs={setConfigs} />
        )}
        {currentStep === 2 && (
          <Step2Services
            formData={formData}
            setFormData={setFormData}
            configs={configs}
            setConfigs={setConfigs}
          />
        )}
        {currentStep === 3 && <Step3Review formData={formData} totals={totals} />}
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

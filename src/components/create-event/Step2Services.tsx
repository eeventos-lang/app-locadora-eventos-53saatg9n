import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SERVICES } from '@/lib/services'
import { EventFormData, EventConfigs } from '@/types/event'
import { TechRequirement } from '@/store/AppContext'

type Props = {
  formData: EventFormData
  setFormData: React.Dispatch<React.SetStateAction<EventFormData>>
  configs: EventConfigs
  setConfigs: React.Dispatch<React.SetStateAction<EventConfigs>>
}

export const Step2Services = ({ formData, setFormData, configs, setConfigs }: Props) => {
  const updateReq = (field: string, value: boolean) =>
    setFormData((p) => ({ ...p, requirements: { ...p.requirements, [field]: value } }))

  const handleNumChange =
    (field: keyof EventConfigs) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value === '') {
        setConfigs((p) => ({ ...p, [field]: 0 }))
        return
      }
      const val = parseInt(e.target.value)
      if (!isNaN(val) && val >= 0) {
        setConfigs((p) => ({ ...p, [field]: val }))
      }
    }

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-lg font-semibold text-foreground">O que você precisa?</h2>
      <div className="grid grid-cols-3 gap-3">
        {SERVICES.map(({ id, label, icon: Icon }) => (
          <div
            key={id}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer ${
              formData.requirements[id as keyof TechRequirement]
                ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(255,255,255,0.1)] text-foreground'
                : 'bg-card border-border text-muted-foreground hover:bg-card/80'
            }`}
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
          <h3 className="text-sm font-semibold text-foreground">Configurações de Serviços</h3>

          {formData.requirements.buffet && (
            <div className="space-y-4 p-4 border border-border rounded-xl bg-card">
              <h4 className="font-medium text-foreground">Opções de Buffet</h4>
              <div className="space-y-2 pt-2">
                <Label>Quantidade de Pessoas (R$ 150/pessoa)</Label>
                <Input
                  type="number"
                  min="1"
                  value={configs.buffetGuests || ''}
                  onChange={handleNumChange('buffetGuests')}
                  className="bg-background border-border"
                />
              </div>
            </div>
          )}

          {formData.requirements.cocktails && (
            <div className="space-y-2">
              <Label>Pessoas no Bar de Drinks (R$ 70/pessoa)</Label>
              <Input
                type="number"
                min="1"
                value={configs.cocktailsGuests || ''}
                onChange={handleNumChange('cocktailsGuests')}
                className="bg-card border-border"
              />
            </div>
          )}
          {formData.requirements.drinks && (
            <div className="space-y-2">
              <Label>Pessoas para Bebidas (R$ 50/pessoa)</Label>
              <Input
                type="number"
                min="1"
                value={configs.drinksGuests || ''}
                onChange={handleNumChange('drinksGuests')}
                className="bg-card border-border"
              />
            </div>
          )}
          {formData.requirements.security && (
            <div className="space-y-2">
              <Label>Quantidade de Seguranças (R$ 150/cada)</Label>
              <Input
                type="number"
                min="1"
                value={configs.securityCount || ''}
                onChange={handleNumChange('securityCount')}
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
  )
}

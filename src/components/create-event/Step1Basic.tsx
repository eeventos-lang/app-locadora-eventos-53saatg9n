import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EventFormData, EventConfigs } from '@/types/event'

type Props = {
  formData: EventFormData
  updateForm: (field: string, value: any) => void
  setConfigs: React.Dispatch<React.SetStateAction<EventConfigs>>
}

export const Step1Basic = ({ formData, updateForm, setConfigs }: Props) => {
  return (
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
        <Label>Número de Convidados (Estimativa Geral)</Label>
        <Input
          type="number"
          min="1"
          value={formData.guests || ''}
          onChange={(e) => {
            if (e.target.value === '') {
              updateForm('guests', 0)
              return
            }
            const val = parseInt(e.target.value)
            if (!isNaN(val) && val >= 0) {
              updateForm('guests', val)
              setConfigs((p) => ({
                ...p,
                buffetGuests: p.buffetGuests === formData.guests ? val : p.buffetGuests,
                cocktailsGuests: p.cocktailsGuests === formData.guests ? val : p.cocktailsGuests,
                drinksGuests: p.drinksGuests === formData.guests ? val : p.drinksGuests,
              }))
            }
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
          className="bg-card border-border block w-full text-foreground"
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
  )
}

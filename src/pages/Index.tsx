import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowRight, CalendarDays, Users, Star, ShieldCheck } from 'lucide-react'
import logoImg from '@/assets/e-eventos-novo-62817.png'

export default function Index() {
  return (
    <div className="flex flex-col gap-16 pb-12">
      <section className="relative overflow-hidden rounded-3xl bg-primary/5 px-6 py-20 text-center sm:px-12 sm:py-32 mt-6 mx-4 sm:mx-8 shadow-sm border border-primary/10">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
          <img
            src={logoImg}
            alt="e-eventos"
            className="h-28 w-28 sm:h-36 sm:w-36 rounded-[2rem] object-contain shadow-xl border border-white/20 animate-fade-in-down"
          />
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground animate-fade-in-up">
            O seu parceiro ideal em{' '}
            <span className="text-primary block mt-2">locações de eventos</span>
          </h1>
          <p
            className="text-lg text-muted-foreground sm:text-xl max-w-2xl animate-fade-in-up"
            style={{ animationDelay: '100ms' }}
          >
            O <strong>e-eventos</strong> é a plataforma definitiva para encontrar e alugar
            equipamentos, espaços e serviços para o seu evento com segurança e praticidade.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 mt-4 animate-fade-in-up w-full sm:w-auto"
            style={{ animationDelay: '200ms' }}
          >
            <Button size="lg" asChild className="gap-2 w-full sm:w-auto text-md h-12 px-8">
              <Link to="/demands">
                Explorar Demandas <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="w-full sm:w-auto text-md h-12 px-8"
            >
              <Link to="/create-event">Criar Meu Evento</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Por que escolher o e-eventos?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tudo que você precisa para fazer o seu evento acontecer, em um só lugar e com
            fornecedores verificados.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: ShieldCheck,
              title: 'Segurança Garantida',
              description:
                'Todos os fornecedores são verificados para garantir a sua tranquilidade.',
            },
            {
              icon: Users,
              title: 'Variedade de Opções',
              description: 'Centenas de parceiros cadastrados com os melhores equipamentos.',
            },
            {
              icon: CalendarDays,
              title: 'Praticidade',
              description: 'Gerencie suas locações e datas de forma simples e intuitiva.',
            },
            {
              icon: Star,
              title: 'Avaliações Reais',
              description: 'Veja o que outros clientes dizem sobre os fornecedores.',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

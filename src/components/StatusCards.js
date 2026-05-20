import Component from '../lib/Component.js'
import { getMetrics } from '../data/tickets.js'

export default class StatusCards extends Component {
  constructor(containerId, props) {
    super(containerId, props)
    this.state = { loading: false }
  }

  template() {
    if (this.state.loading) return this._skeleton()

    const metrics = getMetrics(this.props.tickets)

    const cards = [
      {
        label: 'Chamados Abertos',
        value: metrics.abertos,
        subtitle: `+${metrics.abertosHoje} hoje`,
        subtitleClass: 'text-error',
        icon: 'inbox',
        iconClass: 'text-error bg-error-container',
        barClass: 'bg-error',
      },
      {
        label: 'Em Atendimento',
        value: metrics.emAtendimento,
        subtitle: 'Na meta',
        subtitleClass: 'text-on-surface-variant',
        icon: 'engineering',
        iconClass: 'text-primary bg-primary-fixed',
        barClass: 'bg-primary-fixed-dim',
      },
      {
        label: 'Aguardando Peças',
        value: `0${metrics.aguardandoPecas}`.slice(-2),
        subtitle: 'Pausados',
        subtitleClass: 'text-tertiary-container',
        icon: 'inventory_2',
        iconClass: 'text-tertiary-container bg-tertiary-fixed',
        barClass: 'bg-tertiary-fixed-dim',
      },
      {
        label: 'Concluídos Hoje',
        value: metrics.concluidosHoje,
        subtitle: metrics.variacaoConcluidos,
        subtitleClass: 'text-secondary',
        icon: 'task_alt',
        iconClass: 'text-on-secondary-container bg-secondary-container',
        barClass: 'bg-secondary',
      },
    ]

    return `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
        ${cards.map(this._card).join('')}
      </div>
    `
  }

  _card(card) {
    return `
      <div class="bg-surface rounded-xl p-lg border border-outline-variant shadow-sm flex flex-col relative overflow-hidden min-h-[100px]">
        <div class="absolute top-0 left-0 w-1 h-full ${card.barClass}"></div>
        <div class="flex justify-between items-start mb-sm">
          <span class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">${card.label}</span>
          <span class="material-symbols-outlined ${card.iconClass} p-xs rounded-md">${card.icon}</span>
        </div>
        <div class="flex items-end gap-sm mt-auto">
          <span class="font-display text-display text-on-surface leading-none">${card.value}</span>
          <span class="font-body-md text-body-md ${card.subtitleClass} flex items-center mb-1">${card.subtitle}</span>
        </div>
      </div>
    `
  }

  _skeleton() {
    return `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
        ${[1, 2, 3, 4]
          .map(
            () => `
          <div class="bg-surface rounded-xl p-lg border border-outline-variant shadow-sm flex flex-col gap-md animate-pulse min-h-[100px]">
            <div class="flex justify-between">
              <div class="h-3 w-24 bg-surface-container-high rounded"></div>
              <div class="h-8 w-8 bg-surface-container-high rounded"></div>
            </div>
            <div class="h-10 w-16 bg-surface-container-high rounded mt-auto"></div>
          </div>
        `
          )
          .join('')}
      </div>
    `
  }
}

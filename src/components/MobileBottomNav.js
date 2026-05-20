import Component from '../lib/Component.js'
import { navigateTo } from '../lib/router.js'

const ITEMS = [
  { icon: 'dashboard', label: 'Painel', route: 'dashboard' },
  { icon: 'assignment_turned_in', label: 'Chamados', route: 'meus-chamados' },
  { icon: 'assessment', label: 'Relatórios', route: 'relatorios' },
  { icon: 'settings', label: 'Config', route: 'configuracoes' },
  { icon: 'support_agent', label: 'Suporte', route: 'suporte' },
]

export default class MobileBottomNav extends Component {
  constructor(containerId, props) {
    super(containerId, props)
    this.state = { activeRoute: 'dashboard' }
  }

  setActiveRoute(route) {
    this.state.activeRoute = route
    this.render()
    this.afterRender()
  }

  template() {
    const active = this.state.activeRoute
    return `
      <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-outline-variant z-50">
        <div class="flex items-center justify-around h-16 px-sm">
          ${ITEMS.map(
            (item) => `
            <button
              class="bottom-nav-btn flex flex-col items-center justify-center gap-xs px-sm py-xs rounded-lg cursor-pointer transition-colors active:opacity-50 ${
                item.route === active ? 'text-primary' : 'text-on-surface-variant opacity-70'
              }"
              data-route="${item.route}"
              aria-label="${item.label}"
            >
              <span class="material-symbols-outlined text-xl">${item.icon}</span>
              <span class="font-label-md text-[10px]">${item.label}</span>
            </button>
          `
          ).join('')}
        </div>
      </nav>
    `
  }

  afterRender() {
    this.container.querySelectorAll('.bottom-nav-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        navigateTo(btn.dataset.route)
      })
    })
  }
}

import Component from '../lib/Component.js'
import { navigateTo } from '../lib/router.js'
import { getSystemConfig, CURRENT_USER, logout, ROLES } from '../data/tickets.js'

const NAV_ITEM_BASE = 'sidebar-nav-btn flex items-center gap-md px-lg py-sm cursor-pointer rounded-lg transition-all w-full text-left'
const NAV_ACTIVE = 'text-primary font-bold border-l-4 border-primary bg-secondary-container/50'
const NAV_INACTIVE = 'text-on-secondary-container opacity-70 hover:bg-secondary-container/30'

const ALL_ITEMS = [
  { icon: 'dashboard', label: 'Painel Geral', route: 'dashboard', roles: ['admin', 'tecnico'] },
  { icon: 'assignment_turned_in', label: 'Meus Chamados', route: 'meus-chamados', roles: ['admin', 'tecnico', 'cliente'] },
  { icon: 'assessment', label: 'Relatórios', route: 'relatorios', roles: ['admin'] },
  { icon: 'settings', label: 'Configurações', route: 'configuracoes', roles: ['admin', 'tecnico', 'cliente'] },
]

function getNavItems() {
  const role = CURRENT_USER.role || 'cliente'
  return ALL_ITEMS.filter(item => item.roles.includes(role))
}

export default class Sidebar extends Component {
  constructor(containerId, props) {
    super(containerId, props)
    this.state = { activeRoute: 'dashboard' }
  }

  setActiveRoute(route) {
    this.state.activeRoute = route
    this._updateActiveItem()
  }

  _updateActiveItem() {
    const active = this.state.activeRoute
    this.container.querySelectorAll('.sidebar-nav-btn').forEach((btn) => {
      const isActive = btn.dataset.route === active
      btn.className = `${NAV_ITEM_BASE} ${isActive ? NAV_ACTIVE : NAV_INACTIVE}`
    })
  }

  template() {
    const active = this.state.activeRoute
    const config = getSystemConfig()
    const navItems = getNavItems()
    const logoHtml = config.logo
      ? `<img src="${config.logo}" class="h-8 w-auto" alt="Logo" />`
      : `<span aria-label="Logotipo do Sistema" class="material-symbols-outlined fill text-primary text-3xl">settings_suggest</span>`
    return `
      <nav
        id="sidebar-nav"
        class="h-screen w-64 fixed left-0 top-0 flex flex-col border-r border-outline-variant bg-surface-container-low z-50 transition-transform duration-300 -translate-x-full md:translate-x-0"
      >
        <div class="px-lg py-xl flex flex-col gap-xs">
          <div class="flex items-center justify-between gap-sm mb-lg">
            <div class="flex flex-col items-center gap-sm mb-lg">
              <div id="sidebar-logo-cell" class="flex justify-center">${logoHtml}</div>
              <div class="text-center">
                <h1 id="sidebar-title" class="font-display text-title-lg font-black text-primary">${config.title}</h1>
                <p id="sidebar-subtitle" class="font-body-md text-body-md text-on-surface-variant text-xs">${config.subtitle}</p>
              </div>
            </div>
            <button
              id="sidebar-close"
              class="md:hidden text-on-surface-variant p-xs rounded-full hover:bg-surface-container-high cursor-pointer"
              aria-label="Fechar menu"
            >
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <button class="bg-primary text-on-primary rounded-lg py-sm px-md flex items-center justify-center gap-sm font-label-md text-label-md mb-xl hover:opacity-90 transition-opacity w-full cursor-pointer">
            <span class="material-symbols-outlined text-sm">add</span>
            Novo Chamado
          </button>
        </div>

        <ul class="flex flex-col flex-1 px-sm gap-xs">
          ${navItems.map((item) => this._navItem(item, active)).join('')}
        </ul>

        <div class="px-sm pt-sm pb-md border-t border-outline-variant mt-auto flex flex-col gap-xs">
          <div class="px-lg py-xs flex flex-col">
            <span class="font-label-md text-[11px] text-on-surface-variant">${CURRENT_USER.cargo}</span>
            <div class="flex items-center gap-sm mt-xs">
              <div class="w-9 h-9 rounded-full bg-primary-container flex-shrink-0 flex items-center justify-center overflow-hidden">
                ${CURRENT_USER.foto
                  ? `<img src="${CURRENT_USER.foto}" class="w-full h-full object-cover" />`
                  : `<span class="text-on-primary-container font-bold text-xs">${CURRENT_USER.nome.split(' ').map(n => n[0]).join('')}</span>`
                }
              </div>
              <span class="font-body-md text-body-md text-on-surface font-medium">${CURRENT_USER.nome}</span>
            </div>
          </div>
          <button
            class="sidebar-bottom-btn flex items-center gap-md px-lg py-sm cursor-pointer rounded-lg transition-all text-error opacity-80 hover:bg-error-container/50 w-full text-left"
            id="btn-logout"
          >
            <span class="material-symbols-outlined">logout</span>
            <span class="font-label-md text-label-md">Sair</span>
          </button>
        </div>
      </nav>
    `
  }

  _navItem(item, activeRoute) {
    const isActive = item.route === activeRoute
    return `
      <li>
        <button
          class="${NAV_ITEM_BASE} ${isActive ? NAV_ACTIVE : NAV_INACTIVE}"
          data-route="${item.route}"
        >
          <span class="material-symbols-outlined">${item.icon}</span>
          <span class="font-label-md text-label-md">${item.label}</span>
        </button>
      </li>
    `
  }

  afterRender() {
    const closeBtn = document.getElementById('sidebar-close')
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this._closeDrawer())
    }

    this.container.querySelectorAll('.sidebar-nav-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const route = btn.dataset.route
        navigateTo(route)
        this._closeDrawer()
      })
    })

    const logoutBtn = document.getElementById('btn-logout')
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        logout()
        window.location.reload()
      })
    }
  }

  _closeDrawer() {
    const nav = document.getElementById('sidebar-nav')
    const overlay = document.getElementById('drawer-overlay')
    if (nav) nav.classList.remove('drawer-animate')
    if (nav) nav.classList.add('-translate-x-full')
    if (overlay) overlay.classList.add('hidden')
    if (overlay) overlay.classList.remove('drawer-overlay-visible')
    document.body.classList.remove('overflow-hidden')
  }
}

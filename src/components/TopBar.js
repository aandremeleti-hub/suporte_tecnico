import Component from '../lib/Component.js'

export default class TopBar extends Component {
  constructor(containerId, props) {
    super(containerId, props)
    this._searchTimeout = null
  }

  template() {
    return `
      <header class="bg-surface border-b border-outline-variant shadow-sm flex justify-between items-center w-full px-lg py-base h-16">
        <div class="flex items-center gap-md w-full max-w-md">
          <button
            id="hamburger-btn"
            class="md:hidden text-on-surface-variant p-xs rounded-full hover:bg-surface-container-high cursor-pointer"
            aria-label="Abrir menu"
          >
            <span class="material-symbols-outlined">menu</span>
          </button>
          <h2 class="font-display text-title-lg text-primary hidden md:block mr-md font-bold">Suporte Técnico</h2>
          <div class="relative w-full max-w-xs flex-1">
            <span class="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">search</span>
            <input
              id="search-input"
              class="w-full bg-surface-container-low border border-outline-variant rounded-full py-xs pl-xl pr-sm font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="Buscar chamados, IDs, termos..."
              type="text"
              autocomplete="off"
            />
          </div>
        </div>
        <div class="flex items-center gap-md">
          <button class="text-on-surface-variant hover:bg-surface-container-high transition-colors p-xs rounded-full cursor-pointer active:opacity-80 relative" aria-label="Notificações">
            <span class="material-symbols-outlined">notifications</span>
            <span class="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
          </button>
          <button class="text-on-surface-variant hover:bg-surface-container-high transition-colors p-xs rounded-full cursor-pointer active:opacity-80 hidden md:block" aria-label="Ajuda">
            <span class="material-symbols-outlined">help_outline</span>
          </button>
          <div class="h-8 border-l border-outline-variant mx-xs hidden md:block"></div>
          <button class="hidden md:flex items-center gap-sm cursor-pointer hover:opacity-80 transition-opacity" aria-label="Perfil">
            <div class="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant flex-shrink-0">
              <div class="w-full h-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-sm">
                TC
              </div>
            </div>
          </button>
        </div>
      </header>
    `
  }

  afterRender() {
    const hamburger = document.getElementById('hamburger-btn')
    if (hamburger) {
      hamburger.addEventListener('click', () => this._openDrawer())
    }

    const searchInput = document.getElementById('search-input')
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        clearTimeout(this._searchTimeout)
        this._searchTimeout = setTimeout(() => {
          if (this.props.onSearch) {
            this.props.onSearch(e.target.value)
          }
        }, 250)
      })
    }
  }

  _openDrawer() {
    const nav = document.getElementById('sidebar-nav')
    const overlay = document.getElementById('drawer-overlay')
    if (nav) {
      nav.classList.remove('-translate-x-full')
      nav.classList.add('drawer-animate')
    }
    if (overlay) {
      overlay.classList.remove('hidden')
      overlay.classList.add('drawer-overlay-visible')
      overlay.addEventListener('click', () => this._closeDrawer(), { once: true })
    }
    document.body.classList.add('overflow-hidden')
  }

  _closeDrawer() {
    const nav = document.getElementById('sidebar-nav')
    const overlay = document.getElementById('drawer-overlay')
    if (nav) {
      nav.classList.add('-translate-x-full')
      nav.classList.remove('drawer-animate')
    }
    if (overlay) {
      overlay.classList.add('hidden')
      overlay.classList.remove('drawer-overlay-visible')
    }
    document.body.classList.remove('overflow-hidden')
  }
}

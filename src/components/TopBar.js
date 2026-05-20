import Component from '../lib/Component.js'
import { CURRENT_USER, logout } from '../data/tickets.js'

export default class TopBar extends Component {
  constructor(containerId, props) {
    super(containerId, props)
    this._dropdownOpen = false
    this._boundClose = null
  }

  template() {
    const initials = CURRENT_USER.nome
      ? CURRENT_USER.nome.split(' ').map(n => n[0]).join('')
      : '?'
    const foto = CURRENT_USER.foto

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
          <div class="relative w-full max-w-xs flex-1 flex items-center gap-xs">
            <div class="relative flex-1">
              <input
                id="search-input"
                class="w-full bg-surface-container-low border border-outline-variant rounded-full py-xs pl-sm pr-xl font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="Buscar chamados por título ou usuário..."
                type="text"
                autocomplete="off"
              />
              <button
                id="search-btn"
                class="absolute right-xs top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary p-xs rounded-full hover:bg-surface-container-high cursor-pointer transition-colors"
                aria-label="Buscar"
              >
                <span class="material-symbols-outlined text-sm">search</span>
              </button>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-md relative" id="profile-area">
          <button class="text-on-surface-variant hover:bg-surface-container-high transition-colors p-xs rounded-full cursor-pointer active:opacity-80 relative" aria-label="Notificações">
            <span class="material-symbols-outlined">notifications</span>
            <span class="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
          </button>
          <div class="h-8 border-l border-outline-variant mx-xs hidden md:block"></div>
          <button
            id="profile-btn"
            class="flex items-center gap-sm cursor-pointer hover:opacity-80 transition-opacity group"
            aria-label="Perfil"
          >
            <div class="w-8 h-8 rounded-full overflow-hidden border border-outline-variant flex-shrink-0">
              ${foto
                ? `<img src="${foto}" class="w-full h-full object-cover" />`
                : `<div class="w-full h-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-sm">${initials}</div>`
              }
            </div>
            <span class="hidden md:block font-label-md text-label-md text-on-surface max-w-[120px] truncate">${CURRENT_USER.nome}</span>
          </button>

          <div id="profile-dropdown" class="hidden absolute top-full right-0 mt-xs w-64 bg-surface border border-outline-variant rounded-xl shadow-xl z-50 overflow-hidden">
            <div class="p-lg flex items-center gap-md border-b border-outline-variant">
              <div class="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                ${foto
                  ? `<img src="${foto}" class="w-full h-full object-cover" />`
                  : `<div class="w-full h-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-lg">${initials}</div>`
                }
              </div>
              <div class="min-w-0">
                <p class="font-label-md text-label-md text-on-surface font-semibold truncate">${CURRENT_USER.nome}</p>
                <p class="font-body-md text-[12px] text-on-surface-variant truncate">${CURRENT_USER.email}</p>
              </div>
            </div>
            <button id="btn-sair-topbar" class="w-full flex items-center gap-sm px-lg py-md hover:bg-surface-container-low transition-colors cursor-pointer text-left">
              <span class="material-symbols-outlined text-on-surface-variant">logout</span>
              <span class="font-label-md text-label-md text-on-surface">Sair</span>
            </button>
          </div>
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
    const searchBtn = document.getElementById('search-btn')
    const triggerSearch = () => {
      if (searchInput && this.props.onSearch) {
        this.props.onSearch(searchInput.value)
      }
    }
    if (searchInput) {
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          triggerSearch()
        }
      })
    }
    if (searchBtn) {
      searchBtn.addEventListener('click', triggerSearch)
    }

    const profileBtn = document.getElementById('profile-btn')
    const dropdown = document.getElementById('profile-dropdown')
    if (profileBtn && dropdown) {
      profileBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        this._toggleDropdown()
      })
    }

    const sairBtn = document.getElementById('btn-sair-topbar')
    if (sairBtn) {
      sairBtn.addEventListener('click', () => {
        this._closeDropdown()
        logout()
        window.location.reload()
      })
    }
  }

  _toggleDropdown() {
    const dropdown = document.getElementById('profile-dropdown')
    if (!dropdown) return
    this._dropdownOpen = !this._dropdownOpen
    dropdown.classList.toggle('hidden', !this._dropdownOpen)

    if (this._dropdownOpen) {
      this._boundClose = (e) => {
        const profileArea = document.getElementById('profile-area')
        if (profileArea && !profileArea.contains(e.target)) {
          this._closeDropdown()
        }
      }
      setTimeout(() => document.addEventListener('click', this._boundClose), 0)
    }
  }

  _closeDropdown() {
    const dropdown = document.getElementById('profile-dropdown')
    if (dropdown) dropdown.classList.add('hidden')
    this._dropdownOpen = false
    if (this._boundClose) {
      document.removeEventListener('click', this._boundClose)
      this._boundClose = null
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

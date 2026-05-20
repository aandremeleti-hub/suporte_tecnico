import './style.css'
import {
  CURRENT_USER,
  fetchMetadata,
  fetchTickets,
  fetchAllTickets,
  createTicket,
  updateTicket,
  assignTicket,
  getMetrics,
  getCategories,
  getStatuses,
  isLoggedIn,
  getCurrentUser,
  seedUsers,
  logout,
} from './data/tickets.js'
import { initRouter, registerRoute, navigateTo } from './lib/router.js'
import Sidebar from './components/Sidebar.js'
import TopBar from './components/TopBar.js'
import MobileBottomNav from './components/MobileBottomNav.js'
import StatusCards from './components/StatusCards.js'
import FilterChips from './components/FilterChips.js'
import TicketTable from './components/TicketTable.js'
import MeusChamados from './pages/MeusChamados.js'
import Relatorios from './pages/Relatorios.js'
import Configuracoes from './pages/Configuracoes.js'
import Login from './pages/Login.js'
import { supabase } from './lib/supabase.js'

const PER_PAGE = 5
const MY_PAGE = 5

let currentSearch = ''
let currentCategory = 'todos'
let currentPage = 1

let myStatusFilter = 'todos'
let myPage = 1
let mySearch = ''

const sidebar = new Sidebar('sidebar')
const topBar = new TopBar('topbar', {
  onSearch: (term) => {
    const route = window.location.hash.replace('#', '') || 'dashboard'
    if (route === 'meus-chamados') {
      mySearch = term
      myPage = 1
      renderMeusChamados()
    } else {
      currentSearch = term
      currentPage = 1
      renderDashboard()
    }
  },
})
const mobileNav = new MobileBottomNav('mobile-bottom-nav')
const statusCards = new StatusCards('status-cards', { tickets: [] })
const filterChips = new FilterChips('filters', {
  activeCategory: currentCategory,
  onFilter: (category) => {
    currentCategory = category
    currentPage = 1
    renderDashboard()
  },
})
const ticketTable = new TicketTable('ticket-table', {
  pagination: null,
  onPageChange: (page) => {
    if (page < 1) return
    currentPage = page
    renderDashboard()
  },
})
const meusChamados = new MeusChamados('page-meus-chamados', {
  pagination: null,
  onStatusFilter: (status) => {
    myStatusFilter = status
    myPage = 1
    renderMeusChamados()
  },
  onPageChange: (page) => {
    if (page < 1) return
    myPage = page
    renderMeusChamados()
  },
})
const relatorios = new Relatorios('page-relatorios')
const configuracoes = new Configuracoes('page-configuracoes')
const loginPage = new Login('page-login', {
  onLogin: () => {
    document.getElementById('page-login').classList.add('hidden')
    document.getElementById('app-container').classList.remove('hidden')
    startApp()
  },
})

function canAccess(route) {
  const role = CURRENT_USER.role
  if (role === 'admin') return true
  if (role === 'tecnico') return route !== 'relatorios'
  if (role === 'cliente') return route === 'meus-chamados' || route === 'configuracoes'
  return false
}

async function renderDashboard() {
  document.getElementById('page-dashboard').classList.remove('hidden')
  document.getElementById('page-meus-chamados').classList.add('hidden')
  document.getElementById('page-relatorios').classList.add('hidden')
  document.getElementById('page-configuracoes').classList.add('hidden')

  const data = await fetchTickets({
    search: currentSearch,
    category: currentCategory,
    page: currentPage,
    perPage: PER_PAGE
  })

  const allTickets = await fetchAllTickets()

  statusCards.props.tickets = allTickets
  statusCards.render()

  ticketTable.props.pagination = data
  ticketTable.render()
  ticketTable.afterRender()

  filterChips.props.activeCategory = currentCategory
  filterChips.render()
  filterChips.afterRender()

  sidebar.setActiveRoute('dashboard')
  mobileNav.setActiveRoute('dashboard')
}

async function renderMeusChamados() {
  document.getElementById('page-dashboard').classList.add('hidden')
  document.getElementById('page-relatorios').classList.add('hidden')
  document.getElementById('page-configuracoes').classList.add('hidden')
  document.getElementById('page-meus-chamados').classList.remove('hidden')

  const data = await fetchTickets({
    search: mySearch,
    status: myStatusFilter,
    assignee: CURRENT_USER.id,
    page: myPage,
    perPage: MY_PAGE
  })

  meusChamados.props.pagination = data
  meusChamados.state.statusFilter = myStatusFilter
  meusChamados.render()
  meusChamados.afterRender()

  sidebar.setActiveRoute('meus-chamados')
  mobileNav.setActiveRoute('meus-chamados')
}

async function renderRelatorios() {
  document.getElementById('page-dashboard').classList.add('hidden')
  document.getElementById('page-meus-chamados').classList.add('hidden')
  document.getElementById('page-configuracoes').classList.add('hidden')
  document.getElementById('page-relatorios').classList.remove('hidden')

  const allTickets = await fetchAllTickets()
  relatorios.props.tickets = allTickets
  relatorios.render()

  sidebar.setActiveRoute('relatorios')
  mobileNav.setActiveRoute('relatorios')
}

function renderConfiguracoes() {
  document.getElementById('page-dashboard').classList.add('hidden')
  document.getElementById('page-meus-chamados').classList.add('hidden')
  document.getElementById('page-relatorios').classList.add('hidden')
  document.getElementById('page-configuracoes').classList.remove('hidden')

  configuracoes.render()
  configuracoes.afterRender()

  sidebar.setActiveRoute('configuracoes')
  mobileNav.setActiveRoute('configuracoes')
}

function onRouteChange(route) {
  if (!canAccess(route)) {
    const fallback = CURRENT_USER.role === 'cliente' ? 'meus-chamados' : 'dashboard'
    navigateTo(fallback)
    return
  }
  if (route === 'meus-chamados') {
    renderMeusChamados()
  } else if (route === 'relatorios') {
    renderRelatorios()
  } else if (route === 'configuracoes') {
    renderConfiguracoes()
  } else {
    renderDashboard()
  }
}

registerRoute('dashboard', {})
registerRoute('meus-chamados', {})
registerRoute('relatorios', {})
registerRoute('configuracoes', {})

function openNovoChamadoModal() {
  const categories = getCategories()
  const modalHtml = `
    <div id="novo-chamado-modal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-md">
      <div class="bg-surface border border-outline-variant rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in">
        <div class="px-lg py-md border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
          <h3 class="font-display text-title-lg font-bold text-primary">Criar Novo Chamado</h3>
          <button id="close-modal-btn" class="text-on-surface-variant hover:bg-surface-container-high p-xs rounded-full cursor-pointer">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <form id="novo-chamado-form" class="p-lg flex flex-col gap-md">
          <div class="flex flex-col gap-xs">
            <label for="modal-subject" class="font-label-md text-label-md text-on-surface-variant">Assunto</label>
            <input type="text" id="modal-subject" required class="w-full bg-surface-container-low border border-outline-variant rounded-lg py-sm px-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="Descrição rápida do problema...">
          </div>
          <div class="grid grid-cols-2 gap-md">
            <div class="flex flex-col gap-xs">
              <label for="modal-category" class="font-label-md text-label-md text-on-surface-variant">Categoria</label>
              <select id="modal-category" class="w-full bg-surface-container-low border border-outline-variant rounded-lg py-sm px-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                ${categories.map(c => `<option value="${c.id}">${c.label}</option>`).join('')}
              </select>
            </div>
            <div class="flex flex-col gap-xs">
              <label for="modal-priority" class="font-label-md text-label-md text-on-surface-variant">Prioridade</label>
              <select id="modal-priority" class="w-full bg-surface-container-low border border-outline-variant rounded-lg py-sm px-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                <option value="Baixa">Baixa</option>
                <option value="Média" selected>Média</option>
                <option value="Alta">Alta</option>
                <option value="Crítica">Crítica</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end gap-md mt-lg border-t border-outline-variant pt-md">
            <button type="button" id="cancel-modal-btn" class="px-lg py-sm border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container-low font-label-md text-label-md cursor-pointer">Cancelar</button>
            <button type="submit" class="px-lg py-sm bg-primary text-on-primary rounded-lg hover:opacity-90 font-label-md text-label-md cursor-pointer">Criar Chamado</button>
          </div>
        </form>
      </div>
    </div>
  `
  document.body.insertAdjacentHTML('beforeend', modalHtml)

  const modal = document.getElementById('novo-chamado-modal')
  const form = document.getElementById('novo-chamado-form')
  const closeBtn = document.getElementById('close-modal-btn')
  const cancelBtn = document.getElementById('cancel-modal-btn')

  const closeModal = () => modal.remove()

  closeBtn.addEventListener('click', closeModal)
  cancelBtn.addEventListener('click', closeModal)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal()
  })

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const subject = document.getElementById('modal-subject').value
    const category = document.getElementById('modal-category').value
    const priority = document.getElementById('modal-priority').value

    const { error } = await createTicket({
      subject,
      category,
      priority,
      status: 'Pendente',
      assignee: CURRENT_USER.id
    })

    if (error) {
      alert('Erro ao criar chamado: ' + error.message)
    } else {
      closeModal()
      onRouteChange(window.location.hash.replace('#', '') || 'dashboard')
    }
  })
}

async function openAtribuirModal(ticketId) {
  const { data: tecnicos } = await supabase.from('tecnicos').select('*')
  if (!tecnicos) return

  const modalHtml = `
    <div id="atribuir-modal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-md">
      <div class="bg-surface border border-outline-variant rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-fade-in">
        <div class="px-lg py-md border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
          <h3 class="font-display text-title-lg font-bold text-primary">Atribuir Técnico</h3>
          <button id="close-atribuir-btn" class="text-on-surface-variant hover:bg-surface-container-high p-xs rounded-full cursor-pointer">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <form id="atribuir-form" class="p-lg flex flex-col gap-md">
          <div class="flex flex-col gap-xs">
            <label for="modal-assignee" class="font-label-md text-label-md text-on-surface-variant">Técnico</label>
            <select id="modal-assignee" class="w-full bg-surface-container-low border border-outline-variant rounded-lg py-sm px-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none">
              ${tecnicos.map(t => `<option value="${t.id}">${t.nome}</option>`).join('')}
            </select>
          </div>
          <div class="flex justify-end gap-md mt-lg border-t border-outline-variant pt-md">
            <button type="button" id="cancel-atribuir-btn" class="px-lg py-sm border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container-low font-label-md text-label-md cursor-pointer">Cancelar</button>
            <button type="submit" class="px-lg py-sm bg-primary text-on-primary rounded-lg hover:opacity-90 font-label-md text-label-md cursor-pointer">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  `
  document.body.insertAdjacentHTML('beforeend', modalHtml)

  const modal = document.getElementById('atribuir-modal')
  const form = document.getElementById('atribuir-form')
  const closeBtn = document.getElementById('close-atribuir-btn')
  const cancelBtn = document.getElementById('cancel-atribuir-btn')

  const closeModal = () => modal.remove()

  closeBtn.addEventListener('click', closeModal)
  cancelBtn.addEventListener('click', closeModal)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal()
  })

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const assigneeId = document.getElementById('modal-assignee').value
    const { error } = await assignTicket(ticketId, assigneeId)
    if (error) {
      alert('Erro ao atribuir chamado: ' + error.message)
    } else {
      closeModal()
      onRouteChange(window.location.hash.replace('#', '') || 'dashboard')
    }
  })
}

async function openDetalhesModal(ticketId) {
  const numericId = parseInt(String(ticketId).replace('#', ''), 10)
  const { data: tickets, error } = await supabase.from('tickets').select('*').eq('id', numericId)
  if (error || !tickets || tickets.length === 0) {
    alert('Não foi possível carregar os detalhes do chamado.')
    return
  }
  const ticket = tickets[0]

  const { data: tecnicos } = await supabase.from('tecnicos').select('*')
  const categories = getCategories()
  const statuses = getStatuses()

  const modalHtml = `
    <div id="detalhes-modal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-md">
      <div class="bg-surface border border-outline-variant rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in">
        <div class="px-lg py-md border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
          <h3 class="font-display text-title-lg font-bold text-primary">Detalhes do Chamado #${ticket.id}</h3>
          <button id="close-detalhes-btn" class="text-on-surface-variant hover:bg-surface-container-high p-xs rounded-full cursor-pointer">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <form id="detalhes-form" class="p-lg flex flex-col gap-md">
          <div class="flex flex-col gap-xs">
            <label for="modal-subject" class="font-label-md text-label-md text-on-surface-variant">Assunto</label>
            <input type="text" id="modal-subject" required value="${ticket.subject}" class="w-full bg-surface-container-low border border-outline-variant rounded-lg py-sm px-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none">
          </div>
          
          <div class="grid grid-cols-2 gap-md">
            <div class="flex flex-col gap-xs">
              <label for="modal-category" class="font-label-md text-label-md text-on-surface-variant">Categoria</label>
              <select id="modal-category" class="w-full bg-surface-container-low border border-outline-variant rounded-lg py-sm px-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                ${categories.map(c => `<option value="${c.id}" ${c.id === ticket.category ? 'selected' : ''}>${c.label}</option>`).join('')}
              </select>
            </div>
            
            <div class="flex flex-col gap-xs">
              <label for="modal-priority" class="font-label-md text-label-md text-on-surface-variant">Prioridade</label>
              <select id="modal-priority" class="w-full bg-surface-container-low border border-outline-variant rounded-lg py-sm px-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                <option value="Baixa" ${ticket.priority === 'Baixa' ? 'selected' : ''}>Baixa</option>
                <option value="Média" ${ticket.priority === 'Média' ? 'selected' : ''}>Média</option>
                <option value="Alta" ${ticket.priority === 'Alta' ? 'selected' : ''}>Alta</option>
                <option value="Crítica" ${ticket.priority === 'Crítica' ? 'selected' : ''}>Crítica</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-md">
            <div class="flex flex-col gap-xs">
              <label for="modal-status" class="font-label-md text-label-md text-on-surface-variant">Status</label>
              <select id="modal-status" class="w-full bg-surface-container-low border border-outline-variant rounded-lg py-sm px-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                ${statuses.map(s => `<option value="${s.label}" ${s.label === ticket.status ? 'selected' : ''}>${s.label}</option>`).join('')}
              </select>
            </div>
            
            <div class="flex flex-col gap-xs">
              <label for="modal-assignee" class="font-label-md text-label-md text-on-surface-variant">Técnico Atribuído</label>
              <select id="modal-assignee" class="w-full bg-surface-container-low border border-outline-variant rounded-lg py-sm px-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                ${tecnicos.map(t => `<option value="${t.id}" ${t.id === ticket.assignee ? 'selected' : ''}>${t.nome}</option>`).join('')}
              </select>
            </div>
          </div>
          
          <div class="flex justify-between items-center mt-lg border-t border-outline-variant pt-md">
            <button type="button" id="delete-ticket-btn" class="px-lg py-sm bg-error/10 hover:bg-error/20 text-error rounded-lg font-label-md text-label-md cursor-pointer">Excluir Chamado</button>
            <div class="flex gap-md">
              <button type="button" id="cancel-detalhes-btn" class="px-lg py-sm border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container-low font-label-md text-label-md cursor-pointer">Cancelar</button>
              <button type="submit" class="px-lg py-sm bg-primary text-on-primary rounded-lg hover:opacity-90 font-label-md text-label-md cursor-pointer">Salvar Alterações</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `
  document.body.insertAdjacentHTML('beforeend', modalHtml)

  const modal = document.getElementById('detalhes-modal')
  const form = document.getElementById('detalhes-form')
  const closeBtn = document.getElementById('close-detalhes-btn')
  const cancelBtn = document.getElementById('cancel-detalhes-btn')
  const deleteBtn = document.getElementById('delete-ticket-btn')

  const closeModal = () => modal.remove()

  closeBtn.addEventListener('click', closeModal)
  cancelBtn.addEventListener('click', closeModal)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal()
  })

  deleteBtn.addEventListener('click', async () => {
    if (confirm('Tem certeza que deseja excluir permanentemente este chamado?')) {
      const { error } = await supabase.from('tickets').delete().eq('id', numericId)
      if (error) {
        alert('Erro ao excluir chamado: ' + error.message)
      } else {
        closeModal()
        onRouteChange(window.location.hash.replace('#', '') || 'dashboard')
      }
    }
  })

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const subject = document.getElementById('modal-subject').value
    const category = document.getElementById('modal-category').value
    const priority = document.getElementById('modal-priority').value
    const status = document.getElementById('modal-status').value
    const assignee = document.getElementById('modal-assignee').value

    const { error } = await updateTicket(numericId, {
      subject,
      category,
      priority,
      status,
      assignee
    })

    if (error) {
      alert('Erro ao atualizar chamado: ' + error.message)
    } else {
      closeModal()
      onRouteChange(window.location.hash.replace('#', '') || 'dashboard')
    }
  })
}

document.addEventListener('click', (e) => {
  const btnNovo = e.target.closest('button')
  if (btnNovo && (btnNovo.innerText.includes('Novo Chamado') || btnNovo.querySelector('.material-symbols-outlined')?.innerText === 'add' || btnNovo.querySelector('.material-symbols-outlined')?.innerText === 'add_circle')) {
    openNovoChamadoModal()
    return
  }

  const btnAtribuir = e.target.closest('.btn-atribuir')
  if (btnAtribuir) {
    const ticketId = btnAtribuir.dataset.id
    openAtribuirModal(ticketId)
    return
  }

  const btnDetalhes = e.target.closest('.btn-detalhes')
  if (btnDetalhes) {
    const ticketId = btnDetalhes.dataset.id
    openDetalhesModal(ticketId)
    return
  }

  const btnAtualizar = e.target.closest('.btn-atualizar')
  if (btnAtualizar) {
    const ticketId = btnAtualizar.dataset.id
    openDetalhesModal(ticketId)
    return
  }
})

async function startApp() {
  try {
    await fetchMetadata()

    sidebar.mount()
    topBar.mount()
    mobileNav.mount()
    statusCards.mount()
    filterChips.mount()
    ticketTable.mount()
    meusChamados.mount()
    relatorios.mount()
    configuracoes.mount()

    initRouter(onRouteChange)
  } catch (err) {
    console.error('Falha na inicialização do aplicativo:', err)
  }
}

function showLogin() {
  document.getElementById('page-login').classList.remove('hidden')
  document.getElementById('app-container').classList.add('hidden')
  loginPage.render()
  loginPage.afterRender()
}

function initApp() {
  seedUsers()
  const user = getCurrentUser()
  if (user) {
    Object.assign(CURRENT_USER, user)
    document.getElementById('page-login').classList.add('hidden')
    document.getElementById('app-container').classList.remove('hidden')
    startApp()
  } else {
    showLogin()
  }
}

initApp()

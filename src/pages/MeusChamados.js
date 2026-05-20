import Component from '../lib/Component.js'
import { CURRENT_USER, getStatusList, getCategoryConfig, getPriorityConfig, getStatusConfig } from '../data/tickets.js'

export default class MeusChamados extends Component {
  constructor(containerId, props) {
    super(containerId, props)
    this.state = { statusFilter: 'todos' }
  }

  template() {
    const { items, start, end, total, page, totalPages } = this.props.pagination || {}
    const activeStatus = this.state.statusFilter

    return `
      <div class="flex flex-col gap-md">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
          <div>
            <h2 class="font-display text-headline-md text-on-surface">Meus Chamados</h2>
            <p class="font-body-md text-body-md text-on-surface-variant mt-xs">
              Chamados atribuídos a <strong>${CURRENT_USER.nome}</strong>
            </p>
          </div>
          <button class="bg-primary text-on-primary px-lg py-sm rounded-lg flex items-center gap-sm shadow-sm hover:shadow-md transition-all font-label-md text-label-md active:opacity-80 whitespace-nowrap cursor-pointer">
            <span class="material-symbols-outlined text-sm">add_circle</span>
            Novo Chamado
          </button>
        </div>

        <!-- Status filter tabs -->
        <div class="flex flex-wrap gap-xs items-center" id="my-status-tabs">
          ${getStatusList().map(
            (opt) => `
            <button
              class="status-tab px-sm py-xs rounded-full border font-label-md text-label-md cursor-pointer transition-colors active:opacity-80 ${
                activeStatus === opt.id
                  ? 'border-primary bg-primary text-on-primary'
                  : 'border-outline-variant bg-surface text-on-surface-variant hover:bg-surface-container-low'
              }"
              data-status="${opt.id}"
            >
              ${opt.label}
            </button>
          `
          ).join('')}
        </div>

        ${!items || items.length === 0 ? this._emptyState() : this._table(items, start, end, total, page, totalPages)}
      </div>
    `
  }

  _table(items, start, end, total, page, totalPages) {
    return `
      <div class="bg-surface border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto hidden md:block">
          <table class="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr class="bg-surface-container-lowest border-b border-outline-variant">
                <th class="py-sm px-md font-label-md text-label-md text-on-surface-variant w-24">ID/Ticket</th>
                <th class="py-sm px-md font-label-md text-label-md text-on-surface-variant">Assunto</th>
                <th class="py-sm px-md font-label-md text-label-md text-on-surface-variant w-36">Categoria</th>
                <th class="py-sm px-md font-label-md text-label-md text-on-surface-variant w-28">Prioridade</th>
                <th class="py-sm px-md font-label-md text-label-md text-on-surface-variant w-32">Status</th>
                <th class="py-sm px-md font-label-md text-label-md text-on-surface-variant w-28">Criado em</th>
                <th class="py-sm px-md font-label-md text-label-md text-on-surface-variant w-24 text-right">Ações</th>
              </tr>
            </thead>
            <tbody class="font-body-md text-body-md">
              ${items.map((t, i) => this._row(t, i)).join('')}
            </tbody>
          </table>
        </div>

        <div class="md:hidden flex flex-col gap-sm p-md">
          ${items.map((t) => this._card(t)).join('')}
        </div>

        <div class="px-md py-sm border-t border-outline-variant bg-surface-container-lowest flex items-center justify-between">
          <span class="font-body-md text-body-md text-on-surface-variant text-sm">
            Mostrando ${start}-${end} de ${total} chamados
          </span>
          <div class="flex gap-xs">
            <button
              class="my-page-btn px-sm py-xs border border-outline-variant rounded-md text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              data-page="${page - 1}"
              ${page <= 1 ? 'disabled' : ''}
            >
              Anterior
            </button>
            <button
              class="my-page-btn px-sm py-xs border border-outline-variant rounded-md text-on-surface hover:bg-surface-container-low bg-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              data-page="${page + 1}"
              ${page >= totalPages ? 'disabled' : ''}
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    `
  }

  _row(ticket) {
    const cat = getCategoryConfig(ticket.category)
    const pri = getPriorityConfig(ticket.priority)
    return `
      <tr class="border-b border-outline-variant hover:bg-surface-container-low transition-colors group">
        <td class="py-sm px-md text-primary font-code">${ticket.id}</td>
        <td class="py-sm px-md text-on-surface font-medium">${ticket.subject}</td>
        <td class="py-sm px-md">
          <span class="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-semibold" style="${cat.style}">
            <span class="w-1.5 h-1.5 rounded-full mr-1.5" style="${cat.dotStyle}"></span>
            ${cat.label}
          </span>
        </td>
        <td class="py-sm px-md">
          <div class="flex items-center gap-xs ${pri.color}">
            <span class="material-symbols-outlined text-[16px]">${pri.icon}</span>
            <span class="font-label-md text-label-md">${ticket.priority}</span>
          </div>
        </td>
        <td class="py-sm px-md">
          <span class="inline-flex px-2 py-0.5 rounded-full font-label-md text-[11px]" style="${getStatusConfig(ticket.status).style}">${ticket.status}</span>
        </td>
        <td class="py-sm px-md text-on-surface-variant text-sm">${ticket.createdAt}</td>
        <td class="py-sm px-md text-right">
          <div class="flex justify-end gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
            <button class="p-xs text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded cursor-pointer btn-atualizar" title="Atualizar" data-id="${ticket.id}">
              <span class="material-symbols-outlined text-[18px]">edit</span>
            </button>
            <button class="p-xs text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded cursor-pointer btn-detalhes" title="Ver Detalhes" data-id="${ticket.id}">
              <span class="material-symbols-outlined text-[18px]">visibility</span>
            </button>
          </div>
        </td>
      </tr>
    `
  }

  _card(ticket) {
    const cat = getCategoryConfig(ticket.category)
    const pri = getPriorityConfig(ticket.priority)
    return `
      <div class="bg-surface rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        <div class="flex">
          <div class="w-1 flex-shrink-0" style="${cat.accentStyle}"></div>
          <div class="flex-1 p-md">
            <div class="flex items-start justify-between mb-sm">
              <div>
                <span class="font-code text-primary text-sm">${ticket.id}</span>
                <h3 class="font-body-md text-body-md text-on-surface font-medium mt-xs leading-tight">${ticket.subject}</h3>
              </div>
            </div>
            <div class="flex flex-wrap gap-xs items-center mt-sm">
              <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold" style="${cat.style}">
                <span class="w-1.5 h-1.5 rounded-full mr-1" style="${cat.dotStyle}"></span>
                ${cat.label}
              </span>
              <span class="inline-flex items-center gap-xs ${pri.color}">
                <span class="material-symbols-outlined text-[14px]">${pri.icon}</span>
                <span class="font-label-md text-[11px]">${ticket.priority}</span>
              </span>
              <span class="inline-flex px-2 py-0.5 rounded-full font-label-md text-[10px]" style="${getStatusConfig(ticket.status).style}">${ticket.status}</span>
              <span class="font-body-md text-[11px] text-on-surface-variant">${ticket.createdAt}</span>
            </div>
            <div class="flex justify-end gap-xs mt-sm pt-sm border-t border-outline-variant/50">
              <button class="p-xs text-on-surface-variant hover:text-primary rounded cursor-pointer btn-atualizar" title="Atualizar" data-id="${ticket.id}">
                <span class="material-symbols-outlined text-[18px]">edit</span>
              </button>
              <button class="p-xs text-on-surface-variant hover:text-primary rounded cursor-pointer btn-detalhes" title="Ver Detalhes" data-id="${ticket.id}">
                <span class="material-symbols-outlined text-[18px]">visibility</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `
  }

  _emptyState() {
    return `
      <div class="bg-surface border border-outline-variant rounded-xl shadow-sm p-xl flex flex-col items-center justify-center min-h-[200px]">
        <span class="material-symbols-outlined text-4xl text-on-surface-variant opacity-40 mb-md">assignment_turned_in</span>
        <p class="font-body-lg text-body-lg text-on-surface-variant font-medium">Nenhum chamado encontrado</p>
        <p class="font-body-md text-body-md text-on-surface-variant mt-xs opacity-70">Você não possui chamados com este filtro.</p>
      </div>
    `
  }

  afterRender() {
    this.container.querySelectorAll('.status-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        const status = btn.dataset.status
        this.state.statusFilter = status
        if (this.props.onStatusFilter) this.props.onStatusFilter(status)
      })
    })

    this.container.querySelectorAll('.my-page-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const page = parseInt(btn.dataset.page, 10)
        if (this.props.onPageChange) this.props.onPageChange(page)
      })
    })
  }
}

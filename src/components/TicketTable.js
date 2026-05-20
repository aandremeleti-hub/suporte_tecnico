import Component from '../lib/Component.js'
import { getCategoryConfig, getPriorityConfig, getStatusConfig } from '../data/tickets.js'

export default class TicketTable extends Component {
  template() {
    const { items, start, end, total, page, totalPages } = this.props.pagination || {}

    if (!items || items.length === 0) {
      return this._emptyState()
    }

    return `
      <div class="bg-surface border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <!-- Desktop table -->
        <div class="overflow-x-auto hidden md:block">
          <table class="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr class="bg-surface-container-lowest border-b border-outline-variant">
                <th class="py-sm px-md font-label-md text-label-md text-on-surface-variant w-24">ID/Ticket</th>
                <th class="py-sm px-md font-label-md text-label-md text-on-surface-variant">Assunto do Chamado</th>
                <th class="py-sm px-md font-label-md text-label-md text-on-surface-variant w-40">Categoria</th>
                <th class="py-sm px-md font-label-md text-label-md text-on-surface-variant w-32">Prioridade</th>
                <th class="py-sm px-md font-label-md text-label-md text-on-surface-variant w-40">Status</th>
                <th class="py-sm px-md font-label-md text-label-md text-on-surface-variant w-24 text-right">Ações</th>
              </tr>
            </thead>
            <tbody class="font-body-md text-body-md">
              ${items.map((ticket, index) => this._desktopRow(ticket, index)).join('')}
            </tbody>
          </table>
        </div>

        <!-- Mobile card list -->
        <div class="md:hidden flex flex-col gap-sm p-md">
          ${items.map((ticket) => this._mobileCard(ticket)).join('')}
        </div>

        <!-- Pagination footer -->
        <div class="px-md py-sm border-t border-outline-variant bg-surface-container-lowest flex items-center justify-between">
          <span class="font-body-md text-body-md text-on-surface-variant text-sm">
            Mostrando ${start}-${end} de ${total} chamados
          </span>
          <div class="flex gap-xs">
            <button
              class="paginate-btn px-sm py-xs border border-outline-variant rounded-md text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              data-page="${page - 1}"
              ${page <= 1 ? 'disabled' : ''}
            >
              Anterior
            </button>
            <button
              class="paginate-btn px-sm py-xs border border-outline-variant rounded-md text-on-surface hover:bg-surface-container-low bg-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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

  _desktopRow(ticket, index) {
    const cat = getCategoryConfig(ticket.category)
    const pri = getPriorityConfig(ticket.priority)
    return `
      <tr class="border-b border-outline-variant hover:bg-surface-container-low transition-colors group ${index % 2 === 0 ? '' : ''}">
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
          <span class="inline-flex px-2 py-0.5 rounded-full font-label-md text-[11px]" style="${getStatusConfig(ticket.status).style}">
            ${ticket.status}
          </span>
        </td>
        <td class="py-sm px-md text-right">
          <div class="flex justify-end gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
            <button class="p-xs text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded cursor-pointer btn-atribuir" title="Atribuir" data-id="${ticket.id}">
              <span class="material-symbols-outlined text-[18px]">person_add</span>
            </button>
            <button class="p-xs text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded cursor-pointer btn-detalhes" title="Ver Detalhes" data-id="${ticket.id}">
              <span class="material-symbols-outlined text-[18px]">visibility</span>
            </button>
          </div>
        </td>
      </tr>
    `
  }

  _mobileCard(ticket) {
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
              <span class="inline-flex px-2 py-0.5 rounded-full font-label-md text-[10px]" style="${getStatusConfig(ticket.status).style}">
                ${ticket.status}
              </span>
            </div>
            <div class="flex justify-end gap-xs mt-sm pt-sm border-t border-outline-variant/50">
              <button class="p-xs text-on-surface-variant hover:text-primary rounded cursor-pointer btn-atribuir" title="Atribuir" data-id="${ticket.id}">
                <span class="material-symbols-outlined text-[18px]">person_add</span>
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
        <span class="material-symbols-outlined text-4xl text-on-surface-variant opacity-40 mb-md">search_off</span>
        <p class="font-body-lg text-body-lg text-on-surface-variant font-medium">Nenhum chamado encontrado</p>
        <p class="font-body-md text-body-md text-on-surface-variant mt-xs opacity-70">Tente ajustar os filtros ou termos da busca.</p>
      </div>
    `
  }

  afterRender() {
    this.container.querySelectorAll('.paginate-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const page = parseInt(btn.dataset.page, 10)
        if (this.props.onPageChange) {
          this.props.onPageChange(page)
        }
      })
    })
  }
}

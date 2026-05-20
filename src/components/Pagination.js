import Component from '../lib/Component.js'

export default class Pagination extends Component {
  template() {
    const { page, totalPages, total, start, end } = this.props

    if (totalPages <= 1) return ''

    return `
      <div class="flex items-center justify-between">
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

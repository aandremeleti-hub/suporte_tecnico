import Component from '../lib/Component.js'
import { getCategoryList } from '../data/tickets.js'

export default class FilterChips extends Component {
  template() {
    const active = this.props.activeCategory || 'todos'
    return `
      <div class="flex flex-wrap gap-xs items-center mb-xs">
        <span class="font-label-md text-label-md text-on-surface-variant mr-sm">Filtrar por Categoria:</span>
        ${getCategoryList().map(
          (cat) => `
          <button
            class="filter-chip px-sm py-xs rounded-full border font-label-md text-label-md cursor-pointer transition-colors active:opacity-80 ${
              active === cat.id
                ? 'border-primary-container bg-primary-container text-on-primary-container'
                : 'border-outline-variant bg-surface text-on-surface-variant hover:bg-surface-container-low'
            }"
            data-category="${cat.id}"
          >
            ${cat.label}
          </button>
        `
        ).join('')}
      </div>
    `
  }

  afterRender() {
    this.container.querySelectorAll('.filter-chip').forEach((chip) => {
      chip.addEventListener('click', (e) => {
        const category = chip.dataset.category
        if (this.props.onFilter) {
          this.props.onFilter(category)
        }
      })
    })
  }
}

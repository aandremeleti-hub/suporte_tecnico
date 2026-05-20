import Component from '../lib/Component.js'
import { getCategoryConfig, getCategoryDistribution, getStatusDistribution, getMonthlyVolume, getTechnicianPerformance, getReportMetrics, getCategories, getStatuses } from '../data/tickets.js'

export default class Relatorios extends Component {
  template() {
    const tickets = this.props.tickets || []
    const metrics = getReportMetrics(tickets)
    const catDist = getCategoryDistribution(tickets)
    const statusDist = getStatusDistribution(tickets)
    const volume = getMonthlyVolume(tickets, 14)
    const tecPerf = getTechnicianPerformance(tickets)
    const maxVolume = Math.max(...volume.map((v) => v.count), 1)

    const reportCards = [
      { label: 'Total de Chamados', value: metrics.total, icon: 'confirmation_number', color: 'text-primary', bg: 'bg-primary-fixed' },
      { label: 'Em Andamento', value: metrics.emAndamento, icon: 'engineering', color: 'text-on-primary-fixed-variant', bg: 'bg-primary-fixed-dim' },
      { label: 'Concluídos', value: metrics.concluidos, icon: 'task_alt', color: 'text-on-secondary-container', bg: 'bg-secondary-container' },
      { label: 'Taxa de Conclusão', value: `${metrics.taxaConclusao}%`, icon: 'trending_up', color: 'text-primary', bg: 'bg-primary-fixed' },
    ]

    return `
      <div class="flex flex-col gap-lg">
        <div>
          <h2 class="font-display text-headline-md text-on-surface">Relatórios</h2>
          <p class="font-body-md text-body-md text-on-surface-variant mt-xs">Métricas e análises operacionais do período.</p>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-md">
          ${reportCards.map((c) => this._metricCard(c)).join('')}
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-lg">
          ${this._categoryChart(catDist)}
          ${this._statusChart(statusDist)}
        </div>

        ${this._volumeChart(volume, maxVolume)}

        ${this._tecTable(tecPerf)}
      </div>
    `
  }

  _metricCard(c) {
    return `
      <div class="bg-surface rounded-xl p-lg border border-outline-variant shadow-sm flex flex-col gap-sm">
        <div class="flex items-center justify-between">
          <span class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">${c.label}</span>
          <span class="material-symbols-outlined ${c.color} ${c.bg} p-xs rounded-md">${c.icon}</span>
        </div>
        <span class="font-display text-display text-on-surface leading-none">${c.value}</span>
      </div>
    `
  }

  _categoryChart(dist) {
    const maxCount = Math.max(...dist.map((d) => d.count), 1)
    return `
      <div class="bg-surface rounded-xl p-lg border border-outline-variant shadow-sm">
        <h3 class="font-display text-title-lg text-on-surface mb-md">Chamados por Categoria</h3>
        <div class="flex flex-col gap-sm">
          ${dist
            .map(
              (d) => `
            <div class="flex items-center gap-sm">
              <span class="font-label-md text-label-md text-on-surface-variant w-28 flex-shrink-0">${d.label}</span>
              <div class="flex-1 h-5 bg-surface-container-high rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all"
                  style="width: ${(d.count / maxCount) * 100}%; background-color: ${this._catColor(d.id)}"
                ></div>
              </div>
              <span class="font-label-md text-label-md text-on-surface-variant w-10 text-right">${d.count}</span>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `
  }

  _statusChart(dist) {
    const total = dist.reduce((s, d) => s + d.count, 0)
    return `
      <div class="bg-surface rounded-xl p-lg border border-outline-variant shadow-sm">
        <h3 class="font-display text-title-lg text-on-surface mb-md">Chamados por Status</h3>
        <div class="flex flex-col gap-sm">
          <div class="flex h-6 rounded-full overflow-hidden mb-sm">
            ${dist
              .map(
                (d) => `
              <div
                style="width: ${(d.count / total) * 100}%; background-color: ${this._statusColor(d.status)}"
                title="${d.status}: ${d.count}"
              ></div>
            `
              )
              .join('')}
          </div>
          ${dist
            .map(
              (d) => `
            <div class="flex items-center justify-between gap-sm">
              <div class="flex items-center gap-sm">
                <span class="w-2.5 h-2.5 rounded-sm" style="background-color: ${this._statusColor(d.status)}"></span>
                <span class="font-body-md text-body-md text-on-surface">${d.status}</span>
              </div>
              <span class="font-label-md text-label-md text-on-surface-variant">${d.count} (${d.pct}%)</span>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `
  }

  _volumeChart(volume, maxVal) {
    const maxHeight = 120
    return `
      <div class="bg-surface rounded-xl p-lg border border-outline-variant shadow-sm">
        <h3 class="font-display text-title-lg text-on-surface mb-md">Volume de Chamados (14 dias)</h3>
        <div class="flex items-end gap-xs h-[${maxHeight + 30}px]">
          ${volume
            .map(
              (d) => `
            <div class="flex-1 flex flex-col items-center gap-xs group relative">
              <span class="font-label-md text-[10px] text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">${d.count}</span>
              <div
                class="w-full rounded-t-md transition-all hover:opacity-80 cursor-pointer"
                style="height: ${Math.max(4, (d.count / maxVal) * maxHeight)}px; background-color: #091426;"
              ></div>
              <span class="font-label-md text-[9px] text-on-surface-variant">${d.label}</span>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `
  }

  _tecTable(tecData) {
    return `
      <div class="bg-surface rounded-xl p-lg border border-outline-variant shadow-sm">
        <h3 class="font-display text-title-lg text-on-surface mb-md">Performance dos Técnicos</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr class="border-b border-outline-variant">
                <th class="py-sm px-md font-label-md text-label-md text-on-surface-variant">Técnico</th>
                <th class="py-sm px-md font-label-md text-label-md text-on-surface-variant text-center">Total</th>
                <th class="py-sm px-md font-label-md text-label-md text-on-surface-variant text-center">Em Andamento</th>
                <th class="py-sm px-md font-label-md text-label-md text-on-surface-variant text-center">Concluídos</th>
                <th class="py-sm px-md font-label-md text-label-md text-on-surface-variant text-center">Taxa de Conclusão</th>
              </tr>
            </thead>
            <tbody class="font-body-md text-body-md">
              ${tecData
                .map(
                  (t) => `
                <tr class="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                  <td class="py-sm px-md text-on-surface font-medium">${t.nome}</td>
                  <td class="py-sm px-md text-center text-on-surface">${t.total}</td>
                  <td class="py-sm px-md text-center">
                    <span class="inline-flex px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-md text-[11px]">${t.emAndamento}</span>
                  </td>
                  <td class="py-sm px-md text-center">
                    <span class="inline-flex px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-[11px]">${t.concluidos}</span>
                  </td>
                  <td class="py-sm px-md text-center">
                    <div class="flex items-center gap-sm justify-center">
                      <div class="w-16 h-2 bg-surface-container-high rounded-full overflow-hidden">
                        <div class="h-full rounded-full bg-primary" style="width: ${t.taxaConclusao}%"></div>
                      </div>
                      <span class="font-label-md text-label-md text-on-surface-variant">${t.taxaConclusao}%</span>
                    </div>
                  </td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>
      </div>
    `
  }

  _catColor(catId) {
    const cats = getCategories()
    const found = cats.find((c) => c.id === catId)
    return found ? found.borderColor : '#bcc7de'
  }

  _statusColor(statusId) {
    const sts = getStatuses()
    const found = sts.find((s) => s.id === statusId)
    return found ? found.bgColor : '#e4e2e3'
  }
}

import Component from '../lib/Component.js'
import { CURRENT_USER, setUserFoto, saveProfile, getSystemConfig, saveSystemConfig, resizeImage, getCategories, addCategory, updateCategory, removeCategory, getStatuses, addStatus, updateStatus, removeStatus, getUsers, addUser, updateUser, removeUser, changePassword, adminChangePassword, ROLES } from '../data/tickets.js'

const LANGUAGES = [
  { value: 'pt-BR', label: 'Português (Brasil)' },
  { value: 'en-US', label: 'English (US)' },
  { value: 'es', label: 'Español' },
]

const DATE_FORMATS = [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
]

const TIMEZONES = [
  { value: 'America/Sao_Paulo', label: 'America/Sao_Paulo (UTC-3)' },
  { value: 'America/New_York', label: 'America/New_York (UTC-5)' },
  { value: 'UTC', label: 'UTC' },
]

export default class Configuracoes extends Component {
  constructor(containerId, props) {
    super(containerId, props)
    this.state = {
      language: 'pt-BR',
      dateFormat: 'DD/MM/YYYY',
      timezone: 'America/Sao_Paulo',
      notifEmail: true,
      notifPush: true,
      notifSms: false,
      slaResponse: 4,
      slaResolution: 48,
      activeTab: 'perfil',
    }
  }

  template() {
    const tab = this.state.activeTab
    const tabs = this._getTabs()
    return `
      <div class="flex flex-col gap-lg">
        <div>
          <h2 class="font-display text-headline-md text-on-surface">Configurações</h2>
          <p class="font-body-md text-body-md text-on-surface-variant mt-xs">Gerencie suas preferências e configurações do sistema.</p>
        </div>

        <div class="flex flex-wrap gap-xs border-b border-outline-variant pb-0">
          ${tabs.map(t => this._tabBtn(t.id, t.label, tab)).join('')}
        </div>

        ${tab === 'perfil' ? this._tabPerfil() : ''}
        ${tab === 'seguranca' ? this._tabSeguranca() : ''}
        ${tab === 'preferencias' ? this._tabPreferencias() : ''}
        ${tab === 'notificacoes' ? this._tabNotificacoes() : ''}
        ${tab === 'sla' ? this._tabSla() : ''}
        ${tab === 'equipe' ? this._tabEquipe() : ''}
        ${tab === 'gerenciar' ? this._tabGerenciar() : ''}
        ${tab === 'sistema' ? this._tabSistema() : ''}
        ${tab === 'usuarios' ? this._tabUsuarios() : ''}
      </div>
    `
  }

  _getTabs() {
    const role = CURRENT_USER.role
    const all = [
      { id: 'perfil', label: 'Perfil', roles: ['admin', 'tecnico', 'cliente'] },
      { id: 'seguranca', label: 'Segurança', roles: ['admin', 'tecnico', 'cliente'] },
      { id: 'preferencias', label: 'Preferências', roles: ['admin', 'tecnico'] },
      { id: 'notificacoes', label: 'Notificações', roles: ['admin'] },
      { id: 'sla', label: 'SLA', roles: ['admin', 'tecnico'] },
      { id: 'equipe', label: 'Equipe', roles: ['admin', 'tecnico'] },
      { id: 'gerenciar', label: 'Gerenciar', roles: ['admin'] },
      { id: 'sistema', label: 'Sistema', roles: ['admin'] },
      { id: 'usuarios', label: 'Usuários', roles: ['admin'] },
    ]
    return all.filter(t => t.roles.includes(role))
  }

  _tabBtn(id, label, active) {
    return `
      <button
        class="config-tab px-md py-sm font-label-md text-label-md cursor-pointer transition-colors border-b-2 -mb-px ${
          active === id
            ? 'border-primary text-primary'
            : 'border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline-variant'
        }"
        data-tab="${id}"
      >
        ${label}
      </button>
    `
  }

  _tabPerfil() {
    const foto = CURRENT_USER.foto
    return `
      <div class="bg-surface rounded-xl p-lg border border-outline-variant shadow-sm">
        <div class="flex flex-col md:flex-row items-start gap-lg">
          <div class="flex-shrink-0 relative group cursor-pointer" id="avatar-wrapper">
            ${foto
              ? `<img src="${foto}" class="w-20 h-20 rounded-full object-cover" />`
              : `<div class="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-2xl">
                  ${CURRENT_USER.nome.split(' ').map((n) => n[0]).join('')}
                 </div>`
            }
            <div class="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span class="material-symbols-outlined text-white">camera_alt</span>
            </div>
            <input type="file" id="foto-input" accept="image/*" class="hidden" />
          </div>
          <div class="flex-1 w-full">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div class="flex flex-col gap-xs">
                <label class="font-label-md text-label-md text-on-surface-variant">Nome completo</label>
                <input id="perfil-nome" class="w-full bg-surface-container-low border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" type="text" value="${CURRENT_USER.nome}" />
              </div>
              <div class="flex flex-col gap-xs">
                <label class="font-label-md text-label-md text-on-surface-variant">E-mail</label>
                <input id="perfil-email" class="w-full bg-surface-container-low border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" type="email" value="${CURRENT_USER.email}" />
              </div>
              <div class="flex flex-col gap-xs">
                <label class="font-label-md text-label-md text-on-surface-variant">Cargo</label>
                <input id="perfil-cargo" class="w-full bg-surface-container-low border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" type="text" value="${CURRENT_USER.cargo}" />
              </div>
              <div class="flex flex-col gap-xs">
                <label class="font-label-md text-label-md text-on-surface-variant">Telefone</label>
                <input id="perfil-telefone" class="w-full bg-surface-container-low border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" type="text" value="${CURRENT_USER.telefone}" />
              </div>
            </div>
            <div class="flex justify-end mt-md">
              <button id="btn-salvar-perfil" class="px-lg py-sm rounded-lg bg-primary text-on-primary font-label-md text-label-md cursor-pointer hover:opacity-90 transition-opacity">
                Salvar Perfil
              </button>
            </div>
          </div>
        </div>
      </div>
    `
  }

  _tabPreferencias() {
    return `
      <div class="bg-surface rounded-xl p-lg border border-outline-variant shadow-sm">
        <h3 class="font-display text-title-lg text-on-surface mb-md">Preferências do Sistema</h3>
        <div class="flex flex-col gap-md">
          <div class="flex flex-col gap-xs">
            <label class="font-label-md text-label-md text-on-surface-variant" for="lang">Idioma</label>
            <select id="lang" class="config-select w-full md:w-72 bg-surface-container-low border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer">
              ${LANGUAGES.map(
                (l) =>
                  `<option value="${l.value}" ${this.state.language === l.value ? 'selected' : ''}>${l.label}</option>`
              ).join('')}
            </select>
          </div>
          <div class="flex flex-col gap-xs">
            <label class="font-label-md text-label-md text-on-surface-variant" for="datefmt">Formato de Data</label>
            <select id="datefmt" class="config-select w-full md:w-72 bg-surface-container-low border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer">
              ${DATE_FORMATS.map(
                (f) =>
                  `<option value="${f.value}" ${this.state.dateFormat === f.value ? 'selected' : ''}>${f.label}</option>`
              ).join('')}
            </select>
          </div>
          <div class="flex flex-col gap-xs">
            <label class="font-label-md text-label-md text-on-surface-variant" for="tz">Fuso Horário</label>
            <select id="tz" class="config-select w-full md:w-72 bg-surface-container-low border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer">
              ${TIMEZONES.map(
                (t) =>
                  `<option value="${t.value}" ${this.state.timezone === t.value ? 'selected' : ''}>${t.label}</option>`
              ).join('')}
            </select>
          </div>
          <div class="flex justify-end mt-md">
            <button class="config-save-pref px-lg py-sm rounded-lg bg-primary text-on-primary font-label-md text-label-md cursor-pointer hover:opacity-90 transition-opacity">
              Salvar Preferências
            </button>
          </div>
        </div>
      </div>
    `
  }

  _tabNotificacoes() {
    return `
      <div class="bg-surface rounded-xl p-lg border border-outline-variant shadow-sm">
        <h3 class="font-display text-title-lg text-on-surface mb-md">Notificações</h3>
        <p class="font-body-md text-body-md text-on-surface-variant mb-md">Configure como deseja ser notificado sobre atualizações de chamados.</p>
        <div class="flex flex-col gap-md">
          ${this._toggle('notifEmail', 'Notificações por E-mail', 'Receba atualizações dos chamados no seu e-mail.', this.state.notifEmail)}
          ${this._toggle('notifPush', 'Notificações Push', 'Receba notificações no navegador.', this.state.notifPush)}
          ${this._toggle('notifSms', 'Notificações por SMS', 'Receba alertas críticos via SMS.', this.state.notifSms)}
        </div>
        <div class="flex justify-end mt-md">
          <button class="config-save-notif px-lg py-sm rounded-lg bg-primary text-on-primary font-label-md text-label-md cursor-pointer hover:opacity-90 transition-opacity">
            Salvar Notificações
          </button>
        </div>
      </div>
    `
  }

  _toggle(id, label, desc, checked) {
    return `
      <div class="flex items-center justify-between py-sm px-md rounded-lg hover:bg-surface-container-low transition-colors">
        <div>
          <span class="font-body-md text-body-md text-on-surface">${label}</span>
          <p class="font-body-md text-[12px] text-on-surface-variant">${desc}</p>
        </div>
        <button
          class="config-toggle relative w-11 h-6 rounded-full transition-colors flex-shrink-0 cursor-pointer ${
            checked ? 'bg-primary' : 'bg-surface-container-high border border-outline-variant'
          }"
          data-toggle="${id}"
          aria-label="${label}"
        >
          <span class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-5' : ''
          }"></span>
        </button>
      </div>
    `
  }

  _tabSla() {
    return `
      <div class="bg-surface rounded-xl p-lg border border-outline-variant shadow-sm">
        <h3 class="font-display text-title-lg text-on-surface mb-md">Metas de SLA</h3>
        <p class="font-body-md text-body-md text-on-surface-variant mb-md">Defina os prazos máximos para atendimento e resolução de chamados.</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-lg">
          <div class="flex flex-col gap-xs">
            <label class="font-label-md text-label-md text-on-surface-variant">Tempo de Resposta (horas)</label>
            <div class="flex items-center gap-sm">
              <input
                id="sla-response"
                class="w-full bg-surface-container-low border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                type="number"
                min="1"
                max="72"
                value="${this.state.slaResponse}"
              />
              <span class="font-body-md text-body-md text-on-surface-variant">horas</span>
            </div>
            <p class="font-body-md text-[12px] text-on-surface-variant">Tempo máximo para o primeiro contato com o solicitante.</p>
          </div>
          <div class="flex flex-col gap-xs">
            <label class="font-label-md text-label-md text-on-surface-variant">Tempo de Resolução (horas)</label>
            <div class="flex items-center gap-sm">
              <input
                id="sla-resolution"
                class="w-full bg-surface-container-low border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                type="number"
                min="1"
                max="168"
                value="${this.state.slaResolution}"
              />
              <span class="font-body-md text-body-md text-on-surface-variant">horas</span>
            </div>
            <p class="font-body-md text-[12px] text-on-surface-variant">Tempo máximo para resolução completa do chamado.</p>
          </div>
        </div>
        <div class="flex justify-end mt-md">
          <button class="config-save-sla px-lg py-sm rounded-lg bg-primary text-on-primary font-label-md text-label-md cursor-pointer hover:opacity-90 transition-opacity">
            Salvar Metas SLA
          </button>
        </div>
      </div>
    `
  }

  _tabEquipe() {
    const team = [
      { nome: 'Carlos Silva', cargo: 'Técnico Sênior', email: 'carlos.silva@techsupport.com', status: 'Disponível', tickets: 12 },
      { nome: 'Ana Oliveira', cargo: 'Técnica Pleno', email: 'ana.oliveira@techsupport.com', status: 'Em Chamado', tickets: 8 },
      { nome: 'Rafael Santos', cargo: 'Técnico Júnior', email: 'rafael.santos@techsupport.com', status: 'Disponível', tickets: 5 },
      { nome: 'Juliana Costa', cargo: 'Técnica Pleno', email: 'juliana.costa@techsupport.com', status: 'Pausa', tickets: 9 },
      { nome: 'Fernando Lima', cargo: 'Técnico Júnior', email: 'fernando.lima@techsupport.com', status: 'Disponível', tickets: 3 },
    ]
    return `
      <div class="bg-surface rounded-xl p-lg border border-outline-variant shadow-sm">
        <div class="flex items-center justify-between mb-md">
          <h3 class="font-display text-title-lg text-on-surface">Equipe de Suporte</h3>
          <button class="px-lg py-sm rounded-lg bg-primary text-on-primary font-label-md text-label-md cursor-pointer hover:opacity-90 transition-opacity flex items-center gap-sm">
            <span class="material-symbols-outlined text-sm">person_add</span>
            Adicionar
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr class="border-b border-outline-variant">
                <th class="py-sm px-md font-label-md text-label-md text-on-surface-variant">Nome</th>
                <th class="py-sm px-md font-label-md text-label-md text-on-surface-variant hidden md:table-cell">E-mail</th>
                <th class="py-sm px-md font-label-md text-label-md text-on-surface-variant">Status</th>
                <th class="py-sm px-md font-label-md text-label-md text-on-surface-variant text-center">Tickets</th>
                <th class="py-sm px-md font-label-md text-label-md text-on-surface-variant text-right">Ações</th>
              </tr>
            </thead>
            <tbody class="font-body-md text-body-md">
              ${team
                .map(
                  (m) => `
                <tr class="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                  <td class="py-sm px-md">
                    <div class="flex items-center gap-sm">
                      <div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-xs flex-shrink-0">
                        ${m.nome.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <span class="font-body-md text-body-md text-on-surface font-medium block">${m.nome}</span>
                        <span class="font-label-md text-[11px] text-on-surface-variant md:hidden">${m.email}</span>
                        <span class="font-label-md text-[11px] text-on-surface-variant hidden md:block">${m.cargo}</span>
                      </div>
                    </div>
                  </td>
                  <td class="py-sm px-md text-on-surface-variant hidden md:table-cell text-sm">${m.email}</td>
                  <td class="py-sm px-md">
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-label-md text-[11px] ${
                      m.status === 'Disponível'
                        ? 'bg-primary-fixed text-primary'
                        : m.status === 'Em Chamado'
                          ? 'bg-tertiary-fixed text-tertiary-container'
                          : 'bg-surface-container-highest text-on-surface-variant'
                    }">
                      <span class="w-1.5 h-1.5 rounded-full ${
                        m.status === 'Disponível'
                          ? 'bg-primary'
                          : m.status === 'Em Chamado'
                            ? 'bg-tertiary-container'
                            : 'bg-outline'
                      }"></span>
                      ${m.status}
                    </span>
                  </td>
                  <td class="py-sm px-md text-center text-on-surface">${m.tickets}</td>
                  <td class="py-sm px-md text-right">
                    <button class="p-xs text-on-surface-variant hover:text-primary rounded cursor-pointer">
                      <span class="material-symbols-outlined text-[18px]">more_vert</span>
                    </button>
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

  _tabGerenciar() {
    const cats = getCategories()
    const sts = getStatuses()
    return `
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        <div class="bg-surface rounded-xl p-lg border border-outline-variant shadow-sm">
          <div class="flex items-center justify-between mb-md">
            <h3 class="font-display text-title-lg text-on-surface">Categorias</h3>
          </div>
          <div class="flex flex-col gap-sm mb-md">
            <input class="cat-input-id w-full bg-surface-container-low border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="ID (ex: redes)" />
            <input class="cat-input-label w-full bg-surface-container-low border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="Nome (ex: Redes)" />
            <div class="flex gap-sm">
              <div class="flex-1 flex items-center gap-xs">
                <label class="font-label-md text-[11px] text-on-surface-variant">Fundo</label>
                <input class="cat-input-bg w-full h-8 border border-outline-variant rounded-lg cursor-pointer" type="color" value="#d8e3fb" />
              </div>
              <div class="flex-1 flex items-center gap-xs">
                <label class="font-label-md text-[11px] text-on-surface-variant">Texto</label>
                <input class="cat-input-text w-full h-8 border border-outline-variant rounded-lg cursor-pointer" type="color" value="#091426" />
              </div>
            </div>
            <button class="cat-add-btn px-lg py-sm rounded-lg bg-primary text-on-primary font-label-md text-label-md cursor-pointer hover:opacity-90 transition-opacity w-full">
              + Adicionar Categoria
            </button>
          </div>
          <div class="flex flex-col gap-xs max-h-64 overflow-y-auto">
            ${cats
              .map(
                (c) => `
              <div class="flex items-center gap-sm py-sm px-sm rounded-lg hover:bg-surface-container-low transition-colors group" data-cat-id="${c.id}">
                <span class="w-4 h-4 rounded flex-shrink-0" style="background-color:${c.bgColor};border:1px solid ${c.borderColor}"></span>
                <span class="flex-1 font-body-md text-body-md text-on-surface text-sm">${c.label}</span>
                <button class="cat-edit-btn p-xs text-on-surface-variant hover:text-primary rounded cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" title="Editar">
                  <span class="material-symbols-outlined text-lg">edit</span>
                </button>
                <button class="cat-del-btn p-xs text-on-surface-variant hover:text-error rounded cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" title="Excluir">
                  <span class="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            `
              )
              .join('')}
          </div>
        </div>

        <div class="bg-surface rounded-xl p-lg border border-outline-variant shadow-sm">
          <div class="flex items-center justify-between mb-md">
            <h3 class="font-display text-title-lg text-on-surface">Status</h3>
          </div>
          <div class="flex flex-col gap-sm mb-md">
            <input class="st-input-id w-full bg-surface-container-low border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="ID (ex: em-analise)" />
            <input class="st-input-label w-full bg-surface-container-low border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="Nome (ex: Em Análise)" />
            <div class="flex gap-sm">
              <div class="flex-1 flex items-center gap-xs">
                <label class="font-label-md text-[11px] text-on-surface-variant">Fundo</label>
                <input class="st-input-bg w-full h-8 border border-outline-variant rounded-lg cursor-pointer" type="color" value="#dfe2ed" />
              </div>
              <div class="flex-1 flex items-center gap-xs">
                <label class="font-label-md text-[11px] text-on-surface-variant">Texto</label>
                <input class="st-input-text w-full h-8 border border-outline-variant rounded-lg cursor-pointer" type="color" value="#45474c" />
              </div>
            </div>
            <button class="st-add-btn px-lg py-sm rounded-lg bg-primary text-on-primary font-label-md text-label-md cursor-pointer hover:opacity-90 transition-opacity w-full">
              + Adicionar Status
            </button>
          </div>
          <div class="flex flex-col gap-xs max-h-64 overflow-y-auto">
            ${sts
              .map(
                (s) => `
              <div class="flex items-center gap-sm py-sm px-sm rounded-lg hover:bg-surface-container-low transition-colors group" data-st-id="${s.id}">
                <span class="w-4 h-4 rounded flex-shrink-0" style="background-color:${s.bgColor}"></span>
                <span class="flex-1 font-body-md text-body-md text-on-surface text-sm">${s.label}</span>
                <button class="st-edit-btn p-xs text-on-surface-variant hover:text-primary rounded cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" title="Editar">
                  <span class="material-symbols-outlined text-lg">edit</span>
                </button>
                <button class="st-del-btn p-xs text-on-surface-variant hover:text-error rounded cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" title="Excluir">
                  <span class="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      </div>
    `
  }

  _tabSistema() {
    const config = getSystemConfig()
    return `
      <div class="flex flex-col gap-lg">
        <div class="bg-surface rounded-xl p-lg border border-outline-variant shadow-sm">
          <h3 class="font-display text-title-lg text-on-surface mb-md">Identidade do Sistema</h3>
          <p class="font-body-md text-body-md text-on-surface-variant mb-md">Personalize o título, subtítulo e logotipo exibidos na barra lateral.</p>
          <div class="flex flex-col gap-md">
            <div class="flex flex-col gap-xs">
              <label class="font-label-md text-label-md text-on-surface-variant">Título</label>
              <input id="sist-titulo" class="w-full bg-surface-container-low border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" type="text" value="${config.title}" />
            </div>
            <div class="flex flex-col gap-xs">
              <label class="font-label-md text-label-md text-on-surface-variant">Subtítulo</label>
              <input id="sist-subtitulo" class="w-full bg-surface-container-low border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" type="text" value="${config.subtitle}" />
            </div>
            <div class="flex flex-col gap-xs">
              <label class="font-label-md text-label-md text-on-surface-variant">Logotipo</label>
              <div class="flex items-center gap-md">
                <div id="sist-logo-preview" class="w-16 h-16 rounded-xl border border-outline-variant bg-surface-container-low flex items-center justify-center overflow-hidden">
                  ${config.logo
                    ? `<img src="${config.logo}" class="max-w-14 max-h-14 object-contain" />`
                    : `<span class="material-symbols-outlined text-on-surface-variant opacity-40">image</span>`
                  }
                </div>
                <div class="flex flex-col gap-xs">
                  <button id="btn-sist-logo" class="px-lg py-sm rounded-lg border border-outline-variant text-on-surface font-label-md text-label-md cursor-pointer hover:bg-surface-container-low transition-colors">
                    Escolher Imagem
                  </button>
                  <span class="font-label-md text-[11px] text-on-surface-variant">Máx. 200×80px · PNG</span>
                </div>
              </div>
              <input type="file" id="sist-logo-input" accept="image/*" class="hidden" />
            </div>
            <div class="flex justify-end mt-md">
              <button id="btn-salvar-sistema" class="px-lg py-sm rounded-lg bg-primary text-on-primary font-label-md text-label-md cursor-pointer hover:opacity-90 transition-opacity">
                Salvar Configurações do Sistema
              </button>
            </div>
          </div>
        </div>
      </div>
    `
  }

  _tabSeguranca() {
    return `
      <div>
        <h3 class="font-display text-title-lg text-on-surface mb-lg">Segurança e Acesso</h3>
        <div class="bg-surface-container-low rounded-xl p-lg border border-outline-variant max-w-lg">
          <h4 class="font-label-md text-label-md text-on-surface mb-md">Alterar Senha</h4>
          <div class="flex flex-col gap-md">
            <div class="flex flex-col gap-xs">
              <label class="font-label-md text-label-md text-on-surface-variant">Senha Atual</label>
              <input id="seg-senha-atual" class="w-full bg-surface-container-high border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" type="password" autocomplete="current-password" />
            </div>
            <div class="flex flex-col gap-xs">
              <label class="font-label-md text-label-md text-on-surface-variant">Nova Senha</label>
              <input id="seg-nova-senha" class="w-full bg-surface-container-high border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" type="password" autocomplete="new-password" />
            </div>
            <div class="flex flex-col gap-xs">
              <label class="font-label-md text-label-md text-on-surface-variant">Confirmar Nova Senha</label>
              <input id="seg-confirmar-senha" class="w-full bg-surface-container-high border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" type="password" autocomplete="new-password" />
            </div>
            <button id="btn-salvar-senha" class="bg-primary text-on-primary rounded-lg py-sm px-md font-label-md text-label-md cursor-pointer hover:opacity-90 transition-opacity self-start">
              Salvar Senha
            </button>
          </div>
        </div>
      </div>
    `
  }

  _tabUsuarios() {
    const users = getUsers()
    return `
      <div>
        <div class="flex items-center justify-between mb-lg">
          <h3 class="font-display text-title-lg text-on-surface">Gerenciar Usuários</h3>
          <button id="btn-novo-usuario" class="bg-primary text-on-primary rounded-lg py-sm px-md font-label-md text-label-md cursor-pointer hover:opacity-90 transition-opacity flex items-center gap-sm">
            <span class="material-symbols-outlined text-sm">add</span>
            Novo Usuário
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left font-body-md text-body-md">
            <thead>
              <tr class="text-on-surface-variant text-label-md border-b border-outline-variant">
                <th class="py-sm px-sm">Usuário</th>
                <th class="py-sm px-sm">Email</th>
                <th class="py-sm px-sm">Cargo</th>
                <th class="py-sm px-sm">Função</th>
                <th class="py-sm px-sm">Ativo</th>
                <th class="py-sm px-sm">Ações</th>
              </tr>
            </thead>
            <tbody>
              ${users.map(u => `
                <tr class="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors" data-user-id="${u.id}">
                  <td class="py-sm px-sm flex items-center gap-sm">
                    <div class="w-8 h-8 rounded-full bg-primary-container flex-shrink-0 flex items-center justify-center overflow-hidden">
                      ${u.foto
                        ? `<img src="${u.foto}" class="w-full h-full object-cover" />`
                        : `<span class="text-on-primary-container font-bold text-xs">${u.nome.split(' ').map(n => n[0]).join('')}</span>`
                      }
                    </div>
                    <span>${u.nome}</span>
                  </td>
                  <td class="py-sm px-sm text-on-surface-variant">${u.email}</td>
                  <td class="py-sm px-sm">${u.cargo}</td>
                  <td class="py-sm px-sm">${ROLES[u.role] || u.role}</td>
                  <td class="py-sm px-sm">
                    <span class="inline-block px-sm py-0.5 rounded-full text-xs font-bold ${u.ativo !== false ? 'bg-success-container text-on-success-container' : 'bg-error-container/50 text-on-error-container'}">
                      ${u.ativo !== false ? 'Sim' : 'Não'}
                    </span>
                  </td>
                  <td class="py-sm px-sm">
                    <div class="flex items-center gap-sm">
                      <button class="btn-editar-usuario text-primary hover:bg-primary-container/50 p-xs rounded-lg cursor-pointer transition-colors" data-user-id="${u.id}">
                        <span class="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button class="btn-remover-usuario text-error hover:bg-error-container/50 p-xs rounded-lg cursor-pointer transition-colors ${u.id === CURRENT_USER.id ? 'opacity-30 pointer-events-none' : ''}" data-user-id="${u.id}" ${u.id === CURRENT_USER.id ? 'disabled' : ''}>
                        <span class="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `
  }

  afterRender() {
    this.container.querySelectorAll('.config-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.state.activeTab = btn.dataset.tab
        this.render()
        this.afterRender()
      })
    })

    if (this.state.activeTab === 'perfil') {
      const avatarWrapper = this.container.querySelector('#avatar-wrapper')
      const fotoInput = this.container.querySelector('#foto-input')
      if (avatarWrapper && fotoInput) {
        avatarWrapper.addEventListener('click', () => fotoInput.click())
        fotoInput.addEventListener('change', (e) => {
          const file = e.target.files[0]
          if (!file) return
          const reader = new FileReader()
          reader.onload = (ev) => {
            setUserFoto(ev.target.result)
            this.render()
            this.afterRender()
          }
          reader.readAsDataURL(file)
        })
      }

      const btnSalvar = this.container.querySelector('#btn-salvar-perfil')
      if (btnSalvar) {
        btnSalvar.addEventListener('click', () => {
          const nome = this.container.querySelector('#perfil-nome').value.trim()
          const email = this.container.querySelector('#perfil-email').value.trim()
          const cargo = this.container.querySelector('#perfil-cargo').value.trim()
          const telefone = this.container.querySelector('#perfil-telefone').value.trim()
          if (!nome) { this._showToast('Nome é obrigatório!'); return }
          saveProfile({ nome, email, cargo, telefone })
          this._showToast('Perfil salvo com sucesso!')
          this.render()
          this.afterRender()
        })
      }
    }

    if (this.state.activeTab === 'seguranca') {
      const btnSalvarSenha = this.container.querySelector('#btn-salvar-senha')
      if (btnSalvarSenha) {
        btnSalvarSenha.addEventListener('click', () => {
          const atual = this.container.querySelector('#seg-senha-atual').value
          const nova = this.container.querySelector('#seg-nova-senha').value
          const confirmar = this.container.querySelector('#seg-confirmar-senha').value
          if (!atual || !nova || !confirmar) { this._showToast('Preencha todos os campos!'); return }
          if (nova !== confirmar) { this._showToast('Nova senha e confirmação não conferem!'); return }
          const result = changePassword(CURRENT_USER.id, atual, nova)
          if (result.error) { this._showToast(result.error); return }
          this.container.querySelector('#seg-senha-atual').value = ''
          this.container.querySelector('#seg-nova-senha').value = ''
          this.container.querySelector('#seg-confirmar-senha').value = ''
          this._showToast('Senha alterada com sucesso!')
        })
      }
    }

    if (this.state.activeTab === 'sistema') {
      const btnLogo = this.container.querySelector('#btn-sist-logo')
      const logoInput = this.container.querySelector('#sist-logo-input')
      if (btnLogo && logoInput) {
        btnLogo.addEventListener('click', () => logoInput.click())
        logoInput.addEventListener('change', async (e) => {
          const file = e.target.files[0]
          if (!file) return
          const dataUrl = await resizeImage(file)
          const preview = this.container.querySelector('#sist-logo-preview')
          if (preview) preview.innerHTML = `<img src="${dataUrl}" class="max-w-14 max-h-14 object-contain" />`
          logoInput.dataset.logo = dataUrl
        })
      }

      const btnSalvar = this.container.querySelector('#btn-salvar-sistema')
      if (btnSalvar) {
        btnSalvar.addEventListener('click', () => {
          const title = this.container.querySelector('#sist-titulo').value.trim() || 'TechSupport Ops'
          const subtitle = this.container.querySelector('#sist-subtitulo').value.trim() || 'Gestão de Infraestrutura'
          const logoInput = this.container.querySelector('#sist-logo-input')
          const logo = logoInput?.dataset?.logo || getSystemConfig().logo
          saveSystemConfig({ title, subtitle, logo })
          this.render()
          this.afterRender()
          this._showToast('Configurações do sistema salvas!')
        })
      }
    }

    if (this.state.activeTab === 'usuarios') {
      this._bindUsuariosEvents()
    }

    this.container.querySelectorAll('.config-toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.toggle
        this.state[key] = !this.state[key]
        this.render()
        this.afterRender()
      })
    })

    this._bindGerenciarEvents()

    const saveButtons = this.container.querySelectorAll('[class*="config-save-"]')
    saveButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        this._showToast('Configurações salvas com sucesso!')
      })
    })

    const selects = this.container.querySelectorAll('.config-select')
    selects.forEach((sel) => {
      sel.addEventListener('change', () => {
        const map = { lang: 'language', datefmt: 'dateFormat', tz: 'timezone' }
        this.state[map[sel.id]] = sel.value
      })
    })
  }

  _bindGerenciarEvents() {
    const catAdd = this.container.querySelector('.cat-add-btn')
    if (catAdd) {
      catAdd.addEventListener('click', () => {
        const id = this.container.querySelector('.cat-input-id').value.trim().toLowerCase().replace(/\s+/g, '-')
        const label = this.container.querySelector('.cat-input-label').value.trim()
        const bgColor = this.container.querySelector('.cat-input-bg').value
        const textColor = this.container.querySelector('.cat-input-text').value
        if (!id || !label) { this._showToast('Preencha ID e Nome da categoria!'); return }
        const exists = getCategories().find((c) => c.id === id)
        const data = { id, label, bgColor, textColor, borderColor: bgColor, dotColor: textColor, accentColor: textColor }
        if (exists) {
          updateCategory(id, data)
          this._showToast(`Categoria "${label}" atualizada!`)
        } else {
          addCategory(data)
          this._showToast(`Categoria "${label}" adicionada!`)
        }
        this.container.querySelector('.cat-input-id').value = ''
        this.container.querySelector('.cat-input-label').value = ''
        this.render()
        this.afterRender()
      })
    }

    this.container.querySelectorAll('.cat-del-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = btn.closest('[data-cat-id]').dataset.catId
        removeCategory(id)
        this._showToast('Categoria removida!')
        this.render()
        this.afterRender()
      })
    })

    this.container.querySelectorAll('.cat-edit-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.closest('[data-cat-id]').dataset.catId
        const cat = getCategories().find((c) => c.id === id)
        if (!cat) return
        this.container.querySelector('.cat-input-id').value = cat.id
        this.container.querySelector('.cat-input-label').value = cat.label
        this.container.querySelector('.cat-input-bg').value = cat.bgColor
        this.container.querySelector('.cat-input-text').value = cat.textColor
      })
    })

    const stAdd = this.container.querySelector('.st-add-btn')
    if (stAdd) {
      stAdd.addEventListener('click', () => {
        const id = this.container.querySelector('.st-input-id').value.trim()
        const label = this.container.querySelector('.st-input-label').value.trim()
        const bgColor = this.container.querySelector('.st-input-bg').value
        const textColor = this.container.querySelector('.st-input-text').value
        if (!id || !label) { this._showToast('Preencha ID e Nome do status!'); return }
        const exists = getStatuses().find((s) => s.id === id)
        if (exists) {
          updateStatus(id, { id, label, bgColor, textColor })
          this._showToast(`Status "${label}" atualizado!`)
        } else {
          addStatus({ id, label, bgColor, textColor })
          this._showToast(`Status "${label}" adicionado!`)
        }
        this.container.querySelector('.st-input-id').value = ''
        this.container.querySelector('.st-input-label').value = ''
        this.render()
        this.afterRender()
      })
    }

    this.container.querySelectorAll('.st-del-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.closest('[data-st-id]').dataset.stId
        removeStatus(id)
        this._showToast('Status removido!')
        this.render()
        this.afterRender()
      })
    })

    this.container.querySelectorAll('.st-edit-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.closest('[data-st-id]').dataset.stId
        const st = getStatuses().find((s) => s.id === id)
        if (!st) return
        this.container.querySelector('.st-input-id').value = st.id
        this.container.querySelector('.st-input-label').value = st.label
        this.container.querySelector('.st-input-bg').value = st.bgColor
        this.container.querySelector('.st-input-text').value = st.textColor
      })
    })
  }

  _bindUsuariosEvents() {
    this.container.querySelectorAll('.btn-editar-usuario').forEach((btn) => {
      btn.addEventListener('click', () => {
        const userId = btn.dataset.userId
        const users = getUsers()
        const user = users.find(u => u.id === userId)
        if (user) this._abrirModalUsuario(user)
      })
    })

    this.container.querySelectorAll('.btn-remover-usuario').forEach((btn) => {
      btn.addEventListener('click', () => {
        const userId = btn.dataset.userId
        const user = getUsers().find(u => u.id === userId)
        if (!user) return
        if (!confirm(`Tem certeza que deseja remover "${user.nome}"?`)) return
        removeUser(userId)
        this._showToast(`Usuário "${user.nome}" removido!`)
        this.render()
        this.afterRender()
      })
    })

    const btnNovo = this.container.querySelector('#btn-novo-usuario')
    if (btnNovo) {
      btnNovo.addEventListener('click', () => {
        this._abrirModalUsuario(null)
      })
    }

  }

  _abrirModalUsuario(user) {
    const isNew = !user
    const u = user || { nome: '', email: '', cargo: '', role: 'cliente', ativo: true, username: '' }

    const html = `
      <div id="modal-overlay-usuario" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div class="bg-surface rounded-2xl shadow-xl border border-outline-variant w-full max-w-lg mx-md max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between p-lg border-b border-outline-variant">
            <h3 class="font-display text-title-lg text-on-surface">${isNew ? 'Novo Usuário' : 'Editar Usuário'}</h3>
            <button class="btn-fechar-modal-usuario p-xs rounded-lg hover:bg-surface-container-low cursor-pointer transition-colors">
              <span class="material-symbols-outlined text-on-surface-variant">close</span>
            </button>
          </div>
          <div class="p-lg flex flex-col gap-md">
            ${isNew ? `
              <div class="flex flex-col gap-xs">
                <label class="font-label-md text-label-md text-on-surface-variant">Nome de Usuário *</label>
                <input id="modal-user-username" class="w-full bg-surface-container-low border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" value="${u.username}" />
              </div>
            ` : ''}
            <div class="flex flex-col gap-xs">
              <label class="font-label-md text-label-md text-on-surface-variant">Nome *</label>
              <input id="modal-user-nome" class="w-full bg-surface-container-low border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" value="${u.nome}" />
            </div>
            <div class="flex flex-col gap-xs">
              <label class="font-label-md text-label-md text-on-surface-variant">Email</label>
              <input id="modal-user-email" class="w-full bg-surface-container-low border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" value="${u.email}" />
            </div>
            <div class="flex flex-col gap-xs">
              <label class="font-label-md text-label-md text-on-surface-variant">Cargo</label>
              <input id="modal-user-cargo" class="w-full bg-surface-container-low border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" value="${u.cargo}" />
            </div>
            <div class="flex flex-col gap-xs">
              <label class="font-label-md text-label-md text-on-surface-variant">Função</label>
              <select id="modal-user-role" class="w-full bg-surface-container-low border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer">
                ${Object.entries(ROLES).map(([val, label]) =>
                  `<option value="${val}" ${u.role === val ? 'selected' : ''}>${label}</option>`
                ).join('')}
              </select>
            </div>
            <div class="flex items-center gap-sm">
              <input id="modal-user-ativo" type="checkbox" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer" ${u.ativo !== false ? 'checked' : ''} />
              <label for="modal-user-ativo" class="font-label-md text-label-md text-on-surface cursor-pointer">Usuário Ativo</label>
            </div>
            <div class="flex flex-col gap-xs">
              <label class="font-label-md text-label-md text-on-surface-variant">${isNew ? 'Senha' : 'Nova Senha (deixe em branco para manter)'}</label>
              <input id="modal-user-senha" class="w-full bg-surface-container-low border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" type="password" autocomplete="new-password" />
            </div>
          </div>
          <div class="flex justify-end gap-sm p-lg border-t border-outline-variant">
            <button id="btn-cancelar-modal-usuario" class="px-lg py-sm rounded-lg border border-outline-variant text-on-surface font-label-md text-label-md cursor-pointer hover:bg-surface-container-low transition-colors">
              Cancelar
            </button>
            <button id="btn-salvar-modal-usuario" data-user-id="${isNew ? 'new' : u.id}" class="px-lg py-sm rounded-lg bg-primary text-on-primary font-label-md text-label-md cursor-pointer hover:opacity-90 transition-opacity">
              ${isNew ? 'Criar Usuário' : 'Salvar Alterações'}
            </button>
          </div>
        </div>
      </div>
    `

    const wrapper = document.createElement('div')
    wrapper.innerHTML = html
    const overlay = wrapper.firstElementChild
    document.body.appendChild(overlay)

    overlay.querySelector('.btn-fechar-modal-usuario')?.addEventListener('click', () => this._fecharModalUsuario())
    overlay.querySelector('#btn-cancelar-modal-usuario')?.addEventListener('click', () => this._fecharModalUsuario())
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this._fecharModalUsuario()
    })

    overlay.querySelector('#btn-salvar-modal-usuario')?.addEventListener('click', () => {
      const id = overlay.querySelector('#btn-salvar-modal-usuario').dataset.userId
      const nome = overlay.querySelector('#modal-user-nome').value.trim()
      const email = overlay.querySelector('#modal-user-email').value.trim()
      const cargo = overlay.querySelector('#modal-user-cargo').value.trim()
      const role = overlay.querySelector('#modal-user-role').value
      const ativo = overlay.querySelector('#modal-user-ativo').checked
      const senha = overlay.querySelector('#modal-user-senha').value

      if (!nome) { this._showToast('Nome é obrigatório!'); return }

      const data = { nome, email, cargo, role, ativo }

      if (id === 'new') {
        const username = overlay.querySelector('#modal-user-username')?.value.trim()
        if (!username) { this._showToast('Nome de usuário é obrigatório!'); return }
        data.username = username
        data.password = senha || '123456'
        addUser(data)
        this._showToast('Usuário criado com sucesso!')
      } else {
        if (senha) data.password = senha
        updateUser(id, data)
        this._showToast('Usuário atualizado com sucesso!')
      }

      this._fecharModalUsuario()
      this.render()
      this.afterRender()
    })

    setTimeout(() => {
      const firstInput = overlay.querySelector('input')
      if (firstInput) firstInput.focus()
    }, 100)
  }

  _fecharModalUsuario() {
    const overlay = document.querySelector('#modal-overlay-usuario')
    if (overlay) overlay.remove()
  }

  _showToast(msg) {
    const existing = document.getElementById('toast')
    if (existing) existing.remove()
    const toast = document.createElement('div')
    toast.id = 'toast'
    toast.className =
      'fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-lg py-sm rounded-lg shadow-lg font-body-md text-body-md z-50 animate-fade-in'
    toast.textContent = msg
    document.body.appendChild(toast)
    setTimeout(() => {
      toast.style.opacity = '0'
      toast.style.transition = 'opacity 0.3s'
      setTimeout(() => toast.remove(), 300)
    }, 2500)
  }
}

import Component from '../lib/Component.js'
import { login, getSystemConfig } from '../data/tickets.js'

export default class Login extends Component {
  constructor(containerId, props) {
    super(containerId, props)
    this.state = { error: '' }
  }

  template() {
    const config = getSystemConfig()
    const logoHtml = config.logo
      ? `<img src="${config.logo}" class="h-12 w-auto mb-md" alt="Logo" />`
      : `<span class="material-symbols-outlined fill text-primary text-5xl mb-md">settings_suggest</span>`
    return `
      <div class="w-full h-full bg-background flex items-center justify-center p-md">
        <div class="w-full max-w-sm">
          <div class="bg-surface border border-outline-variant rounded-2xl shadow-xl p-xl">
            <div class="flex flex-col items-center mb-lg">
              ${logoHtml}
              <h1 class="font-display text-headline-md font-bold text-primary text-center">${config.title}</h1>
              <p class="font-body-md text-body-md text-on-surface-variant text-center mt-xs">${config.subtitle}</p>
            </div>

            <form id="login-form" class="flex flex-col gap-md">
              <div class="flex flex-col gap-xs">
                <label class="font-label-md text-label-md text-on-surface-variant" for="login-user">Usuário</label>
                <input
                  id="login-user"
                  type="text"
                  autocomplete="username"
                  class="w-full bg-surface-container-low border border-outline-variant rounded-lg py-sm px-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="Digite seu usuário"
                  required
                />
              </div>
              <div class="flex flex-col gap-xs">
                <label class="font-label-md text-label-md text-on-surface-variant" for="login-pass">Senha</label>
                <input
                  id="login-pass"
                  type="password"
                  autocomplete="current-password"
                  class="w-full bg-surface-container-low border border-outline-variant rounded-lg py-sm px-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="Digite sua senha"
                  required
                />
              </div>

              ${this.state.error ? `<p class="font-body-md text-body-md text-error text-center">${this.state.error}</p>` : ''}

              <button
                type="submit"
                class="w-full py-sm rounded-lg bg-primary text-on-primary font-label-md text-label-md cursor-pointer hover:opacity-90 transition-opacity mt-sm"
              >
                Entrar
              </button>
            </form>

            <p class="font-body-md text-[11px] text-on-surface-variant text-center mt-lg">
              Suporte Técnico — Acesso restrito
            </p>
          </div>
        </div>
      </div>
    `
  }

  afterRender() {
    const form = this.container.querySelector('#login-form')
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault()
        const username = document.getElementById('login-user').value.trim()
        const password = document.getElementById('login-pass').value.trim()
        if (!username || !password) {
          this.state.error = 'Preencha usuário e senha.'
          this.render()
          this.afterRender()
          return
        }
        const user = login(username, password)
        if (user) {
          if (this.props.onLogin) this.props.onLogin(user)
        } else {
          this.state.error = 'Usuário ou senha inválidos.'
          this.render()
          this.afterRender()
        }
      })
    }
  }
}

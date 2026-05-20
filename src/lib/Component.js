export default class Component {
  constructor(containerId, props = {}) {
    this.container = document.getElementById(containerId)
    this.props = props
    this.state = {}
  }

  setState(newState) {
    Object.assign(this.state, newState)
    this.render()
  }

  render() {
    if (this.container) {
      this.container.innerHTML = this.template()
    }
  }

  template() {
    return ''
  }

  mount() {
    this.render()
    this.afterRender()
  }

  afterRender() {
  }

  on(event, selector, handler) {
    this.container.addEventListener(event, (e) => {
      const target = e.target.closest(selector)
      if (target && this.container.contains(target)) {
        handler(e, target)
      }
    })
  }
}

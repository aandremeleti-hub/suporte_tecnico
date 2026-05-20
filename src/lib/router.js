const routes = {}
let currentRoute = null

export function registerRoute(name, config) {
  routes[name] = config
}

export function navigateTo(name) {
  window.location.hash = name
}

export function getActiveRoute() {
  const hash = window.location.hash.replace('#', '') || 'dashboard'
  return routes[hash] ? hash : 'dashboard'
}

export function initRouter(onChange) {
  const hash = window.location.hash.replace('#', '') || 'dashboard'
  if (!routes[hash]) {
    window.location.hash = 'dashboard'
    return
  }

  window.addEventListener('hashchange', () => {
    const route = getActiveRoute()
    if (route !== currentRoute) {
      currentRoute = route
      onChange(route)
    }
  })

  currentRoute = getActiveRoute()
  onChange(currentRoute)
}

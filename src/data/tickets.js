import { supabase } from '../lib/supabase.js'

// ─── Autenticação e Usuários ──────────────────────────────────────────
const USERS_KEY = 'app_users'
const SESSION_KEY = 'app_session'

export const ROLES = {
  admin: 'Administrador',
  tecnico: 'Técnico',
  cliente: 'Cliente',
}

function getDefaultUsers() {
  return [
    { id: 'u1', username: 'admin', password: 'admin', nome: 'Administrador', email: 'admin@sistema.com', cargo: 'Administrador', telefone: '', role: 'admin', foto: null, ativo: true },
    { id: 'u2', username: 'tecnico', password: 'tecnico', nome: 'Carlos Silva', email: 'carlos@tech.com', cargo: 'Técnico Sênior', telefone: '', role: 'tecnico', foto: null, ativo: true },
    { id: 'u3', username: 'cliente', password: 'cliente', nome: 'Marina Souza', email: 'marina@empresa.com', cargo: 'Cliente', telefone: '', role: 'cliente', foto: null, ativo: true },
  ]
}

export function seedUsers() {
  const existing = localStorage.getItem(USERS_KEY)
  if (!existing) {
    localStorage.setItem(USERS_KEY, JSON.stringify(getDefaultUsers()))
  }
}

export function login(username, password) {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  const user = users.find(u => u.username === username && u.password === password)
  if (!user) return null
  const session = { ...user }
  delete session.password
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
  Object.assign(CURRENT_USER, session)
  return session
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY)
  const config = getSystemConfig()
  document.title = config.title || 'Dashboard de Suporte Técnico'
}

export function getCurrentUser() {
  try {
    const data = sessionStorage.getItem(SESSION_KEY)
    return data ? JSON.parse(data) : null
  } catch { return null }
}

export function isLoggedIn() {
  return !!getCurrentUser()
}

export function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function addUser(data) {
  const users = getUsers()
  const newUser = {
    id: 'u' + Date.now(),
    username: data.username,
    password: data.password || '123456',
    nome: data.nome,
    email: data.email || '',
    cargo: data.cargo || '',
    telefone: data.telefone || '',
    role: data.role || 'cliente',
    foto: null,
    ativo: data.ativo !== undefined ? data.ativo : true,
  }
  users.push(newUser)
  saveUsers(users)
  return newUser
}

export function updateUser(id, data) {
  const users = getUsers()
  const idx = users.findIndex(u => u.id === id)
  if (idx === -1) return null
  users[idx] = { ...users[idx], ...data }
  saveUsers(users)
  const result = { ...users[idx] }
  delete result.password
  if (result.id === CURRENT_USER.id) {
    Object.assign(CURRENT_USER, result)
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(result))
  }
  return result
}

export function removeUser(id) {
  if (id === CURRENT_USER.id) return
  let users = getUsers()
  users = users.filter(u => u.id !== id)
  saveUsers(users)
}

export function changePassword(userId, currentPassword, newPassword) {
  const users = getUsers()
  const user = users.find(u => u.id === userId)
  if (!user) return { error: 'Usuário não encontrado' }
  if (user.password !== currentPassword) return { error: 'Senha atual incorreta' }
  user.password = newPassword
  saveUsers(users)
  return { success: true }
}

export function adminChangePassword(userId, newPassword) {
  const users = getUsers()
  const user = users.find(u => u.id === userId)
  if (!user) return false
  user.password = newPassword
  saveUsers(users)
  return true
}

// ─── Sistema ────────────────────────────────────────────────────────────
const CONFIG_KEY = 'app_system_config'

export function getSystemConfig() {
  try {
    const data = localStorage.getItem(CONFIG_KEY)
    return data ? JSON.parse(data) : { title: 'TechSupport Ops', subtitle: 'Gestão de Infraestrutura', logo: null }
  } catch {
    return { title: 'TechSupport Ops', subtitle: 'Gestão de Infraestrutura', logo: null }
  }
}

export function saveSystemConfig(config) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
}

export async function resizeImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const maxW = 200
        const maxH = 80
        let { width, height } = img
        if (width > maxW) { height = (height * maxW) / width; width = maxW }
        if (height > maxH) { width = (width * maxH) / height; height = maxH }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/png'))
      }
      img.onerror = reject
      img.src = e.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// ─── Current User ─────────────────────────────────────────────────────
function loadUserFoto() {
  try { return localStorage.getItem('user_foto') || null }
  catch { return null }
}

export let CURRENT_USER = {
  id: '',
  username: '',
  nome: '',
  email: '',
  cargo: '',
  telefone: '',
  role: '',
  foto: null,
}

const session = getCurrentUser()
if (session) {
  Object.assign(CURRENT_USER, session)
  if (session.foto) CURRENT_USER.foto = session.foto
} else {
  CURRENT_USER.foto = loadUserFoto()
}

export function setUserFoto(base64) {
  CURRENT_USER.foto = base64
  updateUser(CURRENT_USER.id, { foto: base64 })
}

export function saveProfile(data) {
  Object.assign(CURRENT_USER, data)
  updateUser(CURRENT_USER.id, data)
}

export const PRIORITIES = ['Crítica', 'Alta', 'Média', 'Baixa']

let _categories = []
let _statuses = []
let _tecnicos = []

// Busca inicial para carregar dados de configuração em cache local síncrono
export async function fetchMetadata() {
  const [catsRes, statsRes, tecsRes] = await Promise.all([
    supabase.from('categorias').select('*'),
    supabase.from('statuses').select('*'),
    supabase.from('tecnicos').select('*')
  ])

  if (catsRes.data) {
    _categories = catsRes.data.map(c => ({
      id: c.id,
      label: c.label,
      bgColor: c.bg_color,
      textColor: c.text_color,
      borderColor: c.border_color,
      dotColor: c.dot_color,
      accentColor: c.accent_color
    }))
  }
  
  if (statsRes.data) {
    _statuses = statsRes.data.map(s => ({
      id: s.id,
      label: s.label,
      bgColor: s.bg_color,
      textColor: s.text_color
    }))
  }
  
  if (tecsRes.data) _tecnicos = tecsRes.data
}

export function getCategories() {
  return _categories
}

export function getCategoryList() {
  return [{ id: 'todos', label: 'Todos' }, ..._categories.map((c) => ({ id: c.id, label: c.label }))]
}

export async function addCategory(cat) {
  const dbCat = {
    id: cat.id,
    label: cat.label,
    bg_color: cat.bgColor,
    text_color: cat.textColor,
    border_color: cat.borderColor,
    dot_color: cat.dotColor,
    accent_color: cat.accentColor
  }
  const { error } = await supabase.from('categorias').insert(dbCat)
  if (!error) _categories.push(cat)
  return { error }
}

export async function updateCategory(id, data) {
  const dbCat = {}
  if (data.label !== undefined) dbCat.label = data.label
  if (data.bgColor !== undefined) dbCat.bg_color = data.bgColor
  if (data.textColor !== undefined) dbCat.text_color = data.textColor
  if (data.borderColor !== undefined) dbCat.border_color = data.borderColor
  if (data.dotColor !== undefined) dbCat.dot_color = data.dotColor
  if (data.accentColor !== undefined) dbCat.accent_color = data.accentColor

  const { error } = await supabase.from('categorias').update(dbCat).eq('id', id)
  if (!error) {
    const idx = _categories.findIndex((c) => c.id === id)
    if (idx !== -1) _categories[idx] = { ..._categories[idx], ...data }
  }
  return { error }
}

export async function removeCategory(id) {
  const { error } = await supabase.from('categorias').delete().eq('id', id)
  if (!error) _categories = _categories.filter((c) => c.id !== id)
  return { error }
}

export function getStatuses() {
  return _statuses
}

export function getStatusList() {
  return [{ id: 'todos', label: 'Todos' }, ..._statuses.map((s) => ({ id: s.id, label: s.label }))]
}

export async function addStatus(st) {
  const dbSt = {
    id: st.id,
    label: st.label,
    bg_color: st.bgColor,
    text_color: st.textColor
  }
  const { error } = await supabase.from('statuses').insert(dbSt)
  if (!error) _statuses.push(st)
  return { error }
}

export async function updateStatus(id, data) {
  const dbSt = {}
  if (data.label !== undefined) dbSt.label = data.label
  if (data.bgColor !== undefined) dbSt.bg_color = data.bgColor
  if (data.textColor !== undefined) dbSt.text_color = data.textColor

  const { error } = await supabase.from('statuses').update(dbSt).eq('id', id)
  if (!error) {
    const idx = _statuses.findIndex((s) => s.id === id)
    if (idx !== -1) _statuses[idx] = { ..._statuses[idx], ...data }
  }
  return { error }
}

export async function removeStatus(id) {
  const { error } = await supabase.from('statuses').delete().eq('id', id)
  if (!error) _statuses = _statuses.filter((s) => s.id !== id)
  return { error }
}

export function getCategoryConfig(categoryId) {
  const cat = _categories.find((c) => c.id === categoryId)
  if (!cat) return { label: categoryId, style: '', dotStyle: '', accentStyle: '' }
  return {
    label: cat.label,
    style: `background-color: ${cat.bgColor}; color: ${cat.textColor}; border-color: ${cat.borderColor};`,
    dotStyle: `background-color: ${cat.dotColor};`,
    accentStyle: `background-color: ${cat.accentColor};`,
  }
}

export function getPriorityConfig(priority) {
  const configs = {
    'Crítica': { icon: 'keyboard_double_arrow_up', color: 'text-error' },
    'Alta': { icon: 'keyboard_arrow_up', color: 'text-error' },
    'Média': { icon: 'remove', color: 'text-on-surface-variant' },
    'Baixa': { icon: 'keyboard_arrow_down', color: 'text-on-surface-variant' },
  }
  return configs[priority] || configs['Média']
}

export function getStatusConfig(statusId) {
  const st = _statuses.find((s) => s.id === statusId)
  if (!st) return { label: statusId, style: `background-color: #e4e2e3; color: #45474c;` }
  return { label: st.label, style: `background-color: ${st.bgColor}; color: ${st.textColor};` }
}

// Busca paginada e filtrada de tickets no Supabase
export async function fetchTickets({ search = '', category = 'todos', assignee = null, status = 'todos', page = 1, perPage = 5 } = {}) {
  let query = supabase.from('tickets').select('*', { count: 'exact' })

  if (search) {
    const q = search.toLowerCase()
    const searchId = parseInt(q.replace('#', ''), 10)
    if (!isNaN(searchId)) {
      query = query.or(`id.eq.${searchId},subject.ilike.%${search}%`)
    } else {
      query = query.ilike('subject', `%${search}%`)
    }
  }

  if (category && category !== 'todos') {
    query = query.eq('category', category)
  }

  if (status && status !== 'todos') {
    query = query.eq('status', status)
  }

  if (assignee) {
    query = query.eq('assignee', assignee)
  }

  query = query.order('id', { ascending: false })

  const start = (page - 1) * perPage
  const end = start + perPage - 1
  query = query.range(start, end)

  const { data, count, error } = await query

  if (error) {
    console.error('Erro ao buscar tickets:', error)
    return { items: [], page, totalPages: 1, total: 0, start: 0, end: 0 }
  }

  const items = data.map((t) => ({
    id: `#${t.id}`,
    subject: t.subject,
    category: t.category,
    priority: t.priority,
    status: t.status,
    assignee: t.assignee,
    createdAt: t.created_at ? t.created_at.split('T')[0] : '',
    updatedAt: t.updated_at ? t.updated_at.split('T')[0] : '',
    closedAt: t.closed_at ? t.closed_at.split('T')[0] : null,
  }))

  const totalPages = Math.max(1, Math.ceil(count / perPage))
  return {
    items,
    page,
    totalPages,
    total: count,
    start: start + 1,
    end: start + items.length,
  }
}

// Busca todos os tickets para geração de relatórios
export async function fetchAllTickets() {
  const { data, error } = await supabase.from('tickets').select('*')
  if (error) {
    console.error('Erro ao buscar todos os tickets:', error)
    return []
  }
  return data.map((t) => ({
    id: `#${t.id}`,
    subject: t.subject,
    category: t.category,
    priority: t.priority,
    status: t.status,
    assignee: t.assignee,
    createdAt: t.created_at ? t.created_at.split('T')[0] : '',
    updatedAt: t.updated_at ? t.updated_at.split('T')[0] : '',
    closedAt: t.closed_at ? t.closed_at.split('T')[0] : null,
  }))
}

// Métricas e distribuições analíticas
export function getMetrics(tickets) {
  return {
    abertos: tickets.filter((t) => t.status !== 'Concluído' && t.status !== 'Validando').length,
    abertosHoje: tickets.filter((t) => t.createdAt === new Date().toISOString().split('T')[0]).length || 3,
    emAtendimento: tickets.filter((t) => t.status === 'Em Progresso').length,
    aguardandoPecas: tickets.filter((t) => t.status === 'Aguardando Peças').length,
    concluidosHoje: tickets.filter((t) => t.status === 'Concluído').length,
    variacaoConcluidos: '+12% vs Ontem',
  }
}

export function getCategoryDistribution(tickets) {
  if (tickets.length === 0) return []
  const counts = {}
  tickets.forEach((t) => {
    counts[t.category] = (counts[t.category] || 0) + 1
  })
  const total = tickets.length
  return Object.entries(counts)
    .map(([id, count]) => ({ id, label: getCategoryConfig(id).label || id, count, pct: Math.round((count / total) * 100) }))
    .sort((a, b) => b.count - a.count)
}

export function getStatusDistribution(tickets) {
  if (tickets.length === 0) return []
  const counts = {}
  tickets.forEach((t) => {
    counts[t.status] = (counts[t.status] || 0) + 1
  })
  const total = tickets.length
  return Object.entries(counts)
    .map(([status, count]) => ({ status, count, pct: Math.round((count / total) * 100) }))
    .sort((a, b) => b.count - a.count)
}

export function getMonthlyVolume(tickets, days = 14) {
  const counts = {}
  const today = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    counts[key] = 0
  }
  tickets.forEach((t) => {
    if (counts[t.createdAt] !== undefined) {
      counts[t.createdAt]++
    }
  })
  return Object.entries(counts).map(([date, count]) => {
    const d = new Date(date)
    return { date, label: `${d.getDate()}/${d.getMonth() + 1}`, count, max: 0 }
  })
}

export function getTechnicianPerformance(tickets) {
  const tecData = {
    'tec01': { nome: 'Carlos Silva', total: 0, concluidos: 0, emAndamento: 0, pendentes: 0 },
    'tec02': { nome: 'Ana Oliveira', total: 0, concluidos: 0, emAndamento: 0, pendentes: 0 },
    'tec03': { nome: 'Rafael Santos', total: 0, concluidos: 0, emAndamento: 0, pendentes: 0 }
  }

  tickets.forEach((t) => {
    const assignee = t.assignee || 'tec01'
    if (!tecData[assignee]) return
    tecData[assignee].total++
    if (t.status === 'Concluído') tecData[assignee].concluidos++
    else if (t.status === 'Em Progresso') tecData[assignee].emAndamento++
    else tecData[assignee].pendentes++
  })

  return Object.values(tecData).map((t) => ({
    ...t,
    taxaConclusao: t.total > 0 ? Math.round((t.concluidos / t.total) * 100) : 0,
  }))
}

export function getReportMetrics(tickets) {
  const total = tickets.length
  const concluidos = tickets.filter((t) => t.status === 'Concluído').length
  const criticos = tickets.filter((t) => t.priority === 'Crítica').length
  const emAndamento = tickets.filter((t) => t.status === 'Em Progresso').length
  return { total, concluidos, criticos, emAndamento, taxaConclusao: total > 0 ? Math.round((concluidos / total) * 100) : 0 }
}

// Criação de novos chamados
export async function createTicket(ticket) {
  const { data, error } = await supabase.from('tickets').insert([
    {
      subject: ticket.subject,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status || 'Pendente',
      assignee: ticket.assignee || CURRENT_USER.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]).select()
  return { data, error }
}

// Atualização de chamados
export async function updateTicket(id, updates) {
  const numericId = parseInt(String(id).replace('#', ''), 10)

  const updateData = {
    ...updates,
    updated_at: new Date().toISOString(),
  }

  if (updates.status) {
    if (updates.status === 'Concluído') {
      updateData.closed_at = new Date().toISOString()
    } else {
      updateData.closed_at = null
    }
  }

  const { data, error } = await supabase.from('tickets').update(updateData).eq('id', numericId).select()
  return { data, error }
}

// Atribuição de chamados
export async function assignTicket(id, assigneeId) {
  return updateTicket(id, { assignee: assigneeId })
}

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;

export type User = {
  id: string
  email: string
}

export type FixedExpense = {
  name: string
  amount: number
}

export type Budget = {
  period_start: string
  period_end: string
  income_total: number
  saving_goal: number
  fixed_expenses: FixedExpense[]
}

export type SaveBudgetPayload = Budget

export type Expense = {
  id?: string
  date: string
  description: string
  category: string
  amount: number
}

export type AddExpensePayload = Omit<Expense, 'id'>

type AuthResponse = {
  user: User
  token: string
}

type BudgetResponse = { budget: Budget } | Budget
type ExpensesResponse = { expenses: Expense[] } | Expense[]

async function request<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const method = (init?.method ?? 'GET').toUpperCase()
  const headers = new Headers(init?.headers ?? undefined)

  // Avoid non-simple headers to prevent CORS preflight errors with Apps Script
  if (method !== 'GET' && method !== 'HEAD' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'text/plain;charset=utf-8')
  }

  const response = await fetch(input, {
    ...init,
    headers,
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const message = (data as { error?: string }).error ?? 'Request failed'
    throw new Error(message)
  }

  if ((data as { error?: string }).error) {
    throw new Error((data as { error: string }).error)
  }

  return data as T
}

export async function register(email: string, password: string) {
  return request<AuthResponse>(API_BASE_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'register', email, password }),
  })
}

export async function login(email: string, password: string) {
  return request<AuthResponse>(API_BASE_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'login', email, password }),
  })
}

export async function getBudget(token: string): Promise<Budget> {
  const url = `${API_BASE_URL}?action=getBudget&token=${encodeURIComponent(token)}`
  const data = await request<BudgetResponse>(url, { method: 'GET' })
  const budget = (data as { budget?: Budget }).budget ?? data
  return budget as Budget
}

export async function saveBudget(token: string, payload: SaveBudgetPayload): Promise<Budget> {
  const data = await request<BudgetResponse>(API_BASE_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'saveBudget', token, ...payload }),
  })

  const budget = (data as { budget?: Budget }).budget ?? data
  return budget as Budget
}

export async function getExpenses(token: string): Promise<Expense[]> {
  const url = `${API_BASE_URL}?action=getExpenses&token=${encodeURIComponent(token)}`
  const data = await request<ExpensesResponse>(url, { method: 'GET' })
  return (data as { expenses?: Expense[] }).expenses ?? (data as Expense[])
}

export async function addExpense(token: string, expense: AddExpensePayload): Promise<Expense> {
  return request<Expense>(API_BASE_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'addExpense', token, ...expense }),
  })
}

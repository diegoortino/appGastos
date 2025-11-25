import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addExpense, getExpenses } from '../api/client'
import type { Expense } from '../api/client'
import { useAuth } from '../hooks/useAuth'
import ExpenseForm from '../components/forms/ExpenseForm'

export default function ExpensesPage() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()

  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleApiError = (message: string) => {
    if (message.toLowerCase().includes('invalid token')) {
      logout()
      navigate('/login')
      return true
    }
    return false
  }

  const loadExpenses = async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const list = await getExpenses(token)
      setExpenses(list)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar gastos'
      if (handleApiError(message)) return
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadExpenses()
  }, [token])

  const handleAddExpense = async (payload: Omit<Expense, 'id'>) => {
    if (!token) return
    setSaving(true)
    setError(null)
    try {
      const created = await addExpense(token, payload)
      setExpenses((prev) => [...prev, created])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No pudimos agregar el gasto'
      if (handleApiError(message)) return
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid" style={{ gap: 18 }}>
      <div className="heading">
        <div>
          <h2 className="title">Gastos</h2>
          <p className="subtitle">Lista de gastos diarios y formulario de alta rapida.</p>
        </div>
        <button className="btn secondary" onClick={loadExpenses} disabled={loading}>
          Recargar
        </button>
      </div>

      <div className="card">
        <ExpenseForm onSubmit={handleAddExpense} loading={saving} error={error} />
      </div>

      <div className="card">
        <div className="heading">
          <h3 className="title" style={{ fontSize: 20 }}>
            Historial
          </h3>
          <span className="pill">Total {expenses.length}</span>
        </div>
        {loading ? (
          <p className="loader">Cargando gastos...</p>
        ) : expenses.length === 0 ? (
          <p className="empty">No hay gastos registrados.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Descripcion</th>
                <th>Categoria</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              {expenses
                .slice()
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((expense) => (
                  <tr key={`${expense.id ?? expense.description}-${expense.date}`} className="table-row">
                    <td>{expense.date}</td>
                    <td>{expense.description}</td>
                    <td className="muted">{expense.category}</td>
                    <td>
                      {expense.amount.toLocaleString('es-AR', {
                        style: 'currency',
                        currency: 'ARS',
                        maximumFractionDigits: 0,
                      })}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

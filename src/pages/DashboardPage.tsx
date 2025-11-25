import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBudget, getExpenses } from '../api/client'
import type { Budget, Expense } from '../api/client'
import { useAuth } from '../hooks/useAuth'

export default function DashboardPage() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  const [budget, setBudget] = useState<Budget | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleApiError = (message: string) => {
    if (message.toLowerCase().includes('invalid token')) {
      logout()
      navigate('/login')
      return true
    }
    return false
  }

  useEffect(() => {
    const load = async () => {
      if (!token) return
      setLoading(true)
      setError(null)
      try {
        const [budgetResponse, expensesResponse] = await Promise.all([
          getBudget(token),
          getExpenses(token),
        ])
        setBudget(budgetResponse)
        setExpenses(expensesResponse)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al cargar datos'
        if (handleApiError(message)) return
        if (message === 'No budget found') {
          setBudget(null)
        } else {
          setError(message)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [token])

  const fixedTotal = useMemo(
    () => (budget?.fixed_expenses ?? []).reduce((acc, item) => acc + (item.amount || 0), 0),
    [budget],
  )

  const expensesTotal = useMemo(
    () => expenses.reduce((acc, item) => acc + (item.amount || 0), 0),
    [expenses],
  )

  const available = useMemo(() => {
    const income = budget?.income_total ?? 0
    const saving = budget?.saving_goal ?? 0
    return income - saving - fixedTotal - expensesTotal
  }, [budget, fixedTotal, expensesTotal])

  const highlight = [
    {
      label: 'Ingreso total',
      value: budget?.income_total ?? 0,
    },
    {
      label: 'Gasto fijo',
      value: fixedTotal,
    },
    {
      label: 'Objetivo ahorro',
      value: budget?.saving_goal ?? 0,
    },
    {
      label: 'Gasto variable',
      value: expensesTotal,
    },
  ]

  return (
    <div className="grid" style={{ gap: 18 }}>
      <div className="heading">
        <div>
          <h2 className="title">Dashboard</h2>
          <p className="subtitle">Resumen del periodo y actividad reciente</p>
        </div>
      </div>

      {loading ? (
        <p className="loader">Cargando datos...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : null}

      <div className="grid two">
        <div className="card">
          <div className="heading">
            <h3 className="title" style={{ fontSize: 20 }}>
              Saldo disponible
            </h3>
            <span className="badge">{available.toLocaleString('es-AR')}</span>
          </div>
          <p className="subtitle">
            Calculado restando ahorro objetivo, gastos fijos y gastos registrados al ingreso total.
          </p>
          <div className="grid" style={{ marginTop: 14 }}>
            {highlight.map((item) => (
              <div
                key={item.label}
                className="card"
                style={{ background: '#0b1226', borderColor: '#1c233b' }}
              >
                <p className="subtitle" style={{ marginBottom: 4 }}>
                  {item.label}
                </p>
                <strong style={{ fontSize: 18 }}>
                  {item.value.toLocaleString('es-AR', {
                    style: 'currency',
                    currency: 'ARS',
                    maximumFractionDigits: 0,
                  })}
                </strong>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="heading">
            <h3 className="title" style={{ fontSize: 20 }}>
              Gastos recientes
            </h3>
            <span className="pill">Total {expenses.length}</span>
          </div>
          {expenses.length === 0 ? (
            <p className="empty">Todavia no registraste gastos.</p>
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
                {expenses.slice(-5).reverse().map((expense) => (
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
    </div>
  )
}

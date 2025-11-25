import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBudget, saveBudget } from '../api/client'
import type { Budget, SaveBudgetPayload } from '../api/client'
import { useAuth } from '../hooks/useAuth'
import BudgetForm from '../components/forms/BudgetForm'

export default function BudgetPage() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()

  const [budget, setBudget] = useState<Budget | undefined>()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleApiError = (message: string) => {
    if (message.toLowerCase().includes('invalid token')) {
      logout()
      navigate('/login')
      return true
    }
    return false
  }

  useEffect(() => {
    const loadBudget = async () => {
      if (!token) return
      setLoading(true)
      setError(null)
      try {
        const response = await getBudget(token)
        setBudget(response)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al cargar presupuesto'
        if (handleApiError(message)) return
        if (message === 'No budget found') {
          setBudget(undefined)
        } else {
          setError(message)
        }
      } finally {
        setLoading(false)
      }
    }
    loadBudget()
  }, [token])

  const handleSubmit = async (payload: SaveBudgetPayload) => {
    if (!token) return
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const saved = await saveBudget(token, payload)
      setBudget(saved)
      setSuccess('Presupuesto guardado')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No pudimos guardar el presupuesto'
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
          <h2 className="title">Presupuesto</h2>
          <p className="subtitle">
            Define el ingreso mensual, ahorro objetivo y tus gastos fijos para este periodo.
          </p>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <p className="loader">Cargando presupuesto...</p>
        ) : (
          <BudgetForm
            initialData={budget}
            onSubmit={handleSubmit}
            loading={saving}
            error={error}
            success={success}
          />
        )}
      </div>
    </div>
  )
}

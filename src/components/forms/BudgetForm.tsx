import { useEffect, useState, type FormEvent } from 'react'
import type { SaveBudgetPayload } from '../../api/client'

type BudgetFormProps = {
  initialData?: SaveBudgetPayload
  onSubmit: (payload: SaveBudgetPayload) => Promise<void> | void
  loading?: boolean
  error?: string | null
  success?: string | null
}

const emptyExpense = { name: '', amount: 0 }

export default function BudgetForm({
  initialData,
  onSubmit,
  loading,
  error,
  success,
}: BudgetFormProps) {
  const [form, setForm] = useState<SaveBudgetPayload>({
    period_start: '',
    period_end: '',
    income_total: 0,
    saving_goal: 0,
    fixed_expenses: [emptyExpense],
  })

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        fixed_expenses: initialData.fixed_expenses?.length
          ? initialData.fixed_expenses
          : [emptyExpense],
      })
    }
  }, [initialData])

  const handleChange = (field: keyof Omit<SaveBudgetPayload, 'fixed_expenses'>, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === 'income_total' || field === 'saving_goal' ? Number(value) : value,
    }))
  }

  const handleFixedExpenseChange = (index: number, key: 'name' | 'amount', value: string) => {
    setForm((prev) => {
      const next = [...prev.fixed_expenses]
      next[index] = {
        ...next[index],
        [key]: key === 'amount' ? Number(value) : value,
      }
      return { ...prev, fixed_expenses: next }
    })
  }

  const addFixedExpense = () => {
    setForm((prev) => ({ ...prev, fixed_expenses: [...prev.fixed_expenses, emptyExpense] }))
  }

  const removeFixedExpense = (index: number) => {
    setForm((prev) => ({
      ...prev,
      fixed_expenses: prev.fixed_expenses.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    await onSubmit(form)
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="grid two">
        <div className="field">
          <label htmlFor="period_start">Inicio del periodo</label>
          <input
            id="period_start"
            type="date"
            value={form.period_start}
            onChange={(e) => handleChange('period_start', e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="period_end">Fin del periodo</label>
          <input
            id="period_end"
            type="date"
            value={form.period_end}
            onChange={(e) => handleChange('period_end', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid two">
        <div className="field">
          <label htmlFor="income_total">Ingreso total</label>
          <input
            id="income_total"
            type="number"
            min={0}
            value={form.income_total}
            onChange={(e) => handleChange('income_total', e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="saving_goal">Objetivo de ahorro</label>
          <input
            id="saving_goal"
            type="number"
            min={0}
            value={form.saving_goal}
            onChange={(e) => handleChange('saving_goal', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="field">
        <label>Gastos fijos</label>
        <div className="grid" style={{ gap: 12 }}>
          {form.fixed_expenses.map((fixed, index) => (
            <div className="list-row" key={`${fixed.name}-${index}`}>
              <input
                type="text"
                placeholder="Nombre"
                value={fixed.name}
                onChange={(e) => handleFixedExpenseChange(index, 'name', e.target.value)}
                required
              />
              <input
                type="number"
                min={0}
                placeholder="Monto"
                value={fixed.amount}
                onChange={(e) => handleFixedExpenseChange(index, 'amount', e.target.value)}
                required
              />
              <button
                type="button"
                className="btn secondary"
                onClick={() => removeFixedExpense(index)}
                disabled={form.fixed_expenses.length === 1}
              >
                Eliminar
              </button>
            </div>
          ))}
          <div>
            <button type="button" className="btn secondary" onClick={addFixedExpense}>
              Agregar gasto fijo
            </button>
          </div>
        </div>
      </div>

      {error ? <p className="error">{error}</p> : null}
      {success ? <p className="success">{success}</p> : null}

      <div className="toolbar">
        <div className="muted">Guarda para mantener tu configuracion actualizada</div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar presupuesto'}
        </button>
      </div>
    </form>
  )
}

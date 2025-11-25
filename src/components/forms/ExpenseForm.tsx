import { useEffect, useState, type FormEvent } from 'react'
import type { AddExpensePayload } from '../../api/client'

type ExpenseFormProps = {
  onSubmit: (payload: AddExpensePayload) => Promise<void> | void
  loading?: boolean
  error?: string | null
}

const today = () => new Date().toISOString().slice(0, 10)

export default function ExpenseForm({ onSubmit, loading, error }: ExpenseFormProps) {
  const [form, setForm] = useState<AddExpensePayload>({
    date: today(),
    description: '',
    category: '',
    amount: 0,
  })

  useEffect(() => {
    setForm((prev) => ({ ...prev, date: today() }))
  }, [])

  const handleChange = (field: keyof AddExpensePayload, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === 'amount' ? Number(value) : value,
    }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    await onSubmit(form)
    setForm({ ...form, description: '', category: '', amount: 0 })
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="grid two">
        <div className="field">
          <label htmlFor="date">Fecha</label>
          <input
            id="date"
            type="date"
            value={form.date}
            onChange={(e) => handleChange('date', e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="amount">Monto</label>
          <input
            id="amount"
            type="number"
            min={0}
            value={form.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid two">
        <div className="field">
          <label htmlFor="description">Descripcion</label>
          <input
            id="description"
            type="text"
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Compra supermercado, renta, etc"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="category">Categoria</label>
          <input
            id="category"
            type="text"
            value={form.category}
            onChange={(e) => handleChange('category', e.target.value)}
            placeholder="Hogar, transporte, ocio..."
            required
          />
        </div>
      </div>

      {error ? <p className="error">{error}</p> : null}

      <div className="toolbar">
        <div className="muted">Registra gastos diarios para ver el impacto en tu saldo</div>
        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Agregar gasto'}
        </button>
      </div>
    </form>
  )
}

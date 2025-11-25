import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!email.includes('@')) {
      setError('Email invalido')
      return
    }
    if (password.length < 6) {
      setError('La clave debe tener al menos 6 caracteres')
      return
    }

    try {
      setLoading(true)
      await register(email, password)
      navigate('/app/dashboard')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No pudimos crear la cuenta'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="heading">
        <div>
          <h2 className="title" style={{ fontSize: 22 }}>
            Crear cuenta
          </h2>
          <p className="subtitle">Configura tu presupuesto en minutos</p>
        </div>
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="password">Clave</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>

      {error ? <p className="error">{error}</p> : null}

      <button className="btn" type="submit" disabled={loading}>
        {loading ? 'Creando...' : 'Registrarme'}
      </button>

      <p className="subtitle" style={{ marginTop: 12 }}>
        ¿Ya tienes cuenta? <Link to="/login">Iniciar sesion</Link>
      </p>
    </form>
  )
}

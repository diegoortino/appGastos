import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="page-container">
      <header className="toolbar">
        <div>
          <h1 className="title" style={{ marginBottom: 6 }}>
            Budget Flow
          </h1>
          <p className="subtitle">Seguimiento rapido de presupuesto mensual</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span className="pill">{user?.email}</span>
          <button className="btn secondary" onClick={handleLogout}>
            Cerrar sesion
          </button>
        </div>
      </header>

      <nav className="nav" style={{ margin: '12px 0 18px' }}>
        <NavLink to="/app/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
          Dashboard
        </NavLink>
        <NavLink to="/app/budget" className={({ isActive }) => (isActive ? 'active' : '')}>
          Presupuesto
        </NavLink>
        <NavLink to="/app/expenses" className={({ isActive }) => (isActive ? 'active' : '')}>
          Gastos
        </NavLink>
      </nav>

      <Outlet />
    </div>
  )
}

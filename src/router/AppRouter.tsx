import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { useAuth } from '../hooks/useAuth'
import AuthLayout from '../components/Layout/AuthLayout'
import AppLayout from '../components/Layout/AppLayout'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import DashboardPage from '../pages/DashboardPage'
import BudgetPage from '../pages/BudgetPage'
import ExpensesPage from '../pages/ExpensesPage'

function ProtectedRoute() {
  const { token, loading } = useAuth()

  if (loading) {
    return (
      <div className="page-container">
        <p className="loader">Cargando sesion...</p>
      </div>
    )
  }

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

function RedirectHome() {
  const { token } = useAuth()
  return <Navigate to={token ? '/app/dashboard' : '/login'} replace />
}

function RouterContent() {
  return (
    <Routes>
      <Route path="/" element={<RedirectHome />} />

      <Route
        path="/login"
        element={
          <AuthLayout>
            <LoginPage />
          </AuthLayout>
        }
      />
      <Route
        path="/register"
        element={
          <AuthLayout>
            <RegisterPage />
          </AuthLayout>
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/app">
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="budget" element={<BudgetPage />} />
            <Route path="expenses" element={<ExpensesPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <RouterContent />
      </BrowserRouter>
    </AuthProvider>
  )
}

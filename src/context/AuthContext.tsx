import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import * as api from '../api/client'

type AuthContextValue = {
  user: api.User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
}

const STORAGE_KEY = 'budget-auth'

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<api.User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { user: api.User; token: string }
        setUser(parsed.user)
        setToken(parsed.token)
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setLoading(false)
  }, [])

  const persist = (nextUser: api.User, nextToken: string) => {
    setUser(nextUser)
    setToken(nextToken)
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        user: nextUser,
        token: nextToken,
      }),
    )
  }

  const login = async (email: string, password: string) => {
    const { user: userResponse, token: tokenResponse } = await api.login(email, password)
    persist(userResponse, tokenResponse)
  }

  const registerUser = async (email: string, password: string) => {
    const { user: userResponse, token: tokenResponse } = await api.register(email, password)
    persist(userResponse, tokenResponse)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      register: registerUser,
      logout,
    }),
    [user, token, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

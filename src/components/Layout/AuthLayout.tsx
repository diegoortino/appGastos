type AuthLayoutProps = {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="page-container">
      <div className="card" style={{ maxWidth: 520, margin: '0 auto' }}>
        <div className="heading">
          <div>
            <h1 className="title">Budget Flow</h1>
            <p className="subtitle">Gestiona tus gastos y ahorros mes a mes</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}

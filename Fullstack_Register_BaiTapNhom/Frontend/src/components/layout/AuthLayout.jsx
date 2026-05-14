/**
 * AuthLayout — shared layout wrapper for all auth pages
 * Features animated background mesh + decorative floating orbs
 */
const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div
        className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-[0.07] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #2952e3 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-[-15%] right-[-5%] w-[600px] h-[600px] rounded-full opacity-[0.06] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #4d78f5 0%, transparent 70%)' }}
      />
      <div
        className="absolute top-[40%] right-[20%] w-[200px] h-[200px] rounded-full opacity-[0.04] pointer-events-none animate-float"
        style={{ background: 'radial-gradient(circle, #85a6ff 0%, transparent 70%)' }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Brand mark top-left */}
      <div className="absolute top-6 left-8 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/40">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
        <span className="font-display font-bold text-white text-lg tracking-tight">AppName</span>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md animate-fade-up">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout

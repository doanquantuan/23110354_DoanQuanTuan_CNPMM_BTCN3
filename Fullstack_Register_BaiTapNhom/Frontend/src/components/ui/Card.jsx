/**
 * Card component — glassmorphism surface for content blocks
 */
const Card = ({ children, className = "", glow = false }) => {
  return (
    <div
      className={`
        glass-card rounded-2xl p-8
        ${glow ? "glow-brand" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, className = "" }) => (
  <div className={`mb-8 ${className}`}>
    <h1 className="font-display text-2xl font-bold text-white mb-1.5">
      {title}
    </h1>
    {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
  </div>
);

export const CardDivider = ({ label }) => (
  <div className="relative my-6 flex items-center">
    <div className="flex-1 border-t border-surface-border" />
    {label && (
      <span className="mx-4 text-xs text-slate-600 uppercase tracking-widest">
        {label}
      </span>
    )}
    <div className="flex-1 border-t border-surface-border" />
  </div>
);

export default Card;

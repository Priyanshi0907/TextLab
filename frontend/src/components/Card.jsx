export default function Card({ title, icon: Icon, action, children, className = "" }) {
  return (
    <div className={`bg-surface border border-border rounded-2xl p-6 shadow-card ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-5">
          {title && (
            <h3 className="text-[16px] font-semibold text-ink flex items-center gap-2">
              {Icon && <Icon size={17} className="text-tan-light" />}
              {title}
            </h3>
          )}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export default function StatCard({ icon: Icon, iconTone = "olive", value, label, delta, deltaTone = "success" }) {
  const iconBg = iconTone === "olive" ? "bg-olive/25 text-olive-light" : "bg-tan/25 text-tan-light";
  const deltaColor =
    deltaTone === "success" ? "text-success" : deltaTone === "muted" ? "text-ink-muted" : "text-danger";

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-4 shadow-card">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBg}`}>
        <Icon size={22} strokeWidth={2} />
      </div>
      <div>
        <div className="text-[28px] font-bold text-ink leading-none">{value}</div>
        <div className="text-[13.5px] text-ink-soft mt-2">{label}</div>
      </div>
      {delta && <div className={`text-[12.5px] font-medium ${deltaColor}`}>{delta}</div>}
    </div>
  );
}

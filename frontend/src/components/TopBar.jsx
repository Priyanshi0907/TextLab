export default function TopBar({ title, subtitle }) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-[26px] font-bold text-ink flex items-center gap-2">
          {title}
        </h1>
        <p className="text-[14px] text-ink-muted mt-1.5">{subtitle}</p>
      </div>
    </div>
  );
}

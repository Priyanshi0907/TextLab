import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const PALETTE = ["#c9a06e", "#8b9268", "#6f7552", "#a7ad86", "#5f5c50", "#38351f"];

export default function DonutChart({ data, centerLabel, centerValue, size = 180 }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="68%"
            outerRadius="100%"
            paddingAngle={2}
            stroke="none"
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry, i) => (
              <Cell key={entry.name} fill={entry.color || PALETTE[i % PALETTE.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {(centerLabel || centerValue) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {centerValue && <div className="text-[22px] font-bold text-ink">{centerValue}</div>}
          {centerLabel && <div className="text-[11.5px] text-ink-muted mt-0.5">{centerLabel}</div>}
        </div>
      )}
    </div>
  );
}

export { PALETTE };

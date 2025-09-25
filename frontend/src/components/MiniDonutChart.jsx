export default function MiniDonutChart({
  segments = [],
  size = 120,
  stroke = 14,
}) {
  const total = Math.max(
    1,
    segments.reduce((s, seg) => s + (seg.value || 0), 0)
  );
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={stroke}
          fill="transparent"
        />
        {segments.map((seg, idx) => {
          const length = (circumference * (seg.value || 0)) / total;
          const circle = (
            <circle
              key={idx}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={seg.color}
              strokeWidth={stroke}
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={offset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-500"
            />
          );
          offset -= length;
          return circle;
        })}
      </svg>
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ backgroundColor: seg.color }}
            />
            <span className="text-textDark/80">{seg.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}












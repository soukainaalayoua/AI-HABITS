export default function BarChartMini({
  values = [],
  barColor = "#1E40AF",
  labels = [],
}) {
  const max = Math.max(1, ...values);
  return (
    <div className="grid grid-cols-7 gap-2 items-end h-24">
      {values.map((v, i) => (
        <div key={i} className="text-center">
          <div
            className="mx-auto w-4 rounded-t shadow-sm transition-all duration-300 hover:scale-y-105"
            style={{
              height: `${(v / max) * 100}%`,
              background: `linear-gradient(180deg, ${barColor}, #8B5CF6)`,
            }}
            title={`${labels[i] ?? `Day ${i + 1}`}: ${v}`}
          />
        </div>
      ))}
    </div>
  );
}

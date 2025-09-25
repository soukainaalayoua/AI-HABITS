export default function AreaChart({
  values = [],
  width = 260,
  height = 100,
  lineColor = "#1E40AF",
  fillColor = "rgba(59,130,246,0.2)",
  labels = [],
}) {
  const max = Math.max(1, ...values);
  const step = width / Math.max(1, values.length - 1);
  const points = values.map((v, i) => [i * step, height - (v / max) * height]);
  const polyline = points.map((p) => p.join(",")).join(" ");
  const polygon = `0,${height} ${polyline} ${width},${height}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polygon
        points={polygon}
        fill={fillColor}
        className="transition-all duration-300"
      />
      <polyline
        points={polyline}
        fill="none"
        stroke={lineColor}
        strokeWidth="3"
        className="drop-shadow-sm"
      />
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill={lineColor}>
          <title>{`${labels[i] ?? `Day ${i + 1}`}: ${values[i]}`}</title>
        </circle>
      ))}
    </svg>
  );
}












interface ConfidenceBarProps {
  value: number; // 0–100
}

export default function ConfidenceBar({ value }: ConfidenceBarProps) {
  // Clamp to [0, 100]
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full h-1.5 bg-[#222222] rounded-full overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#00C853] to-[#00E676] transition-all duration-300"
        style={{ width: `${clamped}%` }}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}

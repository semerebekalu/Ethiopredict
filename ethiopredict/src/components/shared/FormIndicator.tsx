import type { FormResult } from '@/types';

interface FormIndicatorProps {
  form: FormResult[];
}

const dotColor: Record<FormResult, string> = {
  w: 'bg-[#00E676]',   // green — win
  d: 'bg-[#FFD600]',   // gold  — draw
  l: 'bg-[#FF1744]',   // red   — loss
};

const dotLabel: Record<FormResult, string> = {
  w: 'Win',
  d: 'Draw',
  l: 'Loss',
};

export default function FormIndicator({ form }: FormIndicatorProps) {
  return (
    <div className="flex gap-1 justify-center" aria-label="Recent form">
      {form.map((result, i) => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full ${dotColor[result]}`}
          title={dotLabel[result]}
          aria-label={dotLabel[result]}
        />
      ))}
    </div>
  );
}

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import ConfidenceBar from '@/components/shared/ConfidenceBar';

describe('ConfidenceBar', () => {
  it('renders 0% width for value 0', () => {
    const { container } = render(<ConfidenceBar value={0} />);
    const fill = container.querySelector('[role="progressbar"]') as HTMLElement;
    expect(fill.style.width).toBe('0%');
  });

  it('renders 50% width for value 50', () => {
    const { container } = render(<ConfidenceBar value={50} />);
    const fill = container.querySelector('[role="progressbar"]') as HTMLElement;
    expect(fill.style.width).toBe('50%');
  });

  it('renders 100% width for value 100', () => {
    const { container } = render(<ConfidenceBar value={100} />);
    const fill = container.querySelector('[role="progressbar"]') as HTMLElement;
    expect(fill.style.width).toBe('100%');
  });

  it('clamps values above 100 to 100%', () => {
    const { container } = render(<ConfidenceBar value={150} />);
    const fill = container.querySelector('[role="progressbar"]') as HTMLElement;
    expect(fill.style.width).toBe('100%');
  });

  it('clamps negative values to 0%', () => {
    const { container } = render(<ConfidenceBar value={-10} />);
    const fill = container.querySelector('[role="progressbar"]') as HTMLElement;
    expect(fill.style.width).toBe('0%');
  });
});

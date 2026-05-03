import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import FormIndicator from '@/components/shared/FormIndicator';

describe('FormIndicator', () => {
  it('renders 5 dots for 5 form results', () => {
    const { container } = render(
      <FormIndicator form={['w', 'd', 'l', 'w', 'w']} />
    );
    const dots = container.querySelectorAll('span');
    expect(dots.length).toBe(5);
  });

  it('applies green class for win', () => {
    const { container } = render(<FormIndicator form={['w']} />);
    const dot = container.querySelector('span') as HTMLElement;
    expect(dot.className).toContain('bg-[#00E676]');
  });

  it('applies gold class for draw', () => {
    const { container } = render(<FormIndicator form={['d']} />);
    const dot = container.querySelector('span') as HTMLElement;
    expect(dot.className).toContain('bg-[#FFD600]');
  });

  it('applies red class for loss', () => {
    const { container } = render(<FormIndicator form={['l']} />);
    const dot = container.querySelector('span') as HTMLElement;
    expect(dot.className).toContain('bg-[#FF1744]');
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Sparkline } from '../Sparkline';

describe('Sparkline', () => {
  it('renders placeholder when data has fewer than 2 points', () => {
    render(<Sparkline data={[100]} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('renders svg and paths when data has multiple points', () => {
    const data = [100, 102, 99, 105, 104];
    render(<Sparkline data={data} width={120} height={36} isPositive={true} />);
    const svg = screen.getByLabelText('Xu hướng giá ngắn hạn');
    expect(svg).toBeInTheDocument();
    expect(svg.tagName.toLowerCase()).toBe('svg');
  });
});

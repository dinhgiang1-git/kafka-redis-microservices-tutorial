import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PriceFlash } from '../PriceFlash';

describe('PriceFlash', () => {
  it('renders formatted price value', () => {
    render(
      <PriceFlash
        price={65321.12}
        direction="unchanged"
      />
    );
    expect(screen.getByText('$65,321.12')).toBeInTheDocument();
  });

  it('applies emerald color and shows up arrow when direction is up', () => {
    render(
      <PriceFlash
        price={65321.12}
        direction="up"
      />
    );
    const container = screen.getByTestId('price-flash-value');
    expect(container).toHaveClass('text-emerald-400');
    expect(screen.getByText('▲')).toBeInTheDocument();
  });

  it('applies rose color and shows down arrow when direction is down', () => {
    render(
      <PriceFlash
        price={64900.5}
        direction="down"
      />
    );
    const container = screen.getByTestId('price-flash-value');
    expect(container).toHaveClass('text-rose-400');
    expect(screen.getByText('▼')).toBeInTheDocument();
  });
});

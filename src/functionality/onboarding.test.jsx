import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Onboarding from './onboarding';

test('shows an empty onboarding progress state on first load', () => {
  render(
    <MemoryRouter>
      <Onboarding />
    </MemoryRouter>
  );

  expect(screen.getByText(/0 of 3 steps completed/i)).toBeInTheDocument();
});

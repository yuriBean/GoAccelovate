import { render, screen } from '@testing-library/react';
import DashboardPage from '../app/dashboard/page';
import { useSession } from 'next-auth/react';

jest.mock('next-auth/react');

test('redirects if unauthenticated', () => {
  useSession.mockReturnValue({ data: null, status: 'unauthenticated' });

  render(<DashboardPage />);
  expect(screen.queryByText(/welcome/i)).not.toBeInTheDocument();
});

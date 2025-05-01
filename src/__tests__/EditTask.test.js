import EditTaskPage from '../app/edit/[id]/page';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';

jest.mock('axios', () => ({
  get: jest.fn(),
}));

test('loads task data', async () => {
  axios.get.mockResolvedValueOnce({ data: { title: 'Test Task' } });

  render(<EditTaskPage params={{ id: '123' }} />);
  
  await waitFor(() => {
    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
  });
});

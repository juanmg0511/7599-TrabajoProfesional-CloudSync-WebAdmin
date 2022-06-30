import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

test('renders welcome message', async () => {
  render(<App />);
  const linkElement = screen.getByText(/Welcome to React-admin/i);  
  await waitFor(() => {
    expect(linkElement).toBeInTheDocument();
  });
});

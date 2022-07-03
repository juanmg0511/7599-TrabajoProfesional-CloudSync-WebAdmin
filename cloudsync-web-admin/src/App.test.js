import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

test('renders placeholder text', async () => {
  render(<App />);
  const linkElement = screen.getByText(/CloudSync/i);
  await waitFor(() => {
    expect(linkElement).toBeInTheDocument();
  });
});

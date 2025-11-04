import { render, screen } from '@testing-library/react';
import App from './App';

test('renders header brand title', () => {
  render(<App />);
  expect(screen.getByText(/Ocean Notes/i)).toBeInTheDocument();
});

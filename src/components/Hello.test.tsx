import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

function Hello() {
  return <h1>Hello World</h1>;
}

test('renders Hello World', () => {
  render(<Hello />);
  expect(screen.getByText('Hello World')).toBeInTheDocument();
});

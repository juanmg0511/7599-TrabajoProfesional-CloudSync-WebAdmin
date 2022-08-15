import React from 'react'
import { render } from '@testing-library/react'
import App from './App'

test('renders home page', () => { 

  const {container} = render(<App />);
  const divs = container.getElementsByClassName('sk-spinner');

  expect(divs.length).toBe(1);
});

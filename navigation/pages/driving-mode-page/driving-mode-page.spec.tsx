import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { DrivingModePage } from './driving-mode-page.js';
import { mockRouteHighway, mockRouteCity } from './driving-mode-page.mock.js';

function renderPage(props: Partial<React.ComponentProps<typeof DrivingModePage>> = {}) {
  return render(
    <MockProvider>
      <DrivingModePage mockRoute={mockRouteHighway} {...props} />
    </MockProvider>
  );
}

it(`renders the page root element`, () => {
  const { container } = renderPage();
  const page = container.querySelector(`[data-testid="driving-mode-page"]`);
  expect(page).toBeTruthy();
});

it(`renders something inside the page container`, () => {
  const { container } = renderPage();
  expect(container.firstChild).toBeTruthy();
});

it(`renders the error overlay when no route is found and not loading`, () => {
  const { container } = renderPage({ mockRoute: null });
  const errorOverlay = container.querySelector(`[data-testid="error-overlay"]`);
  expect(errorOverlay).toBeTruthy();
});

it(`shows Route not found text when route is missing`, () => {
  const { getByText } = renderPage({ mockRoute: null });
  expect(getByText(`Route not found`)).toBeTruthy();
});

it(`renders the back button in error state`, () => {
  const { container } = renderPage({ mockRoute: null });
  const backButton = container.querySelector(`[data-testid="back-button"]`);
  expect(backButton).toBeTruthy();
});

it(`renders with city route mock data without crashing`, () => {
  const { container } = renderPage({ mockRoute: mockRouteCity });
  expect(container.firstChild).toBeTruthy();
});

it(`renders with 2x font scale without crashing`, () => {
  const { container } = renderPage({ fontScale: `2x` });
  expect(container.firstChild).toBeTruthy();
});

it(`renders with 1.5x font scale without crashing`, () => {
  const { container } = renderPage({ fontScale: `1.5x` });
  expect(container.firstChild).toBeTruthy();
});

it(`renders with voice disabled without crashing`, () => {
  const { container } = renderPage({ voiceEnabled: false });
  expect(container.firstChild).toBeTruthy();
});

it(`renders with custom tank capacity and fuel level without crashing`, () => {
  const { container } = renderPage({
    tankCapacityLiters: 20,
    initialFuelLiters: 5,
  });
  expect(container.firstChild).toBeTruthy();
});

it(`clicking back button in error state does not throw`, () => {
  const { container } = renderPage({ mockRoute: null });
  const backButton = container.querySelector(`[data-testid="back-button"]`) as HTMLButtonElement | null;
  expect(() => {
    if (backButton) fireEvent.click(backButton);
  }).not.toThrow();
});

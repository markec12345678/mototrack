import React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { AppLayout } from './app-layout.js';
import { MOCK_NAVIGATION_ITEMS, MOCK_HEADER_ACTIONS } from './app-layout.mock.js';

function renderWithProvider(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

it('should render without crashing when no props are provided', () => {
  const { container } = renderWithProvider(<AppLayout />);
  expect(container.firstChild).toBeTruthy();
});

it('should render children inside the layout', () => {
  const { container } = renderWithProvider(
    <AppLayout navigationItems={MOCK_NAVIGATION_ITEMS}>
      <div className="test-child">Hello MotoTrack</div>
    </AppLayout>
  );
  const child = container.querySelector(`.test-child`);
  expect(child).toBeTruthy();
  expect(child?.textContent).toBe(`Hello MotoTrack`);
});

it('should render multiple children correctly', () => {
  const { container } = renderWithProvider(
    <AppLayout>
      <div className="child-one">First</div>
      <div className="child-two">Second</div>
    </AppLayout>
  );
  expect(container.querySelector(`.child-one`)).toBeTruthy();
  expect(container.querySelector(`.child-two`)).toBeTruthy();
});

it('should apply custom className to the rendered element', () => {
  const { container } = renderWithProvider(
    <AppLayout
      className="custom-layout"
      navigationItems={MOCK_NAVIGATION_ITEMS}
      headerActions={MOCK_HEADER_ACTIONS}
    />
  );
  const withClass = container.querySelector(`.custom-layout`);
  expect(withClass).toBeTruthy();
});

it('should render inner content when children are provided', () => {
  const { container } = renderWithProvider(
    <AppLayout navigationItems={MOCK_NAVIGATION_ITEMS}>
      <span className="inner-content">Content</span>
    </AppLayout>
  );
  const inner = container.querySelector(`.inner-content`);
  expect(inner).toBeTruthy();
});

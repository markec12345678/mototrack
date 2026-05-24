import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { BottomNav } from './bottom-nav.js';
import { mockNavigationItems, mockMinimalNavItems, mockNavigationItemsWithNonPrimary } from './bottom-nav.mock.js';
import styles from './bottom-nav.module.scss';

function renderWithRouter(ui: React.ReactElement, initialPath = `/`) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      {ui}
    </MemoryRouter>
  );
}

it(`renders the bottom nav container`, () => {
  const { container } = renderWithRouter(<BottomNav navigationItems={mockNavigationItems} />);
  const nav = container.querySelector(`nav`);
  expect(nav).toBeTruthy();
});

it(`renders all primary navigation items as tabs`, () => {
  const { container } = renderWithRouter(<BottomNav navigationItems={mockNavigationItems} />);
  const tabs = container.querySelectorAll(`button`);
  expect(tabs.length).toBe(5);
});

it(`renders tab labels correctly`, () => {
  const { getByText } = renderWithRouter(<BottomNav navigationItems={mockNavigationItems} />);
  expect(getByText(`Home`)).toBeTruthy();
  expect(getByText(`Map`)).toBeTruthy();
  expect(getByText(`Routes`)).toBeTruthy();
  expect(getByText(`Riders`)).toBeTruthy();
  expect(getByText(`Profile`)).toBeTruthy();
});

it(`filters out non-primary items`, () => {
  const { container } = renderWithRouter(
    <BottomNav navigationItems={mockNavigationItemsWithNonPrimary} />
  );
  const tabs = container.querySelectorAll(`button`);
  // mockNavigationItemsWithNonPrimary has 4 primary items
  expect(tabs.length).toBe(4);
});

it(`marks the active tab with aria-current="page" on the home route`, () => {
  const { container } = renderWithRouter(<BottomNav navigationItems={mockNavigationItems} />, `/`);
  const tabs = container.querySelectorAll(`button`);
  const homeTab = tabs[0];
  expect(homeTab.getAttribute(`aria-current`)).toBe(`page`);
});

it(`marks the correct tab as active on a non-root route`, () => {
  const { container } = renderWithRouter(
    <BottomNav navigationItems={mockNavigationItems} />,
    `/map`
  );
  const tabs = container.querySelectorAll(`button`);
  const mapTab = tabs[1];
  expect(mapTab.getAttribute(`aria-current`)).toBe(`page`);
});

it(`does not mark other tabs as active when on /map`, () => {
  const { container } = renderWithRouter(
    <BottomNav navigationItems={mockNavigationItems} />,
    `/map`
  );
  const tabs = container.querySelectorAll(`button`);
  const homeTab = tabs[0];
  expect(homeTab.getAttribute(`aria-current`)).toBeNull();
});

it(`applies the active class to the active tab`, () => {
  const { container } = renderWithRouter(
    <BottomNav navigationItems={mockNavigationItems} />,
    `/routes`
  );
  const tabs = container.querySelectorAll(`button`);
  const routesTab = tabs[2];
  expect(routesTab.classList.contains(styles.active)).toBe(true);
});

it(`does not apply active class to inactive tabs`, () => {
  const { container } = renderWithRouter(
    <BottomNav navigationItems={mockNavigationItems} />,
    `/routes`
  );
  const tabs = container.querySelectorAll(`button`);
  const homeTab = tabs[0];
  expect(homeTab.classList.contains(styles.active)).toBe(false);
});

it(`renders minimal tabs correctly`, () => {
  const { container } = renderWithRouter(<BottomNav navigationItems={mockMinimalNavItems} />);
  const tabs = container.querySelectorAll(`button`);
  expect(tabs.length).toBe(3);
});

it(`renders with default navigation items when no props provided`, () => {
  const { container } = renderWithRouter(<BottomNav />);
  const tabs = container.querySelectorAll(`button`);
  expect(tabs.length).toBe(5);
});

it(`sorts tabs by order`, () => {
  const unordered = [
    { key: `profile`, label: `Profile`, icon: `profile`, path: `/profile`, order: 5, primary: true },
    { key: `dashboard`, label: `Home`, icon: `home`, path: `/`, order: 1, primary: true },
    { key: `map`, label: `Map`, icon: `map`, path: `/map`, order: 2, primary: true },
  ];
  const { container } = renderWithRouter(<BottomNav navigationItems={unordered} />);
  const labels = container.querySelectorAll(`.${styles.label}`);
  expect(labels[0].textContent).toBe(`Home`);
  expect(labels[1].textContent).toBe(`Map`);
  expect(labels[2].textContent).toBe(`Profile`);
});

it(`applies a custom className to the nav element`, () => {
  const { container } = renderWithRouter(
    <BottomNav navigationItems={mockNavigationItems} className="custom-nav" />
  );
  const nav = container.querySelector(`nav`);
  expect(nav?.classList.contains(`custom-nav`)).toBe(true);
});

it(`renders the active dot indicator for the active tab`, () => {
  const { container } = renderWithRouter(
    <BottomNav navigationItems={mockNavigationItems} />,
    `/`
  );
  const activeDot = container.querySelector(`.${styles.activeDot}`);
  expect(activeDot).toBeTruthy();
});

it(`does not render active dot for inactive tabs`, () => {
  const { container } = renderWithRouter(
    <BottomNav navigationItems={mockNavigationItems} />,
    `/`
  );
  const activeDots = container.querySelectorAll(`.${styles.activeDot}`);
  // Only one active dot should exist (for the active tab)
  expect(activeDots.length).toBe(1);
});

it(`renders icons for each tab`, () => {
  const { container } = renderWithRouter(<BottomNav navigationItems={mockNavigationItems} />);
  const iconWraps = container.querySelectorAll(`.${styles.iconWrap}`);
  expect(iconWraps.length).toBe(5);
});

it(`triggers navigation on tab click`, () => {
  const { container } = renderWithRouter(<BottomNav navigationItems={mockNavigationItems} />, `/`);
  const tabs = container.querySelectorAll(`button`);
  fireEvent.click(tabs[1]);
  // After clicking Map tab, it should become active
  const updatedTabs = container.querySelectorAll(`button`);
  expect(updatedTabs[1].getAttribute(`aria-current`)).toBe(`page`);
});

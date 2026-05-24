import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Sidebar } from './sidebar.js';
import { NavigationItem } from './navigation-item-type.js';
import styles from './sidebar.module.scss';

const mockNavItems: NavigationItem[] = [
  { key: `dashboard`, label: `Dashboard`, icon: `🏠`, path: `/`, order: 1, primary: true },
  { key: `races`, label: `Races`, icon: `🏁`, path: `/races`, order: 2, primary: true },
  { key: `riders`, label: `Riders`, icon: `🏍️`, path: `/riders`, order: 3, primary: true },
  { key: `settings`, label: `Settings`, icon: `⚙️`, path: `/settings`, order: 4 },
];

function renderSidebar(props: Partial<React.ComponentProps<typeof Sidebar>> = {}) {
  return render(
    <MemoryRouter initialEntries={[`/`]}>
      <Sidebar navigationItems={mockNavItems} {...props} />
    </MemoryRouter>
  );
}

it(`renders all navigation item labels`, () => {
  const { getByText } = renderSidebar();
  expect(getByText(`Dashboard`)).toBeTruthy();
  expect(getByText(`Races`)).toBeTruthy();
  expect(getByText(`Riders`)).toBeTruthy();
  expect(getByText(`Settings`)).toBeTruthy();
});

it(`renders navigation item icons`, () => {
  const { getByText } = renderSidebar();
  expect(getByText(`🏠`)).toBeTruthy();
  expect(getByText(`🏁`)).toBeTruthy();
});

it(`hides navLabel elements when collapsed`, () => {
  const { container } = renderSidebar({ defaultCollapsed: true });
  const navLabels = container.querySelectorAll(`.${styles.navLabel}`);
  expect(navLabels.length).toBe(0);
});

it(`shows labels when not collapsed`, () => {
  const { getByText } = renderSidebar({ defaultCollapsed: false });
  expect(getByText(`Dashboard`)).toBeTruthy();
  expect(getByText(`Races`)).toBeTruthy();
});

it(`toggles collapsed state when collapse button is clicked`, () => {
  const { container } = renderSidebar({ defaultCollapsed: false });
  expect(container.querySelectorAll(`.${styles.navLabel}`).length).toBeGreaterThan(0);

  const collapseBtn = container.querySelector(`.${styles.collapseBtn}`) as HTMLButtonElement;
  expect(collapseBtn).toBeTruthy();
  fireEvent.click(collapseBtn);

  expect(container.querySelectorAll(`.${styles.navLabel}`).length).toBe(0);
});

it(`expands from collapsed when collapse button is clicked`, () => {
  const { container } = renderSidebar({ defaultCollapsed: true });
  expect(container.querySelectorAll(`.${styles.navLabel}`).length).toBe(0);

  const collapseBtn = container.querySelector(`.${styles.collapseBtn}`) as HTMLButtonElement;
  fireEvent.click(collapseBtn);

  expect(container.querySelectorAll(`.${styles.navLabel}`).length).toBeGreaterThan(0);
});

it(`applies collapsed class when defaultCollapsed is true`, () => {
  const { container } = renderSidebar({ defaultCollapsed: true });
  const sidebar = container.querySelector(`.${styles.sidebar}`) as HTMLElement;
  expect(sidebar.classList.contains(styles.collapsed)).toBe(true);
});

it(`does not apply collapsed class when defaultCollapsed is false`, () => {
  const { container } = renderSidebar({ defaultCollapsed: false });
  const sidebar = container.querySelector(`.${styles.sidebar}`) as HTMLElement;
  expect(sidebar.classList.contains(styles.collapsed)).toBe(false);
});

it(`renders the collapse button label when expanded`, () => {
  const { getByText } = renderSidebar({ defaultCollapsed: false });
  expect(getByText(`Collapse`)).toBeTruthy();
});

it(`renders a custom logo when provided`, () => {
  const { getByText } = renderSidebar({ logo: <span>MyLogo</span> });
  expect(getByText(`MyLogo`)).toBeTruthy();
});

it(`renders a custom footer when provided`, () => {
  const { getByText } = renderSidebar({ footer: <span>MyFooter</span> });
  expect(getByText(`MyFooter`)).toBeTruthy();
});

it(`renders nav items sorted by order`, () => {
  const { container } = renderSidebar();
  const labels = container.querySelectorAll(`.${styles.navLabel}`);
  const texts = Array.from(labels).map((el) => el.textContent);
  expect(texts[0]).toBe(`Dashboard`);
  expect(texts[1]).toBe(`Races`);
  expect(texts[2]).toBe(`Riders`);
  expect(texts[3]).toBe(`Settings`);
});

it(`applies active class to the active nav link`, () => {
  const { container } = render(
    <MemoryRouter initialEntries={[`/races`]}>
      <Sidebar navigationItems={mockNavItems} />
    </MemoryRouter>
  );
  const activeLinks = container.querySelectorAll(`.${styles.active}`);
  expect(activeLinks.length).toBeGreaterThan(0);
});

it(`applies custom className to the sidebar`, () => {
  const { container } = renderSidebar({ className: `my-custom-class` });
  const sidebar = container.querySelector(`.${styles.sidebar}`) as HTMLElement;
  expect(sidebar.classList.contains(`my-custom-class`)).toBe(true);
});

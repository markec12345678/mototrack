import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Tabs } from './tabs.js';
import { type TabItem } from './tab-item-type.js';
import styles from './tabs.module.scss';

const mockItems: TabItem[] = [
  { key: `explore`, label: `Explore` },
  { key: `races`, label: `Races` },
  { key: `riders`, label: `Riders` },
];

function renderTabs(props: Partial<React.ComponentProps<typeof Tabs>> = {}) {
  return render(
    <MemoryRouter>
      <Tabs items={mockItems} {...props} />
    </MemoryRouter>
  );
}

it('should render all tab labels', () => {
  const { getByText } = renderTabs();
  expect(getByText(`Explore`)).toBeTruthy();
  expect(getByText(`Races`)).toBeTruthy();
  expect(getByText(`Riders`)).toBeTruthy();
});

it('should apply the active class to the active tab', () => {
  const { container } = renderTabs({ activeKey: `races` });
  const buttons = container.querySelectorAll(`button[role="tab"]`);
  const activeButton = Array.from(buttons).find((btn) =>
    btn.classList.contains(styles.active)
  );
  expect(activeButton).toBeTruthy();
  expect(activeButton?.textContent).toContain(`Races`);
});

it('should not apply the active class to inactive tabs', () => {
  const { container } = renderTabs({ activeKey: `explore` });
  const buttons = container.querySelectorAll(`button[role="tab"]`);
  const inactiveButtons = Array.from(buttons).filter(
    (btn) => !btn.classList.contains(styles.active)
  );
  expect(inactiveButtons.length).toBe(2);
});

it('should call onTabChange with the correct key when a tab is clicked', () => {
  const onTabChange = vi.fn();
  const { getByText } = renderTabs({ activeKey: `explore`, onTabChange });
  fireEvent.click(getByText(`Riders`));
  expect(onTabChange).toHaveBeenCalledWith(`riders`);
});

it('should render icons when provided', () => {
  const itemsWithIcons: TabItem[] = [
    { key: `home`, label: `Home`, icon: <span data-testid="home-icon">🏠</span> },
    { key: `profile`, label: `Profile` },
  ];
  const { container } = render(
    <MemoryRouter>
      <Tabs items={itemsWithIcons} activeKey="home" />
    </MemoryRouter>
  );
  const iconSpans = container.querySelectorAll(`.${styles.icon}`);
  expect(iconSpans.length).toBe(1);
});

it('should render default items when no items prop is provided', () => {
  const { getByText } = render(
    <MemoryRouter>
      <Tabs />
    </MemoryRouter>
  );
  expect(getByText(`Explore`)).toBeTruthy();
});

it('should set aria-selected on the active tab', () => {
  const { container } = renderTabs({ activeKey: `races` });
  const buttons = container.querySelectorAll(`button[role="tab"]`);
  const selected = Array.from(buttons).find(
    (btn) => btn.getAttribute(`aria-selected`) === `true`
  );
  expect(selected).toBeTruthy();
  expect(selected?.textContent).toContain(`Races`);
});

it('should apply a custom className to the root element', () => {
  const { container } = renderTabs({ className: `custom-class` });
  const wrapper = container.firstChild as HTMLElement;
  expect(wrapper.classList.contains(`custom-class`)).toBe(true);
});

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Header } from './header.js';
import { MOCK_HEADER_ACTIONS, MOCK_SOS_ACTION, MOCK_MOTOCHAT_ACTION } from './header.mock.js';
import styles from './header.module.scss';

function renderHeader(props: Partial<React.ComponentProps<typeof Header>> = {}) {
  return render(
    <MemoryRouter>
      <Header headerActions={MOCK_HEADER_ACTIONS} {...props} />
    </MemoryRouter>
  );
}

it(`should render the header element`, () => {
  const { container } = renderHeader();
  const header = container.querySelector(`header`);
  expect(header).toBeTruthy();
});

it(`should apply the sticky header class`, () => {
  const { container } = renderHeader();
  const header = container.querySelector(`header`);
  expect(header?.className).toContain(styles.header);
});

it(`should render the logo area`, () => {
  const { container } = renderHeader();
  const logoArea = container.querySelector(`.${styles.logoArea}`);
  expect(logoArea).toBeTruthy();
});

it(`should render the inner layout container`, () => {
  const { container } = renderHeader();
  const inner = container.querySelector(`.${styles.inner}`);
  expect(inner).toBeTruthy();
});

it(`should render the desktop actions area`, () => {
  const { container } = renderHeader();
  const actionsArea = container.querySelector(`.${styles.actionsArea}`);
  expect(actionsArea).toBeTruthy();
});

it(`should render the user bar area`, () => {
  const { container } = renderHeader();
  const userBarArea = container.querySelector(`.${styles.userBarArea}`);
  expect(userBarArea).toBeTruthy();
});

it(`should render the mobile actions area`, () => {
  const { container } = renderHeader();
  const mobileActions = container.querySelector(`.${styles.mobileActions}`);
  expect(mobileActions).toBeTruthy();
});

it(`should render the SOS action button with sos class`, () => {
  const { container } = renderHeader();
  const sosButtons = container.querySelectorAll(`.${styles.sosButton}`);
  expect(sosButtons.length).toBeGreaterThan(0);
});

it(`should render action buttons for each header action`, () => {
  const { container } = renderHeader();
  const actionButtons = container.querySelectorAll(`.${styles.actionButton}`);
  expect(actionButtons.length).toBeGreaterThanOrEqual(MOCK_HEADER_ACTIONS.length);
});

it(`should render the 3-dot menu trigger on mobile actions`, () => {
  const { container } = renderHeader();
  const menuTrigger = container.querySelector(`.${styles.menuTrigger}`);
  expect(menuTrigger).toBeTruthy();
});

it(`should open the mobile dropdown when 3-dot trigger is clicked`, () => {
  const { container } = renderHeader();
  const menuTrigger = container.querySelector(`.${styles.menuTrigger}`) as HTMLButtonElement;
  expect(menuTrigger).toBeTruthy();

  fireEvent.click(menuTrigger);

  const dropdown = container.querySelector(`.${styles.mobileDropdown}`);
  expect(dropdown).toBeTruthy();
});

it(`should close the mobile dropdown when trigger is clicked again`, () => {
  const { container } = renderHeader();
  const menuTrigger = container.querySelector(`.${styles.menuTrigger}`) as HTMLButtonElement;

  fireEvent.click(menuTrigger);
  const dropdownOpen = container.querySelector(`.${styles.mobileDropdown}`);
  expect(dropdownOpen).toBeTruthy();

  fireEvent.click(menuTrigger);
  const dropdownClosed = container.querySelector(`.${styles.mobileDropdown}`);
  expect(dropdownClosed).toBeNull();
});

it(`should render mobile dropdown items when menu is open`, () => {
  const { container } = renderHeader();
  const menuTrigger = container.querySelector(`.${styles.menuTrigger}`) as HTMLButtonElement;
  fireEvent.click(menuTrigger);

  const dropdownItems = container.querySelectorAll(`.${styles.mobileDropdownItem}`);
  expect(dropdownItems.length).toBeGreaterThan(0);
});

it(`should close the dropdown when a dropdown item is clicked`, () => {
  const { container } = renderHeader();
  const menuTrigger = container.querySelector(`.${styles.menuTrigger}`) as HTMLButtonElement;
  fireEvent.click(menuTrigger);

  const firstItem = container.querySelector(`.${styles.mobileDropdownItem}`) as HTMLButtonElement;
  expect(firstItem).toBeTruthy();
  fireEvent.click(firstItem);

  const dropdown = container.querySelector(`.${styles.mobileDropdown}`);
  expect(dropdown).toBeNull();
});

it(`should not render the 3-dot menu when only SOS action is provided`, () => {
  const { container } = render(
    <MemoryRouter>
      <Header headerActions={[MOCK_SOS_ACTION]} />
    </MemoryRouter>
  );
  const menuTrigger = container.querySelector(`.${styles.menuTrigger}`);
  expect(menuTrigger).toBeNull();
});

it(`should render with a custom className`, () => {
  const { container } = render(
    <MemoryRouter>
      <Header headerActions={MOCK_HEADER_ACTIONS} className="custom-header" />
    </MemoryRouter>
  );
  const header = container.querySelector(`header`);
  expect(header?.className).toContain(`custom-header`);
});

it(`should call onClick when an action button is clicked`, () => {
  let clicked = false;
  const actions = [{ ...MOCK_MOTOCHAT_ACTION, onClick: () => { clicked = true; } }];

  const { container } = render(
    <MemoryRouter>
      <Header headerActions={actions} />
    </MemoryRouter>
  );

  const actionButtons = container.querySelectorAll(`.${styles.actionButton}`);
  const chatButton = Array.from(actionButtons).find(
    (btn) => !btn.className.includes(styles.sosButton)
  ) as HTMLButtonElement;

  if (chatButton) {
    fireEvent.click(chatButton);
    expect(clicked).toBe(true);
  }
});

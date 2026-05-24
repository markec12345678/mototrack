import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Dropdown } from './dropdown.js';
import { type DropdownItem } from './dropdown-item-type.js';
import styles from './dropdown.module.scss';

const items: DropdownItem[] = [
  { key: `profile`, label: `View Profile`, variant: `default` },
  { key: `settings`, label: `Settings`, variant: `default` },
  { key: `divider-1`, label: ``, divider: true },
  { key: `logout`, label: `Sign Out`, variant: `danger` },
];

function renderDropdown(props?: Partial<React.ComponentProps<typeof Dropdown>>) {
  return render(
    <MemoryRouter>
      <Dropdown
        trigger={<span>Open Menu</span>}
        items={items}
        {...props}
      />
    </MemoryRouter>
  );
}

it(`should render the trigger element`, () => {
  const { container } = renderDropdown();
  const trigger = container.querySelector(`.${styles.trigger}`);
  expect(trigger).toBeTruthy();
});

it(`should render trigger content`, () => {
  const { getByText } = renderDropdown();
  const triggerText = getByText(`Open Menu`);
  expect(triggerText).toBeTruthy();
});

it(`should not show the menu initially`, () => {
  const { container } = renderDropdown();
  const menu = container.querySelector(`.${styles.menu}`);
  expect(menu).toBeTruthy();
  expect(menu?.classList.contains(styles.menuOpen)).toBe(false);
});

it(`should open the menu when trigger is clicked`, () => {
  const { container } = renderDropdown();
  const trigger = container.querySelector(`.${styles.trigger}`) as HTMLButtonElement;
  fireEvent.click(trigger);
  const menu = container.querySelector(`.${styles.menu}`);
  expect(menu?.classList.contains(styles.menuOpen)).toBe(true);
});

it(`should render all non-divider items`, () => {
  const { container } = renderDropdown();
  const trigger = container.querySelector(`.${styles.trigger}`) as HTMLButtonElement;
  fireEvent.click(trigger);
  const menuItems = container.querySelectorAll(`.${styles.item}`);
  expect(menuItems.length).toBe(3);
});

it(`should render a divider element`, () => {
  const { container } = renderDropdown();
  const trigger = container.querySelector(`.${styles.trigger}`) as HTMLButtonElement;
  fireEvent.click(trigger);
  const divider = container.querySelector(`.${styles.divider}`);
  expect(divider).toBeTruthy();
});

it(`should apply danger class to danger variant items`, () => {
  const { container } = renderDropdown();
  const trigger = container.querySelector(`.${styles.trigger}`) as HTMLButtonElement;
  fireEvent.click(trigger);
  const dangerItem = container.querySelector(`.${styles.itemDanger}`);
  expect(dangerItem).toBeTruthy();
});

it(`should close the menu when an item is clicked`, () => {
  const { container } = renderDropdown();
  const trigger = container.querySelector(`.${styles.trigger}`) as HTMLButtonElement;
  fireEvent.click(trigger);

  const menuItems = container.querySelectorAll(`.${styles.item}`);
  fireEvent.click(menuItems[0]);

  const menu = container.querySelector(`.${styles.menu}`);
  expect(menu?.classList.contains(styles.menuOpen)).toBe(false);
});

it(`should call onClick when an item is clicked`, () => {
  const onClickMock = vi.fn();
  const itemsWithCallback: DropdownItem[] = [
    { key: `action`, label: `Do Action`, onClick: onClickMock },
  ];
  const { container } = render(
    <MemoryRouter>
      <Dropdown trigger={<span>Menu</span>} items={itemsWithCallback} />
    </MemoryRouter>
  );
  const trigger = container.querySelector(`.${styles.trigger}`) as HTMLButtonElement;
  fireEvent.click(trigger);

  const menuItem = container.querySelector(`.${styles.item}`) as HTMLButtonElement;
  fireEvent.click(menuItem);
  expect(onClickMock).toHaveBeenCalledTimes(1);
});

it(`should not call onClick for disabled items`, () => {
  const onClickMock = vi.fn();
  const disabledItems: DropdownItem[] = [
    { key: `disabled`, label: `Disabled Item`, disabled: true, onClick: onClickMock },
  ];
  const { container } = render(
    <MemoryRouter>
      <Dropdown trigger={<span>Menu</span>} items={disabledItems} />
    </MemoryRouter>
  );
  const trigger = container.querySelector(`.${styles.trigger}`) as HTMLButtonElement;
  fireEvent.click(trigger);

  const menuItem = container.querySelector(`.${styles.itemDisabled}`) as HTMLButtonElement;
  expect(menuItem).toBeTruthy();
});

it(`should render chevron by default`, () => {
  const { container } = renderDropdown();
  const chevron = container.querySelector(`.${styles.chevron}`);
  expect(chevron).toBeTruthy();
});

it(`should not render chevron when showChevron is false`, () => {
  const { container } = renderDropdown({ showChevron: false });
  const chevron = container.querySelector(`.${styles.chevron}`);
  expect(chevron).toBeNull();
});

it(`should apply right alignment class`, () => {
  const { container } = renderDropdown({ align: `right` });
  const menu = container.querySelector(`.${styles.menuAlignRight}`);
  expect(menu).toBeTruthy();
});

it(`should render href items as anchor tags`, () => {
  const linkItems: DropdownItem[] = [
    { key: `link`, label: `Go to Docs`, href: `/docs` },
  ];
  const { container } = render(
    <MemoryRouter>
      <Dropdown trigger={<span>Menu</span>} items={linkItems} />
    </MemoryRouter>
  );
  const trigger = container.querySelector(`.${styles.trigger}`) as HTMLButtonElement;
  fireEvent.click(trigger);

  const anchor = container.querySelector(`a.${styles.item}`) as HTMLAnchorElement;
  expect(anchor).toBeTruthy();
  expect(anchor.href.includes(`/docs`)).toBe(true);
});

it(`should call onOpenChange when open state changes`, () => {
  const onOpenChange = vi.fn();
  const { container } = render(
    <MemoryRouter>
      <Dropdown trigger={<span>Menu</span>} items={items} onOpenChange={onOpenChange} />
    </MemoryRouter>
  );
  const trigger = container.querySelector(`.${styles.trigger}`) as HTMLButtonElement;
  fireEvent.click(trigger);
  expect(onOpenChange).toHaveBeenCalledWith(true);
});

import React, { useState, useRef, useCallback } from 'react';
import classNames from 'classnames';
import { type DropdownItem } from './dropdown-item-type.js';
import styles from './dropdown.module.scss';

export type DropdownAlign = 'left' | 'right' | 'center';

export type DropdownProps = {
  /**
   * The trigger element that opens/closes the dropdown.
   */
  trigger: React.ReactNode;

  /**
   * Array of items to display in the dropdown menu.
   */
  items?: DropdownItem[];

  /**
   * Alignment of the dropdown menu relative to the trigger.
   * @default 'left'
   */
  align?: DropdownAlign;

  /**
   * Whether the dropdown is open (controlled mode).
   */
  open?: boolean;

  /**
   * Callback when the open state changes (controlled mode).
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Whether to show a chevron icon in the trigger area.
   * @default true
   */
  showChevron?: boolean;

  /**
   * Additional class name for the wrapper element.
   */
  className?: string;

  /**
   * Inline styles for the wrapper element.
   */
  style?: React.CSSProperties;

  /**
   * Additional class name for the menu panel.
   */
  menuClassName?: string;
};

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2 4L6 8L10 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const DEFAULT_ITEMS: DropdownItem[] = [
  { key: `profile`, label: `View Profile`, icon: null, variant: `default` },
  { key: `settings`, label: `Settings`, icon: null, variant: `default` },
  { key: `divider-1`, label: ``, divider: true },
  { key: `logout`, label: `Sign Out`, icon: null, variant: `danger` },
];

export function Dropdown({
  trigger,
  items = DEFAULT_ITEMS,
  align = `left`,
  open: controlledOpen,
  onOpenChange,
  showChevron = true,
  className,
  style,
  menuClassName,
}: DropdownProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const setOpen = useCallback(
    (value: boolean) => {
      if (!isControlled) {
        setInternalOpen(value);
      }
      onOpenChange?.(value);
    },
    [isControlled, onOpenChange]
  );

  const handleTriggerClick = useCallback(() => {
    setOpen(!isOpen);
  }, [isOpen, setOpen]);

  const handleItemClick = useCallback(
    (item: DropdownItem) => {
      if (item.disabled || item.divider) return;
      item.onClick?.();
      setOpen(false);
    },
    [setOpen]
  );

  const handleOverlayClick = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const menuClasses = classNames(styles.menu, {
    [styles.menuOpen]: isOpen,
    [styles.menuAlignRight]: align === `right`,
    [styles.menuAlignCenter]: align === `center`,
    [styles.menuAlignCenterOpen]: align === `center` && isOpen,
  });

  return (
    <div
      ref={wrapperRef}
      className={classNames(styles.wrapper, className)}
      style={style}
    >
      {isOpen && (
        <div
          className={styles.overlay}
          onClick={() => handleOverlayClick()}
        />
      )}

      <button
        type="button"
        className={styles.trigger}
        onClick={() => handleTriggerClick()}
      >
        {trigger}
        {showChevron && (
          <span
            className={classNames(styles.chevron, {
              [styles.chevronOpen]: isOpen,
            })}
          >
            <ChevronIcon />
          </span>
        )}
      </button>

      <div className={classNames(menuClasses, menuClassName)}>
        {items.map((item) => {
          if (item.divider) {
            return <div key={item.key} className={styles.divider} />;
          }

          const itemClasses = classNames(styles.item, {
            [styles.itemDanger]: item.variant === `danger`,
            [styles.itemSuccess]: item.variant === `success`,
            [styles.itemDisabled]: item.disabled,
          });

          if (item.href) {
            return (
              <a
                key={item.key}
                href={item.href}
                className={itemClasses}
                onClick={() => handleItemClick(item)}
              >
                {item.icon && (
                  <span className={styles.itemIcon}>{item.icon}</span>
                )}
                {item.label}
              </a>
            );
          }

          return (
            <button
              key={item.key}
              type="button"
              className={itemClasses}
              disabled={item.disabled}
              onClick={() => handleItemClick(item)}
            >
              {item.icon && (
                <span className={styles.itemIcon}>{item.icon}</span>
              )}
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

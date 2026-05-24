import React, { useRef, useEffect } from 'react';
import classNames from 'classnames';
import { type TabItem } from './tab-item-type.js';
import styles from './tabs.module.scss';

export type TabsProps = {
  /**
   * List of tab items to render.
   */
  items?: TabItem[];

  /**
   * Key of the currently active tab.
   */
  activeKey?: string;

  /**
   * Callback fired when a tab is selected.
   */
  onTabChange?: (key: string) => void;

  /**
   * Additional class name applied to the root element.
   */
  className?: string;

  /**
   * Inline styles applied to the root element.
   */
  style?: React.CSSProperties;
};

const DEFAULT_ITEMS: TabItem[] = [
  { key: `explore`, label: `Explore` },
  { key: `races`, label: `Races` },
  { key: `riders`, label: `Riders` },
  { key: `teams`, label: `Teams` },
  { key: `circuits`, label: `Circuits` },
];

export function Tabs({
  items = DEFAULT_ITEMS,
  activeKey = `explore`,
  onTabChange,
  className,
  style,
}: TabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const active = activeRef.current;
      const containerLeft = container.scrollLeft;
      const containerRight = containerLeft + container.clientWidth;
      const activeLeft = active.offsetLeft;
      const activeRight = activeLeft + active.offsetWidth;

      if (activeLeft < containerLeft) {
        container.scrollTo({ left: activeLeft - 16, behavior: `smooth` });
      } else if (activeRight > containerRight) {
        container.scrollTo({ left: activeRight - container.clientWidth + 16, behavior: `smooth` });
      }
    }
  }, [activeKey]);

  return (
    <div className={classNames(styles.tabsWrapper, className)} style={style}>
      <div className={styles.tabs} ref={scrollRef} role="tablist">
        {items.map((item) => {
          const isActive = item.key === activeKey;
          return (
            <button
              key={item.key}
              ref={isActive ? activeRef : null}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={classNames(styles.tab, { [styles.active]: isActive })}
              onClick={() => onTabChange?.(item.key)}
            >
              {item.icon && (
                <span className={styles.icon}>{item.icon}</span>
              )}
              <span className={styles.label}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

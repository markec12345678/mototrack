import { vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { OfflineCacheIndicator } from './offline-cache-indicator.js';

function renderIndicator(props: {
  tilesCached?: number;
  bytes?: number;
  onCacheCleared?: () => void;
  className?: string;
} = {}) {
  return render(
    <MockProvider>
      <OfflineCacheIndicator tilesCached={0} bytes={0} {...props} />
    </MockProvider>
  );
}

it('renders the pill button', () => {
  const { container } = renderIndicator({ tilesCached: 1500, bytes: 50 * 1024 * 1024 });
  const pill = container.querySelector('button[aria-label="Offline cache status"]');
  expect(pill).toBeTruthy();
});

it('renders the tile count in the pill', () => {
  const { container } = renderIndicator({ tilesCached: 1500, bytes: 50 * 1024 * 1024 });
  const pill = container.querySelector('button[aria-label="Offline cache status"]');
  expect(pill?.textContent).toContain('1,500');
});

it('renders the megabytes value in the pill', () => {
  const { container } = renderIndicator({ tilesCached: 500, bytes: 24 * 1024 * 1024 });
  const pill = container.querySelector('button[aria-label="Offline cache status"]');
  expect(pill?.textContent).toContain('24.0 MB');
});

it('shows readiness score 0 when no tiles are cached', () => {
  const { container } = renderIndicator({ tilesCached: 0, bytes: 0 });
  const pill = container.querySelector('button[aria-label="Offline cache status"]');
  expect(pill?.textContent).toContain('0');
});

it('shows readiness score 100 at maximum values', () => {
  const { container } = renderIndicator({ tilesCached: 5000, bytes: 200 * 1024 * 1024 });
  const pill = container.querySelector('button[aria-label="Offline cache status"]');
  expect(pill?.textContent).toContain('100');
});

it('panel is not expanded by default', () => {
  const { container } = renderIndicator({ tilesCached: 1000, bytes: 30 * 1024 * 1024 });
  const pill = container.querySelector('button[aria-label="Offline cache status"]');
  expect(pill?.getAttribute('aria-expanded')).toBe('false');
});

it('expands the panel when the pill is clicked', () => {
  const { container } = renderIndicator({ tilesCached: 1000, bytes: 30 * 1024 * 1024 });
  const pill = container.querySelector('button[aria-label="Offline cache status"]') as HTMLElement;
  fireEvent.click(pill);
  expect(pill.getAttribute('aria-expanded')).toBe('true');
});

it('collapses the panel on second click', () => {
  const { container } = renderIndicator({ tilesCached: 1000, bytes: 30 * 1024 * 1024 });
  const pill = container.querySelector('button[aria-label="Offline cache status"]') as HTMLElement;
  fireEvent.click(pill);
  fireEvent.click(pill);
  expect(pill.getAttribute('aria-expanded')).toBe('false');
});

it('renders the clear cache button', () => {
  const { container } = renderIndicator({ tilesCached: 800, bytes: 20 * 1024 * 1024 });
  const pill = container.querySelector('button[aria-label="Offline cache status"]') as HTMLElement;
  fireEvent.click(pill);
  const buttons = container.querySelectorAll('button');
  const clearBtn = Array.from(buttons).find((b) => b.textContent?.includes('Clear Cache'));
  expect(clearBtn).toBeTruthy();
});

it('clear button is disabled when no tiles are cached', () => {
  const { container } = renderIndicator({ tilesCached: 0, bytes: 0 });
  const pill = container.querySelector('button[aria-label="Offline cache status"]') as HTMLElement;
  fireEvent.click(pill);
  const buttons = container.querySelectorAll('button');
  const clearBtn = Array.from(buttons).find((b) => b.textContent?.includes('Clear Cache')) as HTMLButtonElement;
  expect(clearBtn?.disabled).toBe(true);
});

it('clear button is enabled when tiles are cached', () => {
  const { container } = renderIndicator({ tilesCached: 500, bytes: 15 * 1024 * 1024 });
  const pill = container.querySelector('button[aria-label="Offline cache status"]') as HTMLElement;
  fireEvent.click(pill);
  const buttons = container.querySelectorAll('button');
  const clearBtn = Array.from(buttons).find((b) => b.textContent?.includes('Clear Cache')) as HTMLButtonElement;
  expect(clearBtn?.disabled).toBe(false);
});

it('calls onCacheCleared callback when clear button is clicked', async () => {
  const onCacheCleared = vi.fn();
  const { container } = renderIndicator({ tilesCached: 500, bytes: 15 * 1024 * 1024, onCacheCleared });
  const pill = container.querySelector('button[aria-label="Offline cache status"]') as HTMLElement;
  fireEvent.click(pill);
  const buttons = container.querySelectorAll('button');
  const clearBtn = Array.from(buttons).find((b) => b.textContent?.includes('Clear Cache')) as HTMLButtonElement;
  fireEvent.click(clearBtn);
  await new Promise((r) => setTimeout(r, 50));
  expect(onCacheCleared).toHaveBeenCalledTimes(1);
});

it('renders three stat cards in the detail panel', () => {
  const { container } = renderIndicator({ tilesCached: 2000, bytes: 60 * 1024 * 1024 });
  const pill = container.querySelector('button[aria-label="Offline cache status"]') as HTMLElement;
  fireEvent.click(pill);
  const panelText = container.textContent ?? '';
  expect(panelText).toContain('Cached Tiles');
  expect(panelText).toContain('Storage Used');
  expect(panelText).toContain('Readiness Score');
});

it('applies custom className to the root element', () => {
  const { container } = renderIndicator({ className: 'my-custom-class' });
  const root = container.firstElementChild;
  expect(root?.classList.contains('my-custom-class')).toBe(true);
});

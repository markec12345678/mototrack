import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { CountryBrowser } from './country-browser.js';
import { mockCountryBrowserRoads } from './country-browser.mock.js';
import styles from './country-browser.module.scss';

function renderWithProvider(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

it('should render the browser title', () => {
  const { container } = renderWithProvider(
    <CountryBrowser roads={mockCountryBrowserRoads} title="Browse by Country" />
  );
  const title = container.querySelector(`.${styles.browserTitle}`);
  expect(title).toBeTruthy();
  expect(title?.textContent).toBe(`Browse by Country`);
});

it('should render the browser subtitle', () => {
  const { container } = renderWithProvider(
    <CountryBrowser roads={mockCountryBrowserRoads} subtitle="Explore the Balkans" />
  );
  const subtitle = container.querySelector(`.${styles.browserSubtitle}`);
  expect(subtitle).toBeTruthy();
  expect(subtitle?.textContent).toBe(`Explore the Balkans`);
});

it('should render one accordion item per country', () => {
  const { container } = renderWithProvider(
    <CountryBrowser roads={mockCountryBrowserRoads} />
  );
  const items = container.querySelectorAll(`.${styles.accordionItem}`);
  const uniqueCountries = new Set(mockCountryBrowserRoads.map((r) => r.country));
  expect(items.length).toBe(uniqueCountries.size);
});

it('should show country name in each trigger', () => {
  const { container } = renderWithProvider(
    <CountryBrowser roads={mockCountryBrowserRoads} />
  );
  const names = container.querySelectorAll(`.${styles.countryName}`);
  const textContents = Array.from(names).map((n) => n.textContent);
  expect(textContents).toContain(`Slovenia`);
  expect(textContents).toContain(`Croatia`);
  expect(textContents).toContain(`Romania`);
});

it('should show road count badge per country', () => {
  const { container } = renderWithProvider(
    <CountryBrowser roads={mockCountryBrowserRoads} />
  );
  const badges = container.querySelectorAll(`.${styles.roadCount}`);
  expect(badges.length).toBeGreaterThan(0);
  const siRoads = mockCountryBrowserRoads.filter((r) => r.country === `SI`);
  const badgeTexts = Array.from(badges).map((b) => b.textContent);
  expect(badgeTexts).toContain(String(siRoads.length));
});

it('should start with panels collapsed when no defaultOpenCountries', () => {
  const { container } = renderWithProvider(
    <CountryBrowser roads={mockCountryBrowserRoads} />
  );
  const openPanels = container.querySelectorAll(`.${styles.accordionPanelOpen}`);
  expect(openPanels.length).toBe(0);
});

it('should expand a country panel when its trigger is clicked', () => {
  const { container } = renderWithProvider(
    <CountryBrowser roads={mockCountryBrowserRoads} />
  );
  const triggers = container.querySelectorAll<HTMLButtonElement>(`.${styles.accordionTrigger}`);
  expect(triggers.length).toBeGreaterThan(0);
  fireEvent.click(triggers[0]);
  const openPanels = container.querySelectorAll(`.${styles.accordionPanelOpen}`);
  expect(openPanels.length).toBe(1);
});

it('should collapse an expanded panel when its trigger is clicked again', () => {
  const { container } = renderWithProvider(
    <CountryBrowser roads={mockCountryBrowserRoads} defaultOpenCountries={[`SI`]} />
  );
  const openBefore = container.querySelectorAll(`.${styles.accordionPanelOpen}`);
  expect(openBefore.length).toBe(1);

  const triggers = container.querySelectorAll<HTMLButtonElement>(`.${styles.accordionTrigger}`);
  const siTrigger = Array.from(triggers).find((t) =>
    t.querySelector(`.${styles.countryName}`)?.textContent === `Slovenia`
  );
  expect(siTrigger).toBeTruthy();
  fireEvent.click(siTrigger!);

  const openAfter = container.querySelectorAll(`.${styles.accordionPanelOpen}`);
  expect(openAfter.length).toBe(0);
});

it('should pre-expand countries listed in defaultOpenCountries', () => {
  const { container } = renderWithProvider(
    <CountryBrowser
      roads={mockCountryBrowserRoads}
      defaultOpenCountries={[`SI`, `HR`]}
    />
  );
  const openPanels = container.querySelectorAll(`.${styles.accordionPanelOpen}`);
  expect(openPanels.length).toBe(2);
});

it('should show empty state when no roads are provided', () => {
  const { container } = renderWithProvider(<CountryBrowser roads={[]} />);
  const emptyState = container.querySelector(`.${styles.emptyState}`);
  expect(emptyState).toBeTruthy();
});

it('should apply open styles to the trigger when expanded', () => {
  const { container } = renderWithProvider(
    <CountryBrowser roads={mockCountryBrowserRoads} defaultOpenCountries={[`RO`]} />
  );
  const openTriggers = container.querySelectorAll(`.${styles.accordionTriggerOpen}`);
  expect(openTriggers.length).toBe(1);
});

it('should call onRoadClick when a road card is clicked', () => {
  const handleClick = vi.fn();
  const { container } = renderWithProvider(
    <CountryBrowser
      roads={mockCountryBrowserRoads}
      defaultOpenCountries={[`SI`]}
      onRoadClick={handleClick}
    />
  );
  const openPanel = container.querySelector(`.${styles.accordionPanelOpen}`);
  const cards = openPanel?.querySelectorAll(`[class*="roadCard"]`);
  expect(cards && cards.length).toBeGreaterThan(0);
  if (cards && cards.length > 0) {
    fireEvent.click(cards[0]);
    expect(handleClick).toHaveBeenCalled();
  }
});

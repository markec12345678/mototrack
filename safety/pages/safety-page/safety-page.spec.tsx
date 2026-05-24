import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { SafetyPage } from './safety-page.js';
import { mockIceContacts, mockEmergencyOverrideSlovenia } from './safety-page.mock.js';
import styles from './safety-page.module.scss';

function renderPage(props: Partial<React.ComponentProps<typeof SafetyPage>> = {}) {
  return render(
    <MockProvider>
      <SafetyPage {...props} />
    </MockProvider>
  );
}

describe('SafetyPage', () => {
  it('renders the page heading', () => {
    const { container } = renderPage();
    const heading = container.querySelector(`h1`);
    expect(heading).toBeTruthy();
    expect(heading?.textContent).toContain(`Varnostni center`);
  });

  it('renders the SOS FAB button', () => {
    const { container } = renderPage();
    const fab = container.querySelector(`.${styles.sosFab}`);
    expect(fab).toBeTruthy();
  });

  it('renders tabs navigation', () => {
    const { container } = renderPage();
    const tabs = container.querySelectorAll(`button[role="tab"]`);
    expect(tabs.length).toBeGreaterThanOrEqual(4);
  });

  it('renders ICE tab by default', () => {
    const { container } = renderPage({ initialTab: `ice` });
    const tabContent = container.querySelector(`.${styles.tabContent}`);
    expect(tabContent).toBeTruthy();
  });

  it('renders ICE contacts when provided', () => {
    const { container } = renderPage({ mockContacts: mockIceContacts, initialTab: `ice` });
    const contactsList = container.querySelector(`.${styles.contactsList}`);
    expect(contactsList).toBeTruthy();
    const contactNames = container.querySelectorAll(`.${styles.contactName}`);
    expect(contactNames.length).toBe(mockIceContacts.length);
  });

  it('renders primary badge for primary contact', () => {
    const { container } = renderPage({ mockContacts: mockIceContacts, initialTab: `ice` });
    const primaryBadge = container.querySelector(`.${styles.primaryBadge}`);
    expect(primaryBadge).toBeTruthy();
    expect(primaryBadge?.textContent).toContain(`Primarni`);
  });

  it('shows add contact form when button is clicked', () => {
    const { container } = renderPage({ mockContacts: [], initialTab: `ice` });
    const addButton = Array.from(container.querySelectorAll(`button`)).find(
      (btn) => btn.textContent?.includes(`Dodaj kontakt`)
    );
    expect(addButton).toBeTruthy();
    fireEvent.click(addButton!);
    const formTitle = container.querySelector(`.${styles.formTitle}`);
    expect(formTitle).toBeTruthy();
  });

  it('renders numbers tab when selected', () => {
    const { container } = renderPage({
      initialTab: `numbers`,
      mockEmergencyOverride: mockEmergencyOverrideSlovenia,
    });
    const bigCallButton = container.querySelector(`.${styles.bigCallButton}`);
    expect(bigCallButton).toBeTruthy();
  });

  it('renders big call 112 button in numbers tab', () => {
    const { container } = renderPage({ initialTab: `numbers` });
    const callBtn = container.querySelector(`.${styles.bigCallButton}`);
    expect(callBtn).toBeTruthy();
    expect(callBtn?.getAttribute(`href`)).toBe(`tel:112`);
  });

  it('renders emergency grid cards in numbers tab', () => {
    const { container } = renderPage({ initialTab: `numbers` });
    const cards = container.querySelectorAll(`.${styles.emergencyCard}`);
    expect(cards.length).toBe(4);
  });

  it('renders borders tab with crossing list', () => {
    const { container } = renderPage({ initialTab: `borders` });
    const borderList = container.querySelector(`.${styles.borderList}`);
    expect(borderList).toBeTruthy();
    const borderHeaders = container.querySelectorAll(`.${styles.borderCardHeader}`);
    expect(borderHeaders.length).toBe(10);
  });

  it('expands border crossing on click', () => {
    const { container } = renderPage({ initialTab: `borders` });
    const firstHeader = container.querySelector(`.${styles.borderCardHeader}`);
    expect(firstHeader).toBeTruthy();
    fireEvent.click(firstHeader!);
    const body = container.querySelector(`.${styles.borderCardBody}`);
    expect(body).toBeTruthy();
  });

  it('renders reports tab', () => {
    const { container } = renderPage({ initialTab: `reports` });
    const tabContent = container.querySelector(`.${styles.tabContent}`);
    expect(tabContent).toBeTruthy();
  });

  it('switches tabs when tab button is clicked', () => {
    const { container } = renderPage({ initialTab: `ice` });
    const tabs = container.querySelectorAll(`button[role="tab"]`);
    const numbersTab = Array.from(tabs).find((tab) =>
      tab.textContent?.includes(`Reševalne številke`)
    );
    expect(numbersTab).toBeTruthy();
    fireEvent.click(numbersTab!);
    const bigCallButton = container.querySelector(`.${styles.bigCallButton}`);
    expect(bigCallButton).toBeTruthy();
  });

  it('renders manual override toggle in numbers tab', () => {
    const { container } = renderPage({ initialTab: `numbers` });
    const overrideToggle = container.querySelector(`.${styles.overrideToggle}`);
    expect(overrideToggle).toBeTruthy();
  });

  it('shows override form when toggle is clicked', () => {
    const { container } = renderPage({ initialTab: `numbers` });
    const overrideBtn = container.querySelector(`.${styles.overrideToggle} button`);
    expect(overrideBtn).toBeTruthy();
    fireEvent.click(overrideBtn!);
    const overrideGrid = container.querySelector(`.${styles.overrideGrid}`);
    expect(overrideGrid).toBeTruthy();
  });
});

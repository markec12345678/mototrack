import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { SosDialog } from './sos-dialog.js';
import {
  mockIceContacts,
  mockEmergencyNumbersSlovenia,
  mockLocationSlovenia,
} from './sos-dialog.mock.js';
import styles from './sos-dialog.module.scss';

function renderDialog(props: Partial<React.ComponentProps<typeof SosDialog>> = {}) {
  return render(
    <MockProvider>
      <SosDialog
        open
        onClose={() => {}}
        iceContacts={mockIceContacts}
        emergencyNumbers={mockEmergencyNumbersSlovenia}
        countryName={mockLocationSlovenia.countryName}
        countryFlag={mockLocationSlovenia.countryFlag}
        lat={mockLocationSlovenia.lat}
        lng={mockLocationSlovenia.lng}
        {...props}
      />
    </MockProvider>
  );
}

it('should not render when open is false', () => {
  const { container } = render(
    <MockProvider>
      <SosDialog open={false} onClose={() => {}} />
    </MockProvider>
  );
  const backdrop = container.querySelector(`.${styles.backdrop}`);
  expect(backdrop).toBeNull();
});

it('should render the backdrop when open is true', () => {
  const { container } = renderDialog();
  const backdrop = container.querySelector(`.${styles.backdrop}`);
  expect(backdrop).toBeTruthy();
});

it('should render the SOS label', () => {
  const { container } = renderDialog();
  const label = container.querySelector(`.${styles.sosLabelText}`);
  expect(label).toBeTruthy();
  expect(label?.textContent).toBe(`SOS`);
});

it('should render the country name and flag', () => {
  const { container } = renderDialog();
  const badge = container.querySelector(`.${styles.countryBadgeText}`);
  expect(badge?.textContent).toBe(`Slovenia`);
});

it('should render the big 112 call button', () => {
  const { container } = renderDialog();
  const callBtn = container.querySelector(`.${styles.callButton}`);
  expect(callBtn).toBeTruthy();
  expect(callBtn?.getAttribute(`href`)).toContain(`tel:`);
});

it('should render emergency number cards', () => {
  const { container } = renderDialog();
  const cards = container.querySelectorAll(`.${styles.emergencyCard}`);
  expect(cards.length).toBe(3);
});

it('should render police emergency card with correct number', () => {
  const { container } = renderDialog();
  const numbers = container.querySelectorAll(`.${styles.emergencyCardNumber}`);
  const numberTexts = Array.from(numbers).map((n) => n.textContent);
  expect(numberTexts).toContain(`113`);
});

it('should render ICE contacts list', () => {
  const { container } = renderDialog();
  const items = container.querySelectorAll(`.${styles.iceItem}`);
  expect(items.length).toBe(mockIceContacts.length);
});

it('should render primary ICE contact with primary class', () => {
  const { container } = renderDialog();
  const primaryItem = container.querySelector(`.${styles.primary}`);
  expect(primaryItem).toBeTruthy();
});

it('should render ICE contact names', () => {
  const { container } = renderDialog();
  const names = container.querySelectorAll(`.${styles.iceName}`);
  const nameTexts = Array.from(names).map((n) => n.textContent);
  expect(nameTexts).toContain(`Ana Horvat`);
  expect(nameTexts).toContain(`Marko Horvat`);
});

it('should render ICE contact tel: links', () => {
  const { container } = renderDialog();
  const callLinks = container.querySelectorAll(`.${styles.iceCallLink}`);
  expect(callLinks.length).toBe(mockIceContacts.length);
  const firstHref = callLinks[0]?.getAttribute(`href`) ?? ``;
  expect(firstHref.startsWith(`tel:`)).toBe(true);
});

it('should render share location buttons', () => {
  const { container } = renderDialog();
  const shareButtons = container.querySelectorAll(`.${styles.shareButton}`);
  expect(shareButtons.length).toBe(4);
});

it('should call onClose when close button is clicked', () => {
  const onClose = vi.fn();
  const { container } = renderDialog({ onClose });
  const closeBtn = container.querySelector(`.${styles.closeButton}`) as HTMLButtonElement;
  fireEvent.click(closeBtn);
  expect(onClose).toHaveBeenCalledTimes(1);
});

it('should call onClose when backdrop is clicked', () => {
  const onClose = vi.fn();
  const { container } = renderDialog({ onClose });
  const backdrop = container.querySelector(`.${styles.backdrop}`) as HTMLDivElement;
  fireEvent.click(backdrop);
  expect(onClose).toHaveBeenCalledTimes(1);
});

it('should render empty state when no ICE contacts provided', () => {
  const { container } = renderDialog({ iceContacts: [] });
  const empty = container.querySelector(`.${styles.iceEmpty}`);
  expect(empty).toBeTruthy();
});

it('should render share section grid', () => {
  const { container } = renderDialog();
  const shareGrid = container.querySelector(`.${styles.shareGrid}`);
  expect(shareGrid).toBeTruthy();
});

it('should render share buttons as enabled when location coords are provided', () => {
  const { container } = renderDialog();
  const shareButtons = container.querySelectorAll(`.${styles.shareButton}`);
  shareButtons.forEach((btn) => {
    expect((btn as HTMLButtonElement).disabled).toBe(false);
  });
});

it('should render primary badge for primary ICE contact', () => {
  const { container } = renderDialog();
  const badge = container.querySelector(`.${styles.icePrimaryBadge}`);
  expect(badge).toBeTruthy();
  expect(badge?.textContent).toBe(`Primary`);
});

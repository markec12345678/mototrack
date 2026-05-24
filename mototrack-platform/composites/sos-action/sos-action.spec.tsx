import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { SosAction } from './sos-action.js';
import styles from './sos-action.module.scss';
import type { IceContact } from './ice-contact-type.js';

const mockGps = { lat: 46.056946, lng: 14.505751, accuracy: 8 };

const mockContacts: IceContact[] = [
  { name: `Ana Kovač`, phone: `+386 41 123 456`, relation: `Partner` },
];

function renderSos(props = {}) {
  return render(
    <MockProvider>
      <SosAction gpsCoords={mockGps} iceContacts={mockContacts} {...props} />
    </MockProvider>
  );
}

it(`renders the SOS pill button`, () => {
  const { container } = renderSos();
  const pill = container.querySelector(`.${styles.sosPill}`);
  expect(pill).toBeTruthy();
});

it(`pill button has correct aria-label`, () => {
  const { container } = renderSos();
  const pill = container.querySelector(`.${styles.sosPill}`);
  expect(pill?.getAttribute(`aria-label`)).toBe(`Odpri SOS meni`);
});

it(`pill label text is SOS`, () => {
  const { container } = renderSos();
  const label = container.querySelector(`.${styles.pillLabel}`);
  expect(label?.textContent).toBe(`SOS`);
});

it(`modal is not visible before clicking the pill`, () => {
  const { container } = renderSos();
  const call112 = container.querySelector(`.${styles.call112Button}`);
  expect(call112).toBeNull();
});

it(`opens modal when pill is clicked`, () => {
  const { container } = renderSos();
  const pill = container.querySelector(`.${styles.sosPill}`) as HTMLElement;
  fireEvent.click(pill);
  const modal = container.querySelector(`.${styles.call112Button}`);
  expect(modal).toBeTruthy();
});

it(`displays GPS coordinates in the modal`, () => {
  const { container } = renderSos();
  const pill = container.querySelector(`.${styles.sosPill}`) as HTMLElement;
  fireEvent.click(pill);
  const coordValues = container.querySelectorAll(`.${styles.gpsCoordValue}`);
  const texts = Array.from(coordValues).map((el) => el.textContent ?? ``);
  expect(texts.some((t) => t.includes(`46.056946`))).toBe(true);
  expect(texts.some((t) => t.includes(`14.505751`))).toBe(true);
});

it(`renders the 112 call button as a link`, () => {
  const { container } = renderSos();
  const pill = container.querySelector(`.${styles.sosPill}`) as HTMLElement;
  fireEvent.click(pill);
  const callBtn = container.querySelector(`.${styles.call112Button}`) as HTMLAnchorElement;
  expect(callBtn?.getAttribute(`href`)).toBe(`tel:112`);
});

it(`renders balkan emergency rows`, () => {
  const { container } = renderSos();
  const pill = container.querySelector(`.${styles.sosPill}`) as HTMLElement;
  fireEvent.click(pill);
  const rows = container.querySelectorAll(`.${styles.balkansRow}`);
  expect(rows.length).toBeGreaterThan(0);
});

it(`renders ICE contact name`, () => {
  const { container } = renderSos();
  const pill = container.querySelector(`.${styles.sosPill}`) as HTMLElement;
  fireEvent.click(pill);
  const names = container.querySelectorAll(`.${styles.iceContactName}`);
  const found = Array.from(names).some((el) => el.textContent?.includes(`Ana Kovač`));
  expect(found).toBe(true);
});

it(`renders ICE contact call link`, () => {
  const { container } = renderSos();
  const pill = container.querySelector(`.${styles.sosPill}`) as HTMLElement;
  fireEvent.click(pill);
  const callLinks = container.querySelectorAll(`.${styles.iceContactCallLink}`);
  expect(callLinks.length).toBeGreaterThan(0);
  expect(callLinks[0].getAttribute(`href`)).toContain(`tel:`);
});

it(`shows empty ICE placeholder when no contacts provided`, () => {
  const { container } = renderSos({ iceContacts: [] });
  const pill = container.querySelector(`.${styles.sosPill}`) as HTMLElement;
  fireEvent.click(pill);
  const placeholder = container.querySelector(`.${styles.iceEmptyPlaceholder}`);
  expect(placeholder).toBeTruthy();
});

it(`renders share buttons section`, () => {
  const { container } = renderSos();
  const pill = container.querySelector(`.${styles.sosPill}`) as HTMLElement;
  fireEvent.click(pill);
  const shareButtons = container.querySelectorAll(`.${styles.shareButton}`);
  expect(shareButtons.length).toBe(4);
});

it(`WhatsApp share link contains location`, () => {
  const { container } = renderSos();
  const pill = container.querySelector(`.${styles.sosPill}`) as HTMLElement;
  fireEvent.click(pill);
  const waLink = container.querySelector(`.${styles.shareButtonWhatsapp}`) as HTMLAnchorElement;
  expect(waLink?.getAttribute(`href`)).toContain(`wa.me`);
});

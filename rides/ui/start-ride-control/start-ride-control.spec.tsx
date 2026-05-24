import { render, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { StartRideControl } from './start-ride-control.js';

function renderComponent(props = {}) {
  return render(
    <MockProvider>
      <StartRideControl {...props} />
    </MockProvider>
  );
}

it(`renders the start ride button in idle state`, () => {
  const { getByText } = renderComponent();
  const btn = getByText(`Začni vožnjo`);
  expect(btn).toBeTruthy();
});

it(`opens the pre-ride checklist modal when the start button is clicked`, () => {
  const { getByText } = renderComponent();
  fireEvent.click(getByText(`Začni vožnjo`));
  expect(getByText(`Pred-vožnja preveritev`)).toBeTruthy();
});

it(`renders gear and weather checklist sections in the modal`, () => {
  const { getByText } = renderComponent();
  fireEvent.click(getByText(`Začni vožnjo`));
  expect(getByText(`🏍️ Oprema`)).toBeTruthy();
  expect(getByText(`🌤️ Vreme`)).toBeTruthy();
});

it(`renders all checklist items in the modal`, () => {
  const { getByText } = renderComponent();
  fireEvent.click(getByText(`Začni vožnjo`));
  expect(getByText(`Čelada in zaščitna oprema`)).toBeTruthy();
  expect(getByText(`Vremenski pogoji so primerni`)).toBeTruthy();
});

it(`shows progress label in the checklist modal`, () => {
  const { getByText } = renderComponent();
  fireEvent.click(getByText(`Začni vožnjo`));
  expect(getByText(`0 / 8 preverjeno`)).toBeTruthy();
});

it(`the start button inside the modal is disabled when not all items are checked`, () => {
  const { getByText, getAllByText } = renderComponent();
  fireEvent.click(getByText(`Začni vožnjo`));
  const allMatches = getAllByText(`Začni vožnjo`);
  const modalBtn = allMatches[allMatches.length - 1] as HTMLButtonElement;
  expect(modalBtn.disabled).toBe(true);
});

it(`enables the start button in modal when all items are checked via check-all`, () => {
  const { getByText, getAllByText } = renderComponent();
  fireEvent.click(getByText(`Začni vožnjo`));
  fireEvent.click(getByText(`Označi vse`));
  const modalStartBtns = getAllByText(`Začni vožnjo`);
  const modalBtn = modalStartBtns[modalStartBtns.length - 1] as HTMLButtonElement;
  expect(modalBtn.disabled).toBe(false);
});

it(`updates progress label after checking all items`, () => {
  const { getByText } = renderComponent();
  fireEvent.click(getByText(`Začni vožnjo`));
  fireEvent.click(getByText(`Označi vse`));
  expect(getByText(`8 / 8 preverjeno`)).toBeTruthy();
});

it(`toggles check-all button label between "Označi vse" and "Počisti vse"`, () => {
  const { getByText } = renderComponent();
  fireEvent.click(getByText(`Začni vožnjo`));

  fireEvent.click(getByText(`Označi vse`));
  expect(getByText(`Počisti vse`)).toBeTruthy();

  fireEvent.click(getByText(`Počisti vse`));
  expect(getByText(`Označi vse`)).toBeTruthy();
});

it(`closes the checklist modal when cancel is clicked`, () => {
  const { getByText, queryByText } = renderComponent();
  fireEvent.click(getByText(`Začni vožnjo`));
  expect(getByText(`Pred-vožnja preveritev`)).toBeTruthy();

  fireEvent.click(getByText(`Prekliči`));
  expect(queryByText(`Pred-vožnja preveritev`)).toBeFalsy();
});

it(`checking individual items updates the progress count`, () => {
  const { getByText } = renderComponent();
  fireEvent.click(getByText(`Začni vožnjo`));
  fireEvent.click(getByText(`Čelada in zaščitna oprema`));
  expect(getByText(`1 / 8 preverjeno`)).toBeTruthy();
});

it(`calls onRideDiscarded when discard is clicked in save modal`, () => {
  const onRideDiscarded = vi.fn();
  const { getByText, getAllByText } = renderComponent({ onRideDiscarded });

  fireEvent.click(getByText(`Začni vožnjo`));
  fireEvent.click(getByText(`Označi vse`));

  const modalStartBtns = getAllByText(`Začni vožnjo`);
  fireEvent.click(modalStartBtns[modalStartBtns.length - 1]);

  fireEvent.click(getByText(`Ustavi`));
  fireEvent.click(getByText(`Zavrzi`));

  expect(onRideDiscarded).toHaveBeenCalledTimes(1);
});

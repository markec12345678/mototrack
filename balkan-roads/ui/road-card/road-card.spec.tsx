import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { RoadCard } from './road-card.js';
import { mockVrsicPass, mockTransfagarasan, mockAdriaticCoast } from './road-card.mock.js';
import styles from './road-card.module.scss';

function renderCard(props = {}) {
  return render(
    <MockProvider>
      <RoadCard {...mockVrsicPass} {...props} />
    </MockProvider>
  );
}

it('should render the road name', () => {
  const { getByText } = renderCard();
  expect(getByText('Vršič Pass')).toBeTruthy();
});

it('should render the road type badge', () => {
  const { getByText } = renderCard();
  expect(getByText('Pass')).toBeTruthy();
});

it('should render the difficulty badge', () => {
  const { getByText } = renderCard();
  expect(getByText('Hard')).toBeTruthy();
});

it('should render the length in km', () => {
  const { getByText } = renderCard();
  expect(getByText('25.4 km')).toBeTruthy();
});

it('should render the rating value', () => {
  const { getByText } = renderCard();
  expect(getByText('9.2')).toBeTruthy();
});

it('should apply clickable class when onClick is provided', () => {
  const onClick = () => {};
  const { container } = renderCard({ onClick });
  const card = container.querySelector(`.${styles.clickable}`);
  expect(card).toBeTruthy();
});

it('should not apply clickable class when onClick is not provided', () => {
  const { container } = renderCard();
  const card = container.querySelector(`.${styles.clickable}`);
  expect(card).toBeNull();
});

it('should call onClick with the road id when clicked', () => {
  let clickedId = '';
  const onClick = (id: string) => { clickedId = id; };
  const { container } = renderCard({ onClick });
  const card = container.querySelector(`.${styles.clickable}`) as HTMLElement;
  fireEvent.click(card);
  expect(clickedId).toBe('vrsic-pass');
});

it('should render the Transfagarasan road name', () => {
  const { getByText } = render(
    <MockProvider>
      <RoadCard {...mockTransfagarasan} />
    </MockProvider>
  );
  expect(getByText('Transfăgărășan')).toBeTruthy();
});

it('should render the Expert difficulty for Transfagarasan', () => {
  const { getByText } = render(
    <MockProvider>
      <RoadCard {...mockTransfagarasan} />
    </MockProvider>
  );
  expect(getByText('Expert')).toBeTruthy();
});

it('should render the Adriatic Coastal Road name', () => {
  const { getByText } = render(
    <MockProvider>
      <RoadCard {...mockAdriaticCoast} />
    </MockProvider>
  );
  expect(getByText('Adriatic Coastal Road')).toBeTruthy();
});

it('should render the Coastal type badge', () => {
  const { getByText } = render(
    <MockProvider>
      <RoadCard {...mockAdriaticCoast} />
    </MockProvider>
  );
  expect(getByText('Coastal')).toBeTruthy();
});

it('should render the road card inner container', () => {
  const { container } = renderCard();
  const inner = container.querySelector(`.${styles.inner}`);
  expect(inner).toBeTruthy();
});

it('should render the footer with length and rating', () => {
  const { container } = renderCard();
  const footer = container.querySelector(`.${styles.footer}`);
  expect(footer).toBeTruthy();
});

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RoundTripConfig } from './round-trip-config.js';
import styles from './round-trip-config.module.scss';

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

it(`renders the card with default heading`, () => {
  const { getByText } = renderWithRouter(<RoundTripConfig />);
  expect(getByText(`Configure Your Route`)).toBeTruthy();
});

it(`renders the Round Trip v2 badge`, () => {
  const { getByText } = renderWithRouter(<RoundTripConfig />);
  expect(getByText(`Round Trip v2`)).toBeTruthy();
});

it(`renders the Generate button`, () => {
  const { getByText } = renderWithRouter(<RoundTripConfig />);
  expect(getByText(`Generate Round Trip`)).toBeTruthy();
});

it(`renders the clockwise and counterclockwise direction buttons`, () => {
  const { getByText } = renderWithRouter(<RoundTripConfig />);
  expect(getByText(`Clockwise`)).toBeTruthy();
  expect(getByText(`Counter-CW`)).toBeTruthy();
});

it(`renders default distance stat`, () => {
  const { getAllByText } = renderWithRouter(<RoundTripConfig defaultDistance={120} />);
  const matches = getAllByText(`120`);
  expect(matches.length).toBeGreaterThan(0);
});

it(`renders default twistiness stat`, () => {
  const { getAllByText } = renderWithRouter(<RoundTripConfig defaultTwistiness={60} />);
  const matches = getAllByText(`60`);
  expect(matches.length).toBeGreaterThan(0);
});

it(`calls onGenerate when the generate button is clicked`, () => {
  const handleGenerate = vi.fn();
  const { getByText: getGenerateText } = renderWithRouter(
    <RoundTripConfig
      defaultDistance={100}
      defaultTwistiness={50}
      defaultDirection="clockwise"
      onGenerate={handleGenerate}
    />
  );
  const button = getGenerateText(`Generate Round Trip`).closest(`button`);
  if (button) {
    fireEvent.click(button);
  }
  expect(handleGenerate).toHaveBeenCalledWith({
    distanceKm: 100,
    twistiness: 50,
    direction: `clockwise`,
  });
});

it(`switches direction to counterclockwise when that button is clicked`, () => {
  const { getByText, container } = renderWithRouter(
    <RoundTripConfig defaultDirection="clockwise" />
  );
  const ccwButton = getByText(`Counter-CW`).closest(`button`);
  if (ccwButton) {
    fireEvent.click(ccwButton);
  }
  const activeButtons = container.querySelectorAll(`.${styles.directionBtnActive}`);
  let foundCcw = false;
  activeButtons.forEach((btn) => {
    if (btn.textContent?.includes(`Counter-CW`)) {
      foundCcw = true;
    }
  });
  expect(foundCcw).toBe(true);
});

it(`shows loading text when loading prop is true`, () => {
  const { getByText } = renderWithRouter(<RoundTripConfig loading />);
  expect(getByText(`Generating Route...`)).toBeTruthy();
});

it(`renders the subtitle description`, () => {
  const { getByText } = renderWithRouter(<RoundTripConfig />);
  expect(getByText(`Set your preferences and generate a circular motorcycle route.`)).toBeTruthy();
});

it(`renders the Distance stat label`, () => {
  const { getByText } = renderWithRouter(<RoundTripConfig />);
  expect(getByText(`Distance`)).toBeTruthy();
});

it(`renders the Twistiness stat label`, () => {
  const { getAllByText } = renderWithRouter(<RoundTripConfig />);
  const matches = getAllByText(`Twistiness`);
  expect(matches.length).toBeGreaterThan(0);
});

it(`renders the Est. Time stat label`, () => {
  const { getByText } = renderWithRouter(<RoundTripConfig />);
  expect(getByText(`Est. Time`)).toBeTruthy();
});

it(`applies custom className to the root card`, () => {
  const { container } = renderWithRouter(
    <RoundTripConfig className="my-custom-class" />
  );
  const card = container.querySelector(`.my-custom-class`);
  expect(card).toBeTruthy();
});

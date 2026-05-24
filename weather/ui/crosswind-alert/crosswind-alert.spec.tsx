import * as React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { CrosswindAlert } from './crosswind-alert';
import styles from './crosswind-alert.module.scss';

function renderAlert(props: Partial<React.ComponentProps<typeof CrosswindAlert>> = {}) {
  return render(
    <MockProvider>
      <CrosswindAlert headingDeg={90} {...props} />
    </MockProvider>
  );
}

it(`renders nothing when level is none`, () => {
  const { container } = renderAlert({ levelOverride: `none` });
  const overlay = container.querySelector(`.${styles.overlay}`);
  expect(overlay).toBeNull();
});

it(`renders the moderate overlay when level is moderate`, () => {
  const { container } = renderAlert({
    levelOverride: `moderate`,
    crossKmhOverride: 22,
  });
  const overlay = container.querySelector(`.${styles.overlay}`);
  expect(overlay).toBeTruthy();
  expect(overlay?.classList.contains(styles.moderate)).toBe(true);
});

it(`renders the strong overlay when level is strong`, () => {
  const { container } = renderAlert({
    levelOverride: `strong`,
    crossKmhOverride: 41,
  });
  const overlay = container.querySelector(`.${styles.overlay}`);
  expect(overlay).toBeTruthy();
  expect(overlay?.classList.contains(styles.strong)).toBe(true);
});

it(`renders the dangerous overlay when level is dangerous`, () => {
  const { container } = renderAlert({
    levelOverride: `dangerous`,
    crossKmhOverride: 68,
  });
  const overlay = container.querySelector(`.${styles.overlay}`);
  expect(overlay).toBeTruthy();
  expect(overlay?.classList.contains(styles.dangerous)).toBe(true);
});

it(`displays USTAVI SE! text when level is dangerous`, () => {
  const { getByText } = renderAlert({
    levelOverride: `dangerous`,
    crossKmhOverride: 68,
  });
  expect(getByText(`USTAVI SE!`)).toBeTruthy();
});

it(`displays the crosswind speed value`, () => {
  const { getByText } = renderAlert({
    levelOverride: `strong`,
    crossKmhOverride: 41,
  });
  expect(getByText(`41`)).toBeTruthy();
});

it(`displays the moderate label text`, () => {
  const { getByText } = renderAlert({
    levelOverride: `moderate`,
    crossKmhOverride: 22,
  });
  expect(getByText(`Bočni veter`)).toBeTruthy();
});

it(`displays the strong label text`, () => {
  const { getByText } = renderAlert({
    levelOverride: `strong`,
    crossKmhOverride: 41,
  });
  expect(getByText(`Močan bočni veter`)).toBeTruthy();
});

it(`renders the pulse ring only for dangerous level`, () => {
  const { container: dangerContainer } = renderAlert({
    levelOverride: `dangerous`,
    crossKmhOverride: 68,
  });
  const { container: strongContainer } = renderAlert({
    levelOverride: `strong`,
    crossKmhOverride: 41,
  });

  const dangerPulse = dangerContainer.querySelector(`.${styles.pulseRing}`);
  const strongPulse = strongContainer.querySelector(`.${styles.pulseRing}`);

  expect(dangerPulse).toBeTruthy();
  expect(strongPulse).toBeNull();
});

it(`applies a custom className to the overlay`, () => {
  const { container } = renderAlert({
    levelOverride: `moderate`,
    crossKmhOverride: 22,
    className: `my-custom-class`,
  });
  const overlay = container.querySelector(`.my-custom-class`);
  expect(overlay).toBeTruthy();
});

it(`has role=alert for accessibility`, () => {
  const { container } = renderAlert({
    levelOverride: `moderate`,
    crossKmhOverride: 22,
  });
  const overlay = container.querySelector(`[role="alert"]`);
  expect(overlay).toBeTruthy();
});

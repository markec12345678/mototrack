import React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Flex } from './flex.js';
import styles from './flex.module.scss';

function renderFlex(ui: React.ReactElement) {
  return render(<MockProvider noTheme noRouter>{ui}</MockProvider>);
}

it('should render children inside the flex container', () => {
  const { getByText } = renderFlex(
    <Flex>
      <span>Child A</span>
      <span>Child B</span>
    </Flex>
  );
  expect(getByText('Child A')).toBeTruthy();
  expect(getByText('Child B')).toBeTruthy();
});

it('should apply the flex class', () => {
  const { container } = renderFlex(<Flex><span>test</span></Flex>);
  const el = container.firstChild as HTMLElement;
  expect(el.classList.contains(styles.flex)).toBe(true);
});

it('should apply the inline class when inline prop is set', () => {
  const { container } = renderFlex(<Flex inline><span>test</span></Flex>);
  const el = container.firstChild as HTMLElement;
  expect(el.classList.contains(styles.inline)).toBe(true);
});

it('should apply the fullWidth class when fullWidth prop is set', () => {
  const { container } = renderFlex(<Flex fullWidth><span>test</span></Flex>);
  const el = container.firstChild as HTMLElement;
  expect(el.classList.contains(styles.fullWidth)).toBe(true);
});

it('should apply the fullHeight class when fullHeight prop is set', () => {
  const { container } = renderFlex(<Flex fullHeight><span>test</span></Flex>);
  const el = container.firstChild as HTMLElement;
  expect(el.classList.contains(styles.fullHeight)).toBe(true);
});

it('should render as a div by default', () => {
  const { container } = renderFlex(<Flex><span>test</span></Flex>);
  const el = container.firstChild as HTMLElement;
  expect(el.tagName.toLowerCase()).toBe('div');
});

it('should render as the element specified by the as prop', () => {
  const { container } = renderFlex(<Flex as="section"><span>test</span></Flex>);
  const el = container.firstChild as HTMLElement;
  expect(el.tagName.toLowerCase()).toBe('section');
});

it('should render as nav when as="nav"', () => {
  const { container } = renderFlex(<Flex as="nav"><span>test</span></Flex>);
  const el = container.firstChild as HTMLElement;
  expect(el.tagName.toLowerCase()).toBe('nav');
});

it('should apply a custom className', () => {
  const { container } = renderFlex(<Flex className="custom-class"><span>test</span></Flex>);
  const el = container.firstChild as HTMLElement;
  expect(el.classList.contains('custom-class')).toBe(true);
});

it('should set --flex-direction-mobile CSS variable for scalar direction', () => {
  const { container } = renderFlex(<Flex direction="column"><span>test</span></Flex>);
  const el = container.firstChild as HTMLElement;
  expect(el.style.getPropertyValue('--flex-direction-mobile')).toBe('column');
});

it('should set --flex-gap-mobile CSS variable for scalar gap', () => {
  const { container } = renderFlex(<Flex gap="md"><span>test</span></Flex>);
  const el = container.firstChild as HTMLElement;
  expect(el.style.getPropertyValue('--flex-gap-mobile')).toBe('var(--spacing-md)');
});

it('should set responsive direction CSS variables', () => {
  const { container } = renderFlex(
    <Flex direction={{ mobile: 'column', laptop: 'row' }}><span>test</span></Flex>
  );
  const el = container.firstChild as HTMLElement;
  expect(el.style.getPropertyValue('--flex-direction-mobile')).toBe('column');
  expect(el.style.getPropertyValue('--flex-direction-laptop')).toBe('row');
});

it('should set responsive gap CSS variables', () => {
  const { container } = renderFlex(
    <Flex gap={{ mobile: 'sm', desktop: 'xl' }}><span>test</span></Flex>
  );
  const el = container.firstChild as HTMLElement;
  expect(el.style.getPropertyValue('--flex-gap-mobile')).toBe('var(--spacing-sm)');
  expect(el.style.getPropertyValue('--flex-gap-desktop')).toBe('var(--spacing-xl)');
});

it('should set --flex-align-mobile CSS variable', () => {
  const { container } = renderFlex(<Flex align="center"><span>test</span></Flex>);
  const el = container.firstChild as HTMLElement;
  expect(el.style.getPropertyValue('--flex-align-mobile')).toBe('center');
});

it('should set --flex-justify-mobile CSS variable', () => {
  const { container } = renderFlex(<Flex justify="space-between"><span>test</span></Flex>);
  const el = container.firstChild as HTMLElement;
  expect(el.style.getPropertyValue('--flex-justify-mobile')).toBe('space-between');
});

it('should set --flex-wrap-mobile CSS variable', () => {
  const { container } = renderFlex(<Flex wrap="wrap"><span>test</span></Flex>);
  const el = container.firstChild as HTMLElement;
  expect(el.style.getPropertyValue('--flex-wrap-mobile')).toBe('wrap');
});

it('should merge custom style with CSS variable styles', () => {
  const { container } = renderFlex(
    <Flex style={{ opacity: 0.5 }}><span>test</span></Flex>
  );
  const el = container.firstChild as HTMLElement;
  expect(el.style.opacity).toBe('0.5');
});

it('should not apply inline class when inline prop is not set', () => {
  const { container } = renderFlex(<Flex><span>test</span></Flex>);
  const el = container.firstChild as HTMLElement;
  expect(el.classList.contains(styles.inline)).toBe(false);
});

it('should render gap none as 0', () => {
  const { container } = renderFlex(<Flex gap="none"><span>test</span></Flex>);
  const el = container.firstChild as HTMLElement;
  expect(el.style.getPropertyValue('--flex-gap-mobile')).toBe('0');
});

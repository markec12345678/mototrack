import React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { PageLayout } from './page-layout.js';
import styles from './page-layout.module.scss';

function Wrapper({ children }: { children: React.ReactNode }) {
  return <MockProvider>{children}</MockProvider>;
}

it('should render children inside the layout', () => {
  const { getByText } = render(
    <Wrapper>
      <PageLayout>
        <p>Race Dashboard</p>
      </PageLayout>
    </Wrapper>
  );
  expect(getByText('Race Dashboard')).toBeTruthy();
});

it('should render the wrapper element with the wrapper class', () => {
  const { container } = render(
    <Wrapper>
      <PageLayout>
        <span>Content</span>
      </PageLayout>
    </Wrapper>
  );
  const wrapper = container.querySelector(`.${styles.wrapper}`);
  expect(wrapper).toBeTruthy();
});

it('should render the column element with the column class', () => {
  const { container } = render(
    <Wrapper>
      <PageLayout>
        <span>Content</span>
      </PageLayout>
    </Wrapper>
  );
  const column = container.querySelector(`.${styles.column}`);
  expect(column).toBeTruthy();
});

it('should apply a custom className to the wrapper', () => {
  const { container } = render(
    <Wrapper>
      <PageLayout className="custom-page">
        <span>Content</span>
      </PageLayout>
    </Wrapper>
  );
  const wrapper = container.querySelector('.custom-page');
  expect(wrapper).toBeTruthy();
});

it('should apply custom maxWidth to the column via inline style', () => {
  const { container } = render(
    <Wrapper>
      <PageLayout maxWidth="800px">
        <span>Content</span>
      </PageLayout>
    </Wrapper>
  );
  const column = container.querySelector(`.${styles.column}`) as HTMLElement;
  expect(column.style.maxWidth).toBe('800px');
});

it('should apply custom gap to the column via inline style', () => {
  const { container } = render(
    <Wrapper>
      <PageLayout gap="32px">
        <span>Content</span>
      </PageLayout>
    </Wrapper>
  );
  const column = container.querySelector(`.${styles.column}`) as HTMLElement;
  expect(column.style.gap).toBe('32px');
});

it('should apply custom padding to the column via inline style', () => {
  const { container } = render(
    <Wrapper>
      <PageLayout padding="48px 24px">
        <span>Content</span>
      </PageLayout>
    </Wrapper>
  );
  const column = container.querySelector(`.${styles.column}`) as HTMLElement;
  expect(column.style.padding).toBe('48px 24px');
});

it('should set maxWidth to 100% when fluid is true', () => {
  const { container } = render(
    <Wrapper>
      <PageLayout fluid>
        <span>Content</span>
      </PageLayout>
    </Wrapper>
  );
  const column = container.querySelector(`.${styles.column}`) as HTMLElement;
  expect(column.style.maxWidth).toBe('100%');
});

it('should render multiple children', () => {
  const { getByText } = render(
    <Wrapper>
      <PageLayout>
        <p>Section One</p>
        <p>Section Two</p>
        <p>Section Three</p>
      </PageLayout>
    </Wrapper>
  );
  expect(getByText('Section One')).toBeTruthy();
  expect(getByText('Section Two')).toBeTruthy();
  expect(getByText('Section Three')).toBeTruthy();
});

it('should apply inline style to the wrapper', () => {
  const { container } = render(
    <Wrapper>
      <PageLayout style={{ backgroundColor: 'red' }}>
        <span>Content</span>
      </PageLayout>
    </Wrapper>
  );
  const wrapper = container.querySelector(`.${styles.wrapper}`) as HTMLElement;
  expect(wrapper.style.backgroundColor).toBe('red');
});

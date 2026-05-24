import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MockProvider } from './mock-provider.js';
import { useIsMock } from './use-is-mock.js';

function MockIndicator() {
  const isMock = useIsMock();
  return <div className={isMock ? 'is-mock' : 'not-mock'}>{isMock ? 'mocked' : 'live'}</div>;
}

describe('MockProvider', () => {
  it('should render children', () => {
    const { container } = render(
      <MockProvider>
        <span className="child-node">hello mototrack</span>
      </MockProvider>
    );
    const child = container.querySelector('.child-node');
    expect(child).toBeTruthy();
    expect(child?.textContent).toBe('hello mototrack');
  });

  it('should set isMock context to true for children', () => {
    const { container } = render(
      <MockProvider>
        <MockIndicator />
      </MockProvider>
    );
    const indicator = container.querySelector('.is-mock');
    expect(indicator).toBeTruthy();
    expect(indicator?.textContent).toBe('mocked');
  });

  it('should render multiple children correctly', () => {
    const { container } = render(
      <MockProvider>
        <div className="first-child">First</div>
        <div className="second-child">Second</div>
      </MockProvider>
    );
    expect(container.querySelector('.first-child')).toBeTruthy();
    expect(container.querySelector('.second-child')).toBeTruthy();
  });

  it('should render without crashing when noRouter is true', () => {
    const { container } = render(
      <MockProvider noRouter>
        <span className="no-router-child">no router</span>
      </MockProvider>
    );
    expect(container.querySelector('.no-router-child')).toBeTruthy();
  });

  it('should render without crashing when noTheme is true', () => {
    const { container } = render(
      <MockProvider noTheme>
        <span className="no-theme-child">no theme</span>
      </MockProvider>
    );
    expect(container.querySelector('.no-theme-child')).toBeTruthy();
  });

  it('should render without crashing when both noRouter and noTheme are true', () => {
    const { container } = render(
      <MockProvider noRouter noTheme>
        <span className="bare-child">bare</span>
      </MockProvider>
    );
    expect(container.querySelector('.bare-child')).toBeTruthy();
  });
});

describe('useIsMock', () => {
  it('should return true when used inside MockProvider', () => {
    const { container } = render(
      <MockProvider>
        <MockIndicator />
      </MockProvider>
    );
    const el = container.querySelector('.is-mock');
    expect(el).toBeTruthy();
  });
});

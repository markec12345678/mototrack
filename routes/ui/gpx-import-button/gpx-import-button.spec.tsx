import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { GpxImportButton } from './gpx-import-button.js';
import { mockGpxXml, mockParsedRoute } from './gpx-import-button.mock.js';

function renderWithProvider(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

describe(`GpxImportButton`, () => {
  it(`renders the import button with default label`, () => {
    const { container } = renderWithProvider(
      <GpxImportButton onLoad={() => {}} />
    );
    const button = container.querySelector(`button`);
    expect(button).toBeTruthy();
    expect(button?.textContent).toContain(`Import GPX`);
  });

  it(`renders a custom label`, () => {
    const { container } = renderWithProvider(
      <GpxImportButton onLoad={() => {}} label="Load Route" />
    );
    const button = container.querySelector(`button`);
    expect(button?.textContent).toContain(`Load Route`);
  });

  it(`renders a hidden file input accepting .gpx files`, () => {
    const { container } = renderWithProvider(
      <GpxImportButton onLoad={() => {}} />
    );
    const input = container.querySelector(`input[type="file"]`);
    expect(input).toBeTruthy();
    expect(input?.getAttribute(`accept`)).toContain(`.gpx`);
  });

  it(`applies custom className to root element`, () => {
    const { container } = renderWithProvider(
      <GpxImportButton onLoad={() => {}} className="custom-class" />
    );
    const root = container.querySelector(`.custom-class`);
    expect(root).toBeTruthy();
  });

  it(`calls onLoad with parsed route when a valid GPX file is selected`, () => {
    const onLoad = vi.fn();
    const { container } = renderWithProvider(
      <GpxImportButton onLoad={onLoad} />
    );

    const input = container.querySelector(`input[type="file"]`) as HTMLInputElement;
    const file = new File([mockGpxXml], `route.gpx`, { type: `application/gpx+xml` });

    Object.defineProperty(input, `files`, { value: [file], configurable: true });
    fireEvent.change(input);

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(onLoad).toHaveBeenCalledTimes(1);
        const result = onLoad.mock.calls[0][0];
        expect(result.name).toBe(mockParsedRoute.name);
        expect(result.waypoints.length).toBe(mockParsedRoute.waypoints.length);
        expect(result.geometry.length).toBe(mockParsedRoute.geometry.length);
        resolve();
      }, 100);
    });
  });

  it(`calls onError when a non-GPX file is selected`, () => {
    const onError = vi.fn();
    const { container } = renderWithProvider(
      <GpxImportButton onLoad={() => {}} onError={onError} />
    );

    const input = container.querySelector(`input[type="file"]`) as HTMLInputElement;
    const file = new File([`not gpx`], `route.txt`, { type: `text/plain` });

    Object.defineProperty(input, `files`, { value: [file], configurable: true });
    fireEvent.change(input);

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0]).toContain(`.gpx`);
  });

  it(`shows an error element when a non-GPX file is selected`, () => {
    const { container } = renderWithProvider(
      <GpxImportButton onLoad={() => {}} />
    );

    const input = container.querySelector(`input[type="file"]`) as HTMLInputElement;
    const file = new File([`not gpx`], `route.txt`, { type: `text/plain` });

    Object.defineProperty(input, `files`, { value: [file], configurable: true });
    fireEvent.change(input);

    const errorEl = container.querySelector(`[class*="errorBadge"]`);
    expect(errorEl).toBeTruthy();
  });

  it(`shows success element after a valid GPX file is loaded`, () => {
    const { container } = renderWithProvider(
      <GpxImportButton onLoad={() => {}} />
    );

    const input = container.querySelector(`input[type="file"]`) as HTMLInputElement;
    const file = new File([mockGpxXml], `route.gpx`, { type: `application/gpx+xml` });

    Object.defineProperty(input, `files`, { value: [file], configurable: true });
    fireEvent.change(input);

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const successEl = container.querySelector(`[class*="successBadge"]`);
        expect(successEl).toBeTruthy();
        resolve();
      }, 100);
    });
  });

  it(`does not show error or success badge in idle state`, () => {
    const { container } = renderWithProvider(
      <GpxImportButton onLoad={() => {}} />
    );
    const errorEl = container.querySelector(`[class*="errorBadge"]`);
    const successEl = container.querySelector(`[class*="successBadge"]`);
    expect(errorEl).toBeNull();
    expect(successEl).toBeNull();
  });

  it(`clicking the button triggers the hidden file input`, () => {
    const { container } = renderWithProvider(
      <GpxImportButton onLoad={() => {}} />
    );

    const input = container.querySelector(`input[type="file"]`) as HTMLInputElement;
    const clickSpy = vi.spyOn(input, `click`);
    const button = container.querySelector(`button`) as HTMLButtonElement;

    fireEvent.click(button);
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it(`renders a root container element`, () => {
    const { container } = renderWithProvider(
      <GpxImportButton onLoad={() => {}} />
    );
    expect(container.firstElementChild).toBeTruthy();
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });
});

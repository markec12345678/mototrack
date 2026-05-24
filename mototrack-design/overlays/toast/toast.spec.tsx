import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { ToastProvider } from './toast.js';
import { useToast } from './use-toast.js';
import styles from './toast.module.scss';

function ToastTrigger({
  message = `Test notification`,
  variant = 'info' as const,
  title,
  duration = 0,
}: {
  message?: string;
  variant?: 'success' | 'warning' | 'danger' | 'info';
  title?: string;
  duration?: number;
}) {
  const { addToast } = useToast();
  return (
    <button type="button" onClick={() => addToast(message, variant, title, duration)}>
      Add Toast
    </button>
  );
}

function RemoveTrigger() {
  const { addToast, removeToast, toasts } = useToast();
  return (
    <>
      <button type="button" onClick={() => addToast(`Removable toast`, 'info', undefined, 0)}>
        Add
      </button>
      <button type="button" onClick={() => toasts[0] && removeToast(toasts[0].id)}>
        Remove First
      </button>
    </>
  );
}

function renderWithProvider(ui: React.ReactNode) {
  return render(
    <MockProvider>
      <ToastProvider>{ui}</ToastProvider>
    </MockProvider>
  );
}

it('should render the toast container', () => {
  const { container } = renderWithProvider(<div />);
  const toastContainer = container.querySelector(`.${styles.toastContainer}`);
  expect(toastContainer).toBeTruthy();
});

it('should add a toast when addToast is called', () => {
  const { container, getByText } = renderWithProvider(
    <ToastTrigger message="Ride saved!" variant="success" duration={0} />
  );
  const button = getByText('Add Toast');
  fireEvent.click(button);
  const toastItem = container.querySelector(`.${styles.toastItem}`);
  expect(toastItem).toBeTruthy();
});

it('should display the toast message', () => {
  const { getByText } = renderWithProvider(
    <ToastTrigger message="Route shared with crew" variant="info" duration={0} />
  );
  fireEvent.click(getByText('Add Toast'));
  expect(getByText('Route shared with crew')).toBeTruthy();
});

it('should display the toast title when provided', () => {
  const { getByText } = renderWithProvider(
    <ToastTrigger message="Ride saved!" variant="success" title="Success" duration={0} />
  );
  fireEvent.click(getByText('Add Toast'));
  expect(getByText('Success')).toBeTruthy();
});

it('should apply the correct variant class for success', () => {
  const { container, getByText } = renderWithProvider(
    <ToastTrigger message="Lap saved" variant="success" duration={0} />
  );
  fireEvent.click(getByText('Add Toast'));
  const toastItem = container.querySelector(`.${styles.success}`);
  expect(toastItem).toBeTruthy();
});

it('should apply the correct variant class for danger', () => {
  const { container, getByText } = renderWithProvider(
    <ToastTrigger message="Hazard ahead" variant="danger" duration={0} />
  );
  fireEvent.click(getByText('Add Toast'));
  const toastItem = container.querySelector(`.${styles.danger}`);
  expect(toastItem).toBeTruthy();
});

it('should apply the correct variant class for warning', () => {
  const { container, getByText } = renderWithProvider(
    <ToastTrigger message="Yellow flag" variant="warning" duration={0} />
  );
  fireEvent.click(getByText('Add Toast'));
  const toastItem = container.querySelector(`.${styles.warning}`);
  expect(toastItem).toBeTruthy();
});

it('should apply the correct variant class for info', () => {
  const { container, getByText } = renderWithProvider(
    <ToastTrigger message="Live timing active" variant="info" duration={0} />
  );
  fireEvent.click(getByText('Add Toast'));
  const toastItem = container.querySelector(`.${styles.info}`);
  expect(toastItem).toBeTruthy();
});

it('should render multiple toasts', () => {
  const { container, getByText } = renderWithProvider(
    <ToastTrigger message="Notification" variant="info" duration={0} />
  );
  const button = getByText('Add Toast');
  fireEvent.click(button);
  fireEvent.click(button);
  fireEvent.click(button);
  const items = container.querySelectorAll(`.${styles.toastItem}`);
  expect(items.length).toBe(3);
});

it('should remove a toast when the close button is clicked', () => {
  const { container, getByText } = renderWithProvider(
    <ToastTrigger message="Dismissible toast" variant="info" duration={0} />
  );
  fireEvent.click(getByText('Add Toast'));
  const closeButton = container.querySelector(`.${styles.toastClose}`) as HTMLButtonElement;
  expect(closeButton).toBeTruthy();
  fireEvent.click(closeButton);
  const items = container.querySelectorAll(`.${styles.toastItem}`);
  expect(items.length).toBe(0);
});

it('should remove a specific toast via removeToast', () => {
  const { container, getByText } = renderWithProvider(<RemoveTrigger />);
  fireEvent.click(getByText('Add'));
  const itemsBefore = container.querySelectorAll(`.${styles.toastItem}`);
  expect(itemsBefore.length).toBe(1);
  fireEvent.click(getByText('Remove First'));
  const itemsAfter = container.querySelectorAll(`.${styles.toastItem}`);
  expect(itemsAfter.length).toBe(0);
});

it('should render a progress bar when duration is set', () => {
  const { container, getByText } = renderWithProvider(
    <ToastTrigger message="Auto dismiss" variant="success" duration={4000} />
  );
  fireEvent.click(getByText('Add Toast'));
  const progressBar = container.querySelector(`.${styles.progressBar}`);
  expect(progressBar).toBeTruthy();
});

it('should not render a progress bar when duration is 0', () => {
  const { container, getByText } = renderWithProvider(
    <ToastTrigger message="Persistent toast" variant="danger" duration={0} />
  );
  fireEvent.click(getByText('Add Toast'));
  const progressBar = container.querySelector(`.${styles.progressBar}`);
  expect(progressBar).toBeFalsy();
});

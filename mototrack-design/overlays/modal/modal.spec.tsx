import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Modal } from './modal.js';
import styles from './modal.module.scss';

function renderModal(props: Partial<React.ComponentProps<typeof Modal>> = {}) {
  const onClose = props.onClose ?? (() => {});
  return render(
    <MockProvider>
      <Modal open title="Test Modal" onClose={onClose} {...props} />
    </MockProvider>
  );
}

it('should render the modal when open is true', () => {
  const { container } = renderModal({ open: true });
  const backdrop = container.querySelector(`.${styles.backdrop}`);
  expect(backdrop).toBeTruthy();
});

it('should not render the modal when open is false', () => {
  const { container } = renderModal({ open: false });
  const backdrop = container.querySelector(`.${styles.backdrop}`);
  expect(backdrop).toBeNull();
});

it('should render the title', () => {
  const { getByText } = renderModal({ open: true, title: `Pre-Ride Checklist` });
  expect(getByText(`Pre-Ride Checklist`)).toBeTruthy();
});

it('should render children in the body', () => {
  const { getByText } = renderModal({
    open: true,
    children: <p>Modal body content</p>,
  });
  expect(getByText(`Modal body content`)).toBeTruthy();
});

it('should render the footer slot', () => {
  const { getByText } = renderModal({
    open: true,
    footer: <button type="button">Confirm</button>,
  });
  expect(getByText(`Confirm`)).toBeTruthy();
});

it('should not render footer when not provided', () => {
  const { container } = renderModal({ open: true });
  const footer = container.querySelector(`.${styles.footer}`);
  expect(footer).toBeNull();
});

it('should call onClose when backdrop is clicked', () => {
  const onClose = vi.fn();
  const { container } = renderModal({ open: true, onClose });
  const backdrop = container.querySelector(`.${styles.backdrop}`) as HTMLElement;
  fireEvent.click(backdrop);
  expect(onClose).toHaveBeenCalledTimes(1);
});

it('should not call onClose when dialog panel is clicked', () => {
  const onClose = vi.fn();
  const { container } = renderModal({ open: true, onClose });
  const dialog = container.querySelector(`.${styles.dialog}`) as HTMLElement;
  fireEvent.click(dialog);
  expect(onClose).not.toHaveBeenCalled();
});

it('should call onClose when ESC key is pressed', () => {
  const onClose = vi.fn();
  renderModal({ open: true, onClose });
  fireEvent.keyDown(document, { key: `Escape` });
  expect(onClose).toHaveBeenCalledTimes(1);
});

it('should not call onClose on ESC when closeOnEsc is false', () => {
  const onClose = vi.fn();
  renderModal({ open: true, onClose, closeOnEsc: false });
  fireEvent.keyDown(document, { key: `Escape` });
  expect(onClose).not.toHaveBeenCalled();
});

it('should not call onClose on backdrop click when closeOnBackdrop is false', () => {
  const onClose = vi.fn();
  const { container } = renderModal({ open: true, onClose, closeOnBackdrop: false });
  const backdrop = container.querySelector(`.${styles.backdrop}`) as HTMLElement;
  fireEvent.click(backdrop);
  expect(onClose).not.toHaveBeenCalled();
});

it('should apply the sm size class', () => {
  const { container } = renderModal({ open: true, size: `sm` });
  const dialog = container.querySelector(`.${styles.sm}`);
  expect(dialog).toBeTruthy();
});

it('should apply the md size class', () => {
  const { container } = renderModal({ open: true, size: `md` });
  const dialog = container.querySelector(`.${styles.md}`);
  expect(dialog).toBeTruthy();
});

it('should apply the lg size class', () => {
  const { container } = renderModal({ open: true, size: `lg` });
  const dialog = container.querySelector(`.${styles.lg}`);
  expect(dialog).toBeTruthy();
});

it('should apply a custom className to the dialog', () => {
  const { container } = renderModal({ open: true, className: `customClass` });
  const dialog = container.querySelector(`.${styles.dialog}`);
  expect(dialog?.classList.contains(`customClass`)).toBe(true);
});

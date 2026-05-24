import { type ReactElement } from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { ChatHeaderTrigger } from './chat-header-trigger.js';

function renderWithProvider(ui: ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

it('should render the trigger button', () => {
  const { container } = renderWithProvider(<ChatHeaderTrigger />);
  const button = container.querySelector(`button[aria-label="Odpri MotoChat"]`);
  expect(button).toBeTruthy();
});

it('should render the icon button with correct aria-label', () => {
  const { container } = renderWithProvider(<ChatHeaderTrigger />);
  const button = container.querySelector(`button[aria-label="Odpri MotoChat"]`);
  expect(button).toBeTruthy();
});

it('should open the panel when the trigger button is clicked', () => {
  const { container } = renderWithProvider(<ChatHeaderTrigger />);
  const button = container.querySelector(`button[aria-label="Odpri MotoChat"]`) as HTMLButtonElement;
  fireEvent.click(button);
  const panel = container.querySelector(`[role="dialog"]`);
  expect(panel).toBeTruthy();
});

it('should apply custom className to the wrapper', () => {
  const { container } = renderWithProvider(
    <ChatHeaderTrigger className="my-custom-class" />
  );
  const wrapper = container.querySelector(`.my-custom-class`);
  expect(wrapper).toBeTruthy();
});

it('should render the wrapper element', () => {
  const { container } = renderWithProvider(<ChatHeaderTrigger />);
  const wrapper = container.firstElementChild;
  expect(wrapper).toBeTruthy();
});

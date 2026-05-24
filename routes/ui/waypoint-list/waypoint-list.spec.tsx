import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { WaypointList } from './waypoint-list.js';
import { mockWaypoints, mockTwoWaypoints } from './waypoint-list.mock.js';
import styles from './waypoint-list.module.scss';

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

it('should render the empty state when no waypoints are provided', () => {
  const { container } = renderWithRouter(<WaypointList waypoints={[]} />);
  const emptyState = container.querySelector(`.${styles.emptyState}`);
  expect(emptyState).toBeTruthy();
});

it('should render the empty state hint text', () => {
  const { getByText } = renderWithRouter(<WaypointList waypoints={[]} />);
  const hint = getByText(/click anywhere on the map/i);
  expect(hint).toBeTruthy();
});

it('should render all waypoint rows', () => {
  const { container } = renderWithRouter(
    <WaypointList waypoints={mockWaypoints} />
  );
  const rows = container.querySelectorAll(`.${styles.row}`);
  expect(rows.length).toBe(mockWaypoints.length);
});

it('should render waypoint names in inputs', () => {
  const { container } = renderWithRouter(
    <WaypointList waypoints={mockTwoWaypoints} />
  );
  const inputs = container.querySelectorAll<HTMLInputElement>(`.${styles.nameInput}`);
  expect(inputs[0].value).toBe(mockTwoWaypoints[0].name);
  expect(inputs[1].value).toBe(mockTwoWaypoints[1].name);
});

it('should render coordinates for each waypoint', () => {
  const { container } = renderWithRouter(
    <WaypointList waypoints={mockTwoWaypoints} />
  );
  const coords = container.querySelectorAll(`.${styles.coords}`);
  expect(coords.length).toBe(mockTwoWaypoints.length);
  expect(coords[0].textContent).toContain('45.54694');
});

it('should call onNameChange when input value changes', () => {
  const onNameChange = vi.fn();
  const { container } = renderWithRouter(
    <WaypointList waypoints={mockTwoWaypoints} onNameChange={onNameChange} />
  );
  const inputs = container.querySelectorAll<HTMLInputElement>(`.${styles.nameInput}`);
  fireEvent.change(inputs[0], { target: { value: `New Name` } });
  expect(onNameChange).toHaveBeenCalledWith(mockTwoWaypoints[0].id, `New Name`);
});

it('should call onDelete when delete button is clicked', () => {
  const onDelete = vi.fn();
  const { container } = renderWithRouter(
    <WaypointList waypoints={mockTwoWaypoints} onDelete={onDelete} />
  );
  const deleteButtons = container.querySelectorAll<HTMLButtonElement>(`button[aria-label]`);
  fireEvent.click(deleteButtons[0]);
  expect(onDelete).toHaveBeenCalledWith(mockTwoWaypoints[0].id);
});

it('should render the header with waypoint count badge', () => {
  const { container } = renderWithRouter(
    <WaypointList waypoints={mockWaypoints} />
  );
  const header = container.querySelector(`.${styles.header}`);
  expect(header).toBeTruthy();
  expect(header?.textContent).toContain(`${mockWaypoints.length}`);
});

it('should render drag handles for each row', () => {
  const { container } = renderWithRouter(
    <WaypointList waypoints={mockWaypoints} />
  );
  const handles = container.querySelectorAll(`.${styles.dragHandle}`);
  expect(handles.length).toBe(mockWaypoints.length);
});

it('should call onReorder when a row is dropped onto another', () => {
  const onReorder = vi.fn();
  const { container } = renderWithRouter(
    <WaypointList waypoints={mockTwoWaypoints} onReorder={onReorder} />
  );
  const rows = container.querySelectorAll<HTMLDivElement>(`.${styles.row}`);
  fireEvent.dragStart(rows[0]);
  fireEvent.dragOver(rows[1]);
  fireEvent.drop(rows[1]);
  expect(onReorder).toHaveBeenCalled();
  const reordered = onReorder.mock.calls[0][0];
  expect(reordered[0].id).toBe(mockTwoWaypoints[1].id);
  expect(reordered[1].id).toBe(mockTwoWaypoints[0].id);
});

it('should not render empty state when waypoints are present', () => {
  const { container } = renderWithRouter(
    <WaypointList waypoints={mockWaypoints} />
  );
  const emptyState = container.querySelector(`.${styles.emptyState}`);
  expect(emptyState).toBeNull();
});

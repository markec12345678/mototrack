import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import { Badge } from '@markec/mototrack-design.content.badge';
import { IconButton } from '@markec/mototrack-design.actions.icon-button';
import type { Waypoint } from '@markec/routes.entities.waypoint';
import styles from './waypoint-list.module.scss';

// ── Icons ─────────────────────────────────────────────────────────────────────

function DragHandleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <rect x="4" y="5" width="16" height="2" rx="1" />
      <rect x="4" y="11" width="16" height="2" rx="1" />
      <rect x="4" y="17" width="16" height="2" rx="1" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx={12} cy={10} r={3} />
    </svg>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type WaypointListProps = {
  /**
   * List of waypoints to display and edit.
   */
  waypoints?: Waypoint[];

  /**
   * Called when a waypoint's name is changed.
   */
  onNameChange?: (id: string, name: string) => void;

  /**
   * Called when a waypoint is deleted.
   */
  onDelete?: (id: string) => void;

  /**
   * Called when waypoints are reordered via drag-and-drop.
   * Receives the new ordered array.
   */
  onReorder?: (waypoints: Waypoint[]) => void;

  /**
   * Additional class name for the root element.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatCoord(value: number, decimals = 5): string {
  return value.toFixed(decimals);
}

function getBadgeVariant(index: number): 'accent' | 'info' | 'success' | 'neutral' {
  if (index === 0) return 'success';
  if (index === 1) return 'accent';
  return 'neutral';
}

// ── Component ─────────────────────────────────────────────────────────────────

export function WaypointList({
  waypoints = [],
  onNameChange,
  onDelete,
  onReorder,
  className,
  style,
}: WaypointListProps) {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragIndexRef = useRef<number | null>(null);

  const handleDragStart = (index: number) => {
    dragIndexRef.current = index;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = dragIndexRef.current;
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragOverIndex(null);
      dragIndexRef.current = null;
      return;
    }
    const reordered = [...waypoints];
    const [removed] = reordered.splice(dragIndex, 1);
    reordered.splice(dropIndex, 0, removed);
    onReorder?.(reordered);
    setDragOverIndex(null);
    dragIndexRef.current = null;
  };

  const handleDragEnd = () => {
    setDragOverIndex(null);
    dragIndexRef.current = null;
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  if (waypoints.length === 0) {
    return (
      <div className={classNames(styles.root, className)} style={style}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <MapPinIcon />
          </div>
          <p className={styles.emptyTitle}>No waypoints yet</p>
          <p className={styles.emptyHint}>
            Click anywhere on the map to add your first waypoint and start building your route.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={classNames(styles.root, className)} style={style}>
      <div className={styles.header}>
        <span className={styles.headerLabel}>Waypoints</span>
        <Badge variant="neutral" label={`${waypoints.length}`} size="sm" />
      </div>

      <div className={styles.list}>
        {waypoints.map((wp, index) => (
          <div
            key={wp.id}
            className={classNames(styles.row, {
              [styles.dragOver]: dragOverIndex === index,
            })}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            onDragLeave={handleDragLeave}
          >
            {/* Drag handle */}
            <div className={styles.dragHandle} title="Drag to reorder">
              <DragHandleIcon />
            </div>

            {/* Index badge */}
            <div className={styles.badgeWrap}>
              <Badge
                variant={getBadgeVariant(index)}
                label={`${index + 1}`}
                size="sm"
              />
            </div>

            {/* Name + coordinates */}
            <div className={styles.content}>
              <input
                className={styles.nameInput}
                type="text"
                value={wp.name ?? ``}
                placeholder={`Waypoint ${index + 1}`}
                onChange={(e) => onNameChange?.(wp.id, e.target.value)}
                aria-label={`Waypoint ${index + 1} name`}
              />
              <span className={styles.coords}>
                {formatCoord(wp.lat)}, {formatCoord(wp.lng)}
              </span>
            </div>

            {/* Delete button */}
            <IconButton
              icon={<TrashIcon />}
              variant="danger"
              size="sm"
              aria-label={`Delete waypoint ${index + 1}`}
              title="Delete waypoint"
              onClick={() => onDelete?.(wp.id)}
            />
          </div>
        ))}
      </div>

      {/* Connector line decoration */}
      <div className={styles.connectorWrap} aria-hidden>
        <div className={styles.connector} />
      </div>
    </div>
  );
}

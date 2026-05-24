import * as React from 'react';
import { useState, useMemo } from 'react';
import classNames from 'classnames';
import styles from './ride-calendar.module.scss';

export type RideEntry = {
  id: string;
  startedAt: number;
  distanceKm: number;
  name?: string;
};

export type RideCalendarProps = {
  /**
   * List of rides to display on the calendar.
   */
  rides?: RideEntry[];
  /**
   * Called when a day cell with rides is clicked.
   * Receives the date string (YYYY-MM-DD) and the rides for that day.
   */
  onDayClick?: (dateKey: string, rides: RideEntry[]) => void;
  /**
   * Initial year to display. Defaults to current year.
   */
  initialYear?: number;
  /**
   * Initial month to display (0-indexed). Defaults to current month.
   */
  initialMonth?: number;
  /**
   * Additional class name.
   */
  className?: string;
  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;
};

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function toDateKey(year: number, month: number, day: number): string {
  const mm = String(month + 1).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

function getIntensityLevel(distanceKm: number): number {
  if (distanceKm === 0) return 0;
  if (distanceKm < 30) return 1;
  if (distanceKm < 80) return 2;
  if (distanceKm < 150) return 3;
  return 4;
}

function formatDistance(km: number): string {
  if (km >= 1000) return `${(km / 1000).toFixed(1)}k km`;
  return `${Math.round(km)} km`;
}

export function RideCalendar({
  rides = [],
  onDayClick,
  initialYear,
  initialMonth,
  className,
  style,
}: RideCalendarProps) {
  const now = new Date();
  const [year, setYear] = useState(initialYear ?? now.getFullYear());
  const [month, setMonth] = useState(initialMonth ?? now.getMonth());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const ridesByDay = useMemo(() => {
    const map: Record<string, RideEntry[]> = {};
    for (const ride of rides) {
      const d = new Date(ride.startedAt);
      const key = toDateKey(d.getFullYear(), d.getMonth(), d.getDate());
      if (!map[key]) map[key] = [];
      map[key].push(ride);
    }
    return map;
  }, [rides]);

  const distanceByDay = useMemo(() => {
    const map: Record<string, number> = {};
    for (const [key, dayRides] of Object.entries(ridesByDay)) {
      map[key] = dayRides.reduce((sum, r) => sum + r.distanceKm, 0);
    }
    return map;
  }, [ridesByDay]);

  const maxDistance = useMemo(() => {
    const vals = Object.values(distanceByDay);
    return vals.length > 0 ? Math.max(...vals) : 1;
  }, [distanceByDay]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells: Array<{ day: number; currentMonth: boolean; dateKey: string }> = [];

    for (let i = startOffset - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      cells.push({ day, currentMonth: false, dateKey: toDateKey(prevYear, prevMonth, day) });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, currentMonth: true, dateKey: toDateKey(year, month, d) });
    }

    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      cells.push({ day: d, currentMonth: false, dateKey: toDateKey(nextYear, nextMonth, d) });
    }

    return cells;
  }, [year, month]);

  const todayKey = toDateKey(now.getFullYear(), now.getMonth(), now.getDate());

  const handlePrev = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
    setSelectedDay(null);
  };

  const handleNext = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
    setSelectedDay(null);
  };

  const handleDayClick = (dateKey: string, currentMonth: boolean) => {
    if (!currentMonth) return;
    const dayRides = ridesByDay[dateKey] ?? [];
    if (dayRides.length === 0) return;
    setSelectedDay(dateKey === selectedDay ? null : dateKey);
    onDayClick?.(dateKey, dayRides);
  };

  const totalMonthKm = useMemo(() => {
    return calendarDays
      .filter((c) => c.currentMonth)
      .reduce((sum, c) => sum + (distanceByDay[c.dateKey] ?? 0), 0);
  }, [calendarDays, distanceByDay]);

  const totalMonthRides = useMemo(() => {
    return calendarDays
      .filter((c) => c.currentMonth)
      .reduce((sum, c) => sum + (ridesByDay[c.dateKey]?.length ?? 0), 0);
  }, [calendarDays, ridesByDay]);

  const activeDays = useMemo(() => {
    return calendarDays.filter((c) => c.currentMonth && (ridesByDay[c.dateKey]?.length ?? 0) > 0).length;
  }, [calendarDays, ridesByDay]);

  return (
    <div className={classNames(styles.calendar, className)} style={style}>
      <div className={styles.header}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => handlePrev()}
          aria-label="Previous month"
        >
          <ChevronLeftIcon />
        </button>
        <div className={styles.monthTitle}>
          <span className={styles.monthName}>{MONTH_NAMES[month]}</span>
          <span className={styles.yearLabel}>{year}</span>
        </div>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => handleNext()}
          aria-label="Next month"
        >
          <ChevronRightIcon />
        </button>
      </div>

      <div className={styles.statsBar}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{totalMonthRides}</span>
          <span className={styles.statLabel}>rides</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statValue}>{formatDistance(totalMonthKm)}</span>
          <span className={styles.statLabel}>total</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statValue}>{activeDays}</span>
          <span className={styles.statLabel}>active days</span>
        </div>
      </div>

      <div className={styles.weekdays}>
        {WEEKDAYS.map((wd) => (
          <div key={wd} className={styles.weekday}>{wd}</div>
        ))}
      </div>

      <div className={styles.grid}>
        {calendarDays.map((cell) => {
          const dayRides = ridesByDay[cell.dateKey] ?? [];
          const distance = distanceByDay[cell.dateKey] ?? 0;
          const intensity = cell.currentMonth ? getIntensityLevel(distance) : 0;
          const isToday = cell.dateKey === todayKey && cell.currentMonth;
          const isSelected = cell.dateKey === selectedDay;
          const hasRides = dayRides.length > 0 && cell.currentMonth;
          const heatRatio = distance > 0 ? distance / maxDistance : 0;

          return (
            <div
              key={cell.dateKey + (cell.currentMonth ? '-cur' : '-adj')}
              className={classNames(styles.cell, {
                [styles.cellOtherMonth]: !cell.currentMonth,
                [styles.cellToday]: isToday,
                [styles.cellSelected]: isSelected,
                [styles.cellClickable]: hasRides,
                [styles.intensity1]: intensity === 1,
                [styles.intensity2]: intensity === 2,
                [styles.intensity3]: intensity === 3,
                [styles.intensity4]: intensity === 4,
              })}
              style={hasRides ? { '--heat-ratio': heatRatio } as React.CSSProperties : undefined}
              onClick={() => handleDayClick(cell.dateKey, cell.currentMonth)}
              role={hasRides ? 'button' : undefined}
              tabIndex={hasRides ? 0 : undefined}
              onKeyDown={(e) => {
                if (hasRides && (e.key === 'Enter' || e.key === ' ')) {
                  handleDayClick(cell.dateKey, cell.currentMonth);
                }
              }}
            >
              <span className={styles.dayNumber}>{cell.day}</span>
              {hasRides && (
                <div className={styles.rideInfo}>
                  <span className={styles.rideDistance}>{formatDistance(distance)}</span>
                  {dayRides.length > 1 && (
                    <span className={styles.rideBadge}>{dayRides.length}</span>
                  )}
                </div>
              )}
              {hasRides && <div className={styles.heatBar} />}
            </div>
          );
        })}
      </div>

      <div className={styles.legend}>
        <span className={styles.legendLabel}>Less</span>
        <div className={classNames(styles.legendDot, styles.legendDot1)} />
        <div className={classNames(styles.legendDot, styles.legendDot2)} />
        <div className={classNames(styles.legendDot, styles.legendDot3)} />
        <div className={classNames(styles.legendDot, styles.legendDot4)} />
        <span className={styles.legendLabel}>More</span>
        <span className={styles.legendSeparator} />
        <span className={styles.legendHint}>Click a day to view rides</span>
      </div>
    </div>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

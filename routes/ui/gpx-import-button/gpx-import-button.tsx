import * as React from 'react';
import { useRef, useState, useCallback } from 'react';
import classNames from 'classnames';
import { Button } from '@markec/mototrack-design.actions.button';
import styles from './gpx-import-button.module.scss';

export type GpxLatLng = {
  lat: number;
  lng: number;
};

export type GpxWaypoint = {
  id: string;
  name?: string;
  lat: number;
  lng: number;
};

export type ParsedGpxRoute = {
  name: string;
  waypoints: GpxWaypoint[];
  geometry: GpxLatLng[];
};

export type GpxImportButtonProps = {
  /**
   * Called with the parsed GPX route data when a valid file is loaded.
   */
  onLoad: (parsedRoute: ParsedGpxRoute) => void;

  /**
   * Called when a parse or file-read error occurs.
   */
  onError?: (message: string) => void;

  /**
   * Button label text.
   */
  label?: string;

  /**
   * Additional class name for the root element.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;
};

function parseGpx(xmlText: string): ParsedGpxRoute {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, `application/xml`);

  const parseError = doc.querySelector(`parsererror`);
  if (parseError) {
    throw new Error(`Invalid GPX file: XML parse error`);
  }

  const gpxEl = doc.querySelector(`gpx`);
  if (!gpxEl) {
    throw new Error(`Invalid GPX file: missing <gpx> root element`);
  }

  const metaName = doc.querySelector(`metadata > name`)?.textContent?.trim();
  const trkName = doc.querySelector(`trk > name`)?.textContent?.trim();
  const routeName = metaName ?? trkName ?? `Imported Route`;

  const wptEls = Array.from(doc.querySelectorAll(`wpt`));
  const waypoints: GpxWaypoint[] = wptEls.map((el, idx) => {
    const lat = Number.parseFloat(el.getAttribute(`lat`) ?? `0`);
    const lng = Number.parseFloat(el.getAttribute(`lon`) ?? `0`);
    const name = el.querySelector(`name`)?.textContent?.trim();
    return { id: `wpt-${idx}`, name, lat, lng };
  });

  const trkptEls = Array.from(doc.querySelectorAll(`trkseg > trkpt`));
  const geometry: GpxLatLng[] = trkptEls.map((el) => ({
    lat: Number.parseFloat(el.getAttribute(`lat`) ?? `0`),
    lng: Number.parseFloat(el.getAttribute(`lon`) ?? `0`),
  }));

  if (geometry.length === 0) {
    const rteptEls = Array.from(doc.querySelectorAll(`rte > rtept`));
    rteptEls.forEach((el) => {
      geometry.push({
        lat: Number.parseFloat(el.getAttribute(`lat`) ?? `0`),
        lng: Number.parseFloat(el.getAttribute(`lon`) ?? `0`),
      });
    });
  }

  if (geometry.length === 0 && waypoints.length > 0) {
    waypoints.forEach((wp) => geometry.push({ lat: wp.lat, lng: wp.lng }));
  }

  if (geometry.length === 0 && waypoints.length === 0) {
    throw new Error(`GPX file contains no track points or waypoints`);
  }

  return { name: routeName, waypoints, geometry };
}

function UploadIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M8 10V3M8 3L5 6M8 3l3 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 11v1a1 1 0 001 1h8a1 1 0 001-1v-1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3 8l4 4 6-7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type ImportStatus = `idle` | `loading` | `success` | `error`;

/**
 * GPX file picker button. Parses GPX 1.1 XML (DOMParser) into
 * waypoints[] + geometry[]. Calls onLoad(parsedRoute) on success.
 */
export function GpxImportButton({
  onLoad,
  onError,
  label = `Import GPX`,
  className,
  style,
}: GpxImportButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<ImportStatus>(`idle`);
  const [errorMessage, setErrorMessage] = useState<string>(``);
  const [successName, setSuccessName] = useState<string>(``);

  const handleButtonClick = useCallback(() => {
    setStatus(`idle`);
    setErrorMessage(``);
    setSuccessName(``);
    inputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.name.toLowerCase().endsWith(`.gpx`)) {
        const msg = `Please select a valid .gpx file`;
        setStatus(`error`);
        setErrorMessage(msg);
        onError?.(msg);
        return;
      }

      setStatus(`loading`);

      const reader = new FileReader();

      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text !== `string`) {
          const msg = `Failed to read file`;
          setStatus(`error`);
          setErrorMessage(msg);
          onError?.(msg);
          return;
        }

        try {
          const parsed = parseGpx(text);
          setStatus(`success`);
          setSuccessName(parsed.name);
          onLoad(parsed);
        } catch (err) {
          const msg = err instanceof Error ? err.message : `Unknown parse error`;
          setStatus(`error`);
          setErrorMessage(msg);
          onError?.(msg);
        }
      };

      reader.onerror = () => {
        const msg = `File read failed`;
        setStatus(`error`);
        setErrorMessage(msg);
        onError?.(msg);
      };

      reader.readAsText(file);

      e.target.value = ``;
    },
    [onLoad, onError]
  );

  const isLoading = status === `loading`;
  const isSuccess = status === `success`;
  const isError = status === `error`;

  const buttonLabel = isSuccess ? `GPX Loaded` : label;
  const buttonVariant = isSuccess ? `success` : `secondary`;

  return (
    <div className={classNames(styles.root, className)} style={style}>
      <input
        ref={inputRef}
        type="file"
        accept=".gpx,application/gpx+xml,application/xml"
        className={styles.hiddenInput}
        onChange={(e) => handleFileChange(e)}
        tabIndex={-1}
      />

      <Button
        variant={buttonVariant}
        size="md"
        leftIcon={isSuccess ? <CheckIcon /> : <UploadIcon />}
        loading={isLoading}
        onClick={() => handleButtonClick()}
      >
        {buttonLabel}
      </Button>

      {isSuccess && (
        <div className={styles.successBadge}>
          <span className={styles.successDot} />
          <span className={styles.successText}>{successName}</span>
        </div>
      )}

      {isError && (
        <div className={styles.errorBadge}>
          <span className={styles.errorIcon}>!</span>
          <span className={styles.errorText}>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}

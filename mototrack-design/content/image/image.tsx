import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import styles from './image.module.scss';

export type AspectRatio = `${number}/${number}` | 'auto';
export type ObjectFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
export type BorderRadius = 'none' | 'xs' | 'small' | 'medium' | 'large' | 'xl' | 'xxl' | 'full';

export type ImageProps = {
  /**
   * The image source URL.
   */
  src?: string;

  /**
   * Alternative text for the image. Also used as fallback label when the image fails to load.
   */
  alt?: string;

  /**
   * Aspect ratio of the image container, e.g. "16/9", "4/3", "1/1".
   * Defaults to "auto" which lets the image determine its own height.
   */
  aspectRatio?: AspectRatio;

  /**
   * CSS object-fit value controlling how the image fills its container.
   */
  objectFit?: ObjectFit;

  /**
   * Border radius preset applied to the image container.
   */
  borderRadius?: BorderRadius;

  /**
   * Enable lazy loading via the Intersection Observer API.
   * The image only loads when it enters the viewport.
   */
  lazy?: boolean;

  /**
   * Width of the image container. Accepts any valid CSS width value.
   */
  width?: string;

  /**
   * Height of the image container. Accepts any valid CSS height value.
   * Ignored when aspectRatio is set.
   */
  height?: string;

  /**
   * Optional caption rendered below the image.
   */
  caption?: string;

  /**
   * Additional CSS class name for the root wrapper element.
   */
  className?: string;

  /**
   * Inline styles for the root wrapper element.
   */
  style?: React.CSSProperties;

  /**
   * Callback fired when the image finishes loading successfully.
   */
  onLoad?: () => void;

  /**
   * Callback fired when the image fails to load.
   */
  onError?: () => void;
};

const RADIUS_MAP: Record<BorderRadius, string> = {
  none: `var(--borders-radius-none)`,
  xs: `var(--borders-radius-xs)`,
  small: `var(--borders-radius-small)`,
  medium: `var(--borders-radius-medium)`,
  large: `var(--borders-radius-large)`,
  xl: `var(--borders-radius-xl)`,
  xxl: `var(--borders-radius-xxl)`,
  full: `var(--borders-radius-full)`,
};

export function Image({
  src,
  alt = ``,
  aspectRatio = `auto`,
  objectFit = `cover`,
  borderRadius = `medium`,
  lazy = true,
  width,
  height,
  caption,
  className,
  style,
  onLoad,
  onError,
}: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(!lazy);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lazy) return;
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: `200px` }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [lazy]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onLoad?.();
    onError?.();
  };

  const containerStyle: React.CSSProperties = {
    aspectRatio: aspectRatio !== `auto` ? aspectRatio.replace(`/`, ` / `) : undefined,
    width: width,
    height: aspectRatio === `auto` ? height : undefined,
    borderRadius: RADIUS_MAP[borderRadius],
    ...style,
  };

  const showFallback = hasError || !src;

  return (
    <figure
      className={classNames(styles.figure, className)}
      style={containerStyle}
      ref={containerRef}
    >
      <div
        className={classNames(styles.wrapper, {
          [styles.loaded]: isLoaded && !showFallback,
        })}
      >
        {showFallback ? (
          <div className={styles.fallback}>
            <span className={styles.fallbackIcon}>
              <ImagePlaceholderIcon />
            </span>
            {alt && <span className={styles.fallbackAlt}>{alt}</span>}
          </div>
        ) : (
          <>
            <div
              className={classNames(styles.skeleton, {
                [styles.skeletonHidden]: isLoaded,
              })}
            />
            {isVisible && (
              <img
                src={src}
                alt={alt}
                className={classNames(styles.img, styles[objectFit])}
                onLoad={handleLoad}
                onError={handleError}
                loading={lazy ? `lazy` : `eager`}
              />
            )}
          </>
        )}
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}

function ImagePlaceholderIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="40" height="40" rx="8" fill="rgba(148,163,184,0.08)" />
      <path
        d="M8 28L16 18L22 24L27 19L32 28H8Z"
        fill="rgba(148,163,184,0.25)"
      />
      <circle cx="14" cy="15" r="3" fill="rgba(148,163,184,0.25)" />
      <rect
        x="5"
        y="5"
        width="30"
        height="30"
        rx="4"
        stroke="rgba(148,163,184,0.2)"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}

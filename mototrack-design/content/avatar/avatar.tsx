import React from 'react';
import classNames from 'classnames';
import styles from './avatar.module.scss';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarStatus = 'online' | 'offline';

export type AvatarProps = {
  /**
   * Full name of the person — used to derive initials when no image is provided.
   */
  name?: string;

  /**
   * URL of the avatar image. When provided, the image is shown instead of initials.
   */
  src?: string;

  /**
   * Alt text for the avatar image.
   */
  alt?: string;

  /**
   * Size of the avatar. Defaults to 'md'.
   */
  size?: AvatarSize;

  /**
   * Optional status indicator dot shown at the bottom-right of the avatar.
   */
  status?: AvatarStatus;

  /**
   * Additional class name applied to the root element.
   */
  className?: string;

  /**
   * Inline styles applied to the root element.
   */
  style?: React.CSSProperties;
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function Avatar({
  name = `Marco Bianchi`,
  src,
  alt,
  size = `md`,
  status,
  className,
  style,
}: AvatarProps) {
  const initials = name ? getInitials(name) : `?`;
  const altText = alt ?? name ?? `Avatar`;

  return (
    <span
      className={classNames(
        styles.avatar,
        styles[size],
        { [styles.hasImage]: !!src },
        className
      )}
      style={style}
      aria-label={altText}
    >
      {src ? (
        <img
          src={src}
          alt={altText}
          className={styles.image}
          draggable={false}
        />
      ) : (
        <span className={styles.initials} aria-hidden>
          {initials}
        </span>
      )}

      {status && (
        <span
          className={classNames(styles.statusDot, styles[status])}
        />
      )}
    </span>
  );
}

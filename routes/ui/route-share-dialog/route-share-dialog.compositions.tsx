import React, { useState } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { RouteShareDialog } from './route-share-dialog';
import { mockPlannedRoute, mockShortRoute } from './route-share-dialog.mock';

const triggerButtonStyle: React.CSSProperties = {
  padding: `10px 24px`,
  backgroundColor: `#f97316`,
  color: `#020617`,
  border: `none`,
  borderRadius: `8px`,
  fontWeight: `700`,
  fontSize: `14px`,
  cursor: `pointer`,
  letterSpacing: `0.02em`,
};

const pageStyle: React.CSSProperties = {
  minHeight: `100vh`,
  backgroundColor: `#020617`,
  display: `flex`,
  alignItems: `center`,
  justifyContent: `center`,
  padding: `40px`,
};

/**
 * Default — opens the share dialog for a long alpine route.
 */
export const Default = () => {
  const [open, setOpen] = useState(false);

  return (
    <MockProvider>
      <div style={pageStyle}>
        <button type="button" style={triggerButtonStyle} onClick={() => setOpen(true)}>
          🏍️ Share Alpine Loop
        </button>
        <RouteShareDialog
          open={open}
          onClose={() => setOpen(false)}
          route={mockPlannedRoute}
        />
      </div>
    </MockProvider>
  );
};

/**
 * OpenByDefault — dialog pre-opened for visual inspection.
 */
export const OpenByDefault = () => {
  const [open, setOpen] = useState(true);

  return (
    <MockProvider>
      <div style={pageStyle}>
        <RouteShareDialog
          open={open}
          onClose={() => setOpen(false)}
          route={mockPlannedRoute}
        />
        {!open && (
          <button type="button" style={triggerButtonStyle} onClick={() => setOpen(true)}>
            Reopen Dialog
          </button>
        )}
      </div>
    </MockProvider>
  );
};

/**
 * ShortRoute — dialog for a short city sprint route.
 */
export const ShortRoute = () => {
  const [open, setOpen] = useState(false);

  return (
    <MockProvider>
      <div style={pageStyle}>
        <button type="button" style={triggerButtonStyle} onClick={() => setOpen(true)}>
          🏙️ Share City Sprint
        </button>
        <RouteShareDialog
          open={open}
          onClose={() => setOpen(false)}
          route={mockShortRoute}
        />
      </div>
    </MockProvider>
  );
};

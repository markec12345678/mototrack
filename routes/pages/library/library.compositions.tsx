import * as React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Library } from './library.js';
import { mockRoutes } from './library.mock.js';

/**
 * FullLibrary — all six mock routes displayed in the grid.
 * Demonstrates the card layout, mini-map previews, mode badges and action buttons.
 */
export const FullLibrary = () => {
  return (
    <MockProvider>
      <Library
        mockRoutes={mockRoutes}
        onLoadRoute={(route) => console.log(`Load`, route.name)}
        onShareRoute={(route) => console.log(`Share`, route.name)}
        onExportGpx={(route) => console.log(`GPX`, route.name)}
        onDeleteRoute={(route) => console.log(`Delete`, route.name)}
      />
    </MockProvider>
  );
};

/**
 * FilteredByMode — library pre-filtered to show only twisty routes.
 * Shows the filter toolbar in an active state.
 */
export const FilteredByMode = () => {
  return (
    <MockProvider>
      <Library
        mockRoutes={mockRoutes.filter((r) => r.mode === `twisty`)}
        onLoadRoute={(route) => console.log(`Load`, route.name)}
        onShareRoute={(route) => console.log(`Share`, route.name)}
        onExportGpx={(route) => console.log(`GPX`, route.name)}
        onDeleteRoute={(route) => console.log(`Delete`, route.name)}
      />
    </MockProvider>
  );
};

/**
 * EmptyLibrary — no saved routes, shows the empty state with a CTA.
 */
export const EmptyLibrary = () => {
  return (
    <MockProvider>
      <Library
        mockRoutes={[]}
        onLoadRoute={(route) => console.log(`Load`, route.name)}
        onShareRoute={(route) => console.log(`Share`, route.name)}
        onExportGpx={(route) => console.log(`GPX`, route.name)}
        onDeleteRoute={(route) => console.log(`Delete`, route.name)}
      />
    </MockProvider>
  );
};

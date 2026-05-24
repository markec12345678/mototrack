import { IconicTour, mockIconicTours, mockIconicTour } from '@markec/balkan-roads.entities.iconic-tour';

/**
 * A curated subset of seed tours used in tests and compositions.
 */
export const mockTours: IconicTour[] = mockIconicTours().slice(0, 6);

/**
 * A single mock tour for getTour() assertions.
 */
export const mockSingleTour: IconicTour = mockIconicTour();

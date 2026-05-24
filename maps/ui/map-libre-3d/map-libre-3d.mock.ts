import { LatLng } from '@markec/maps.entities.lat-lng';

/** Stelvio Pass summit — classic alpine motorcycle destination */
export const mockCenter: LatLng = LatLng.from({ lat: 46.5253, lng: 10.4536 });

/** Transfăgărășan Highway, Romania */
export const mockCenterTransfagarasan: LatLng = LatLng.from({ lat: 45.6025, lng: 24.6175 });

/** Grossglockner High Alpine Road, Austria */
export const mockCenterGrossglockner: LatLng = LatLng.from({ lat: 47.0748, lng: 12.8376 });

/** A winding alpine route over the Stelvio Pass */
export const mockRoute: LatLng[] = [
  LatLng.from({ lat: 46.5000, lng: 10.4200 }),
  LatLng.from({ lat: 46.5080, lng: 10.4280 }),
  LatLng.from({ lat: 46.5140, lng: 10.4350 }),
  LatLng.from({ lat: 46.5190, lng: 10.4410 }),
  LatLng.from({ lat: 46.5230, lng: 10.4460 }),
  LatLng.from({ lat: 46.5253, lng: 10.4536 }),
  LatLng.from({ lat: 46.5270, lng: 10.4610 }),
  LatLng.from({ lat: 46.5290, lng: 10.4680 }),
  LatLng.from({ lat: 46.5310, lng: 10.4750 }),
  LatLng.from({ lat: 46.5340, lng: 10.4830 }),
  LatLng.from({ lat: 46.5370, lng: 10.4910 }),
  LatLng.from({ lat: 46.5400, lng: 10.5000 }),
];

/** Transfăgărășan route segment */
export const mockRouteTransfagarasan: LatLng[] = [
  LatLng.from({ lat: 45.5700, lng: 24.5900 }),
  LatLng.from({ lat: 45.5800, lng: 24.6000 }),
  LatLng.from({ lat: 45.5900, lng: 24.6050 }),
  LatLng.from({ lat: 45.6000, lng: 24.6100 }),
  LatLng.from({ lat: 45.6025, lng: 24.6175 }),
  LatLng.from({ lat: 45.6100, lng: 24.6250 }),
  LatLng.from({ lat: 45.6200, lng: 24.6350 }),
  LatLng.from({ lat: 45.6300, lng: 24.6450 }),
];

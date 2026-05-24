import type { ParsedGpxRoute } from './gpx-import-button.js';

export const mockParsedRoute: ParsedGpxRoute = {
  name: `Vršič Pass Loop`,
  waypoints: [
    { id: `wpt-0`, name: `Kranjska Gora`, lat: 46.4839, lng: 13.7864 },
    { id: `wpt-1`, name: `Vršič Pass`, lat: 46.4378, lng: 13.7447 },
    { id: `wpt-2`, name: `Trenta`, lat: 46.3997, lng: 13.6981 },
    { id: `wpt-3`, name: `Bovec`, lat: 46.3378, lng: 13.5522 },
  ],
  geometry: [
    { lat: 46.4839, lng: 13.7864 },
    { lat: 46.4750, lng: 13.7800 },
    { lat: 46.4650, lng: 13.7720 },
    { lat: 46.4550, lng: 13.7620 },
    { lat: 46.4450, lng: 13.7530 },
    { lat: 46.4378, lng: 13.7447 },
    { lat: 46.4280, lng: 13.7300 },
    { lat: 46.4150, lng: 13.7150 },
    { lat: 46.4050, lng: 13.7050 },
    { lat: 46.3997, lng: 13.6981 },
    { lat: 46.3800, lng: 13.6700 },
    { lat: 46.3600, lng: 13.6200 },
    { lat: 46.3378, lng: 13.5522 },
  ],
};

export const mockGpxXml = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="MotoTrack" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>Vršič Pass Loop</name>
  </metadata>
  <wpt lat="46.4839" lon="13.7864">
    <name>Kranjska Gora</name>
  </wpt>
  <wpt lat="46.4378" lon="13.7447">
    <name>Vršič Pass</name>
  </wpt>
  <wpt lat="46.3997" lon="13.6981">
    <name>Trenta</name>
  </wpt>
  <wpt lat="46.3378" lon="13.5522">
    <name>Bovec</name>
  </wpt>
  <trk>
    <name>Vršič Pass Loop</name>
    <trkseg>
      <trkpt lat="46.4839" lon="13.7864" />
      <trkpt lat="46.4750" lon="13.7800" />
      <trkpt lat="46.4650" lon="13.7720" />
      <trkpt lat="46.4550" lon="13.7620" />
      <trkpt lat="46.4450" lon="13.7530" />
      <trkpt lat="46.4378" lon="13.7447" />
      <trkpt lat="46.4280" lon="13.7300" />
      <trkpt lat="46.4150" lon="13.7150" />
      <trkpt lat="46.4050" lon="13.7050" />
      <trkpt lat="46.3997" lon="13.6981" />
      <trkpt lat="46.3800" lon="13.6700" />
      <trkpt lat="46.3600" lon="13.6200" />
      <trkpt lat="46.3378" lon="13.5522" />
    </trkseg>
  </trk>
</gpx>`;

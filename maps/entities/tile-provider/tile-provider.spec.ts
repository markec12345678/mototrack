import { describe, it, expect } from 'vitest';
import { TileProvider, BUILT_IN_PROVIDERS } from './tile-provider.js';
import {
  mockTileProvider,
  mockTileProviders,
  mockDarkTileProvider,
  mockSatelliteTileProvider,
  mockTopoTileProvider,
} from './tile-provider.mock.js';

describe('TileProvider', () => {
  describe('TileProvider.from()', () => {
    it('creates a TileProvider from a plain object', () => {
      const provider = TileProvider.from({
        key: 'test-provider',
        label: 'Test Provider',
        urlTemplate: 'https://tile.example.com/{z}/{x}/{y}.png',
        attribution: '© Test',
        maxZoom: 18,
        subdomains: ['a', 'b'],
      });

      expect(provider).toBeInstanceOf(TileProvider);
      expect(provider.key).toBe('test-provider');
      expect(provider.label).toBe('Test Provider');
      expect(provider.urlTemplate).toBe('https://tile.example.com/{z}/{x}/{y}.png');
      expect(provider.attribution).toBe('© Test');
      expect(provider.maxZoom).toBe(18);
      expect(provider.subdomains).toEqual(['a', 'b']);
    });

    it('applies default maxZoom of 19 when not provided', () => {
      const provider = TileProvider.from({
        key: 'test',
        label: 'Test',
        urlTemplate: 'https://tile.example.com/{z}/{x}/{y}.png',
        attribution: '© Test',
      });

      expect(provider.maxZoom).toBe(19);
    });

    it('applies default empty subdomains when not provided', () => {
      const provider = TileProvider.from({
        key: 'test',
        label: 'Test',
        urlTemplate: 'https://tile.example.com/{z}/{x}/{y}.png',
        attribution: '© Test',
      });

      expect(provider.subdomains).toEqual([]);
    });

    it('safely handles missing optional fields with defaults', () => {
      const provider = TileProvider.from({
        key: '',
        label: '',
        urlTemplate: '',
        attribution: '',
      });

      expect(provider.key).toBe('');
      expect(provider.subdomains).toEqual([]);
      expect(provider.maxZoom).toBe(19);
    });
  });

  describe('toObject()', () => {
    it('serializes a TileProvider to a plain object', () => {
      const provider = TileProvider.from({
        key: 'carto-voyager',
        label: 'Streets',
        urlTemplate: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        attribution: '© OpenStreetMap',
        maxZoom: 19,
        subdomains: ['a', 'b', 'c', 'd'],
      });

      const obj = provider.toObject();

      expect(obj.key).toBe('carto-voyager');
      expect(obj.label).toBe('Streets');
      expect(obj.urlTemplate).toBe(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
      );
      expect(obj.attribution).toBe('© OpenStreetMap');
      expect(obj.maxZoom).toBe(19);
      expect(obj.subdomains).toEqual(['a', 'b', 'c', 'd']);
    });

    it('round-trips through from() and toObject()', () => {
      const plain = {
        key: 'esri-satellite',
        label: 'Satellite',
        urlTemplate: 'https://server.arcgisonline.com/tile/{z}/{y}/{x}',
        attribution: '© Esri',
        maxZoom: 19,
        subdomains: [] as string[],
      };

      const obj = TileProvider.from(plain).toObject();
      expect(obj).toEqual(plain);
    });
  });

  describe('hasSubdomains', () => {
    it('returns true when subdomains are defined', () => {
      const provider = TileProvider.from({
        key: 'test',
        label: 'Test',
        urlTemplate: 'https://{s}.tile.example.com/{z}/{x}/{y}.png',
        attribution: '© Test',
        subdomains: ['a', 'b', 'c'],
      });

      expect(provider.hasSubdomains).toBe(true);
    });

    it('returns false when subdomains are empty', () => {
      const provider = TileProvider.from({
        key: 'test',
        label: 'Test',
        urlTemplate: 'https://tile.example.com/{z}/{x}/{y}.png',
        attribution: '© Test',
        subdomains: [],
      });

      expect(provider.hasSubdomains).toBe(false);
    });
  });

  describe('getTileUrl()', () => {
    it('resolves x, y, z placeholders in the URL template', () => {
      const provider = TileProvider.from({
        key: 'test',
        label: 'Test',
        urlTemplate: 'https://tile.example.com/{z}/{x}/{y}.png',
        attribution: '© Test',
      });

      const url = provider.getTileUrl(10, 20, 5);
      expect(url).toBe('https://tile.example.com/5/10/20.png');
    });

    it('rotates subdomains based on tile coordinates', () => {
      const provider = TileProvider.from({
        key: 'test',
        label: 'Test',
        urlTemplate: 'https://{s}.tile.example.com/{z}/{x}/{y}.png',
        attribution: '© Test',
        subdomains: ['a', 'b', 'c'],
      });

      const url = provider.getTileUrl(0, 0, 5);
      expect(url).toContain('.tile.example.com');
      expect(url).not.toContain('{s}');
    });

    it('does not replace {s} when no subdomains are defined', () => {
      const provider = TileProvider.from({
        key: 'test',
        label: 'Test',
        urlTemplate: 'https://tile.example.com/{z}/{x}/{y}.png',
        attribution: '© Test',
      });

      const url = provider.getTileUrl(1, 2, 3);
      expect(url).toBe('https://tile.example.com/3/1/2.png');
    });
  });

  describe('BUILT_IN_PROVIDERS', () => {
    it('exports four built-in providers', () => {
      expect(BUILT_IN_PROVIDERS).toHaveLength(4);
    });

    it('includes carto-voyager provider', () => {
      const voyager = BUILT_IN_PROVIDERS.find((p) => p.key === 'carto-voyager');
      expect(voyager).toBeDefined();
      expect(voyager?.label).toContain('CARTO');
    });

    it('includes carto-dark provider', () => {
      const dark = BUILT_IN_PROVIDERS.find((p) => p.key === 'carto-dark');
      expect(dark).toBeDefined();
    });

    it('includes esri-satellite provider', () => {
      const satellite = BUILT_IN_PROVIDERS.find((p) => p.key === 'esri-satellite');
      expect(satellite).toBeDefined();
    });

    it('includes opentopomap provider', () => {
      const topo = BUILT_IN_PROVIDERS.find((p) => p.key === 'opentopomap');
      expect(topo).toBeDefined();
      expect(topo?.maxZoom).toBe(17);
    });

    it('all built-in providers have required fields', () => {
      for (const provider of BUILT_IN_PROVIDERS) {
        expect(provider.key).toBeTruthy();
        expect(provider.label).toBeTruthy();
        expect(provider.urlTemplate).toBeTruthy();
        expect(provider.attribution).toBeTruthy();
      }
    });
  });

  describe('Mock helpers', () => {
    it('mockTileProvider() returns a TileProvider instance', () => {
      const provider = mockTileProvider();
      expect(provider).toBeInstanceOf(TileProvider);
      expect(provider.key).toBe('carto-voyager');
    });

    it('mockTileProvider() supports partial overrides', () => {
      const provider = mockTileProvider({ label: 'Custom Label', maxZoom: 10 });
      expect(provider.label).toBe('Custom Label');
      expect(provider.maxZoom).toBe(10);
    });

    it('mockTileProviders() returns all four built-in providers', () => {
      const providers = mockTileProviders();
      expect(providers).toHaveLength(4);
      providers.forEach((p) => expect(p).toBeInstanceOf(TileProvider));
    });

    it('mockDarkTileProvider() returns the dark provider', () => {
      const provider = mockDarkTileProvider();
      expect(provider.key).toBe('carto-dark');
    });

    it('mockSatelliteTileProvider() returns the satellite provider', () => {
      const provider = mockSatelliteTileProvider();
      expect(provider.key).toBe('esri-satellite');
      expect(provider.hasSubdomains).toBe(false);
    });

    it('mockTopoTileProvider() returns the topo provider with maxZoom 17', () => {
      const provider = mockTopoTileProvider();
      expect(provider.key).toBe('opentopomap');
      expect(provider.maxZoom).toBe(17);
      expect(provider.subdomains).toEqual(['a', 'b', 'c']);
    });
  });
});

import { UseBtHelmetReturn } from './use-bt-helmet.js';

/**
 * Mock return value simulating a browser that supports Web Bluetooth but
 * has no device connected yet.
 */
export const mockBtHelmetDisconnected: UseBtHelmetReturn = {
  isSupported: true,
  isConnected: false,
  deviceName: null,
  error: null,
  connect: async () => {},
  disconnect: () => {},
};

/**
 * Mock return value simulating a successfully connected Sena SMH10 helmet.
 */
export const mockBtHelmetConnectedSena: UseBtHelmetReturn = {
  isSupported: true,
  isConnected: true,
  deviceName: 'Sena SMH10',
  error: null,
  connect: async () => {},
  disconnect: () => {},
};

/**
 * Mock return value simulating a successfully connected Cardo Packtalk Bold.
 */
export const mockBtHelmetConnectedCardo: UseBtHelmetReturn = {
  isSupported: true,
  isConnected: true,
  deviceName: 'Cardo Packtalk Bold',
  error: null,
  connect: async () => {},
  disconnect: () => {},
};

/**
 * Mock return value simulating an unsupported browser (no Web Bluetooth API).
 */
export const mockBtHelmetUnsupported: UseBtHelmetReturn = {
  isSupported: false,
  isConnected: false,
  deviceName: null,
  error: null,
  connect: async () => {},
  disconnect: () => {},
};

/**
 * Mock return value simulating a connection error.
 */
export const mockBtHelmetError: UseBtHelmetReturn = {
  isSupported: true,
  isConnected: false,
  deviceName: null,
  error: 'Bluetooth adapter not found or permission denied.',
  connect: async () => {},
  disconnect: () => {},
};

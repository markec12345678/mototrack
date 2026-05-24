// Minimal Web Bluetooth API type declarations for TypeScript environments
// that do not include lib.dom.d.ts bluetooth definitions.

interface BluetoothRequestDeviceFilter {
  services?: BluetoothServiceUUID[];
  name?: string;
  namePrefix?: string;
}

type BluetoothServiceUUID = string | number;

interface RequestDeviceOptions {
  filters?: BluetoothRequestDeviceFilter[];
  optionalServices?: BluetoothServiceUUID[];
  acceptAllDevices?: boolean;
}

interface BluetoothRemoteGATTServer {
  readonly connected: boolean;
  connect(): Promise<BluetoothRemoteGATTServer>;
  disconnect(): void;
}

interface BluetoothDevice extends EventTarget {
  readonly id: string;
  readonly name?: string;
  readonly gatt?: BluetoothRemoteGATTServer;
  addEventListener(type: 'gattserverdisconnected', listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  removeEventListener(type: 'gattserverdisconnected', listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

interface Bluetooth {
  requestDevice(options: RequestDeviceOptions): Promise<BluetoothDevice>;
}

interface Navigator {
  readonly bluetooth: Bluetooth;
}

// Courier adapter with a mock implementation. The interface matches what
// a Shiprocket integration will need later — swap `createShipment` and
// `trackShipment` internals for Shiprocket API calls (or extend this file)
// without touching any order/status UI code.
//
// Docs: https://apiv2.shiprocket.in (create shipment, track shipment,
// webhook: shipment_updated).

const MOCK_PREFIX = 'TRK-IN-';

export const shipmentsProvider = 'mock';

export const isMockShipments = true;

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export const createShipment = async (order) => {
  // Mock: instant AWB in the same format the demo UI already renders.
  await delay(150);
  const awb = `${MOCK_PREFIX}${Math.floor(1000000 + Math.random() * 9000000)}`;
  return {
    provider: shipmentsProvider,
    awb,
    status: 'in_transit',
    orderId: order?.id,
    expectedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
  };
};

export const trackShipment = async (awb) => {
  await delay(150);
  return {
    provider: shipmentsProvider,
    awb,
    status: 'in_transit',
    scans: [
      { status: 'Picked up', location: 'Sorting Facility', at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
      { status: 'In transit', location: 'Regional Hub', at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() }
    ]
  };
};

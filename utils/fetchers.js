const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchTrucks = async () => {
  const res = await fetch(`${BASE_URL}/trucks`);
  if (!res.ok) throw new Error('Failed to fetch trucks');
  return res.json();
};

export const fetchDrivers = async () => {
  const res = await fetch(`${BASE_URL}/drivers`);
  if (!res.ok) throw new Error('Failed to fetch drivers');
  return res.json();
};

export const fetchOrders = async () => {
  const res = await fetch(`${BASE_URL}/orders`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
};

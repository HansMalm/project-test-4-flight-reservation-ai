export interface ApiFlight {
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  seatsRemaining: number;
  price: number;
}

export async function fetchFlights(
  onlyAvailable: boolean,
): Promise<ApiFlight[]> {
  const path = onlyAvailable ? '/api/flights/available' : '/api/flights';
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}${path}`);

  if (!res.ok) {
    throw new Error(
      `Failed to fetch flights: ${res.status} ${res.statusText}`,
    );
  }

  return (await res.json()) as ApiFlight[];
}

export interface ApiFlight {
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  seatsRemaining: number;
  price: number;
}

/**
 * Pulls a human-readable message out of a failed response. The backend sends
 * errors as RFC 7807 ProblemDetail JSON ({ title, status, detail }), so we
 * prefer `detail`; if the body isn't JSON we fall back to the status line.
 * (Same helper as api/bookings.ts — kept local so this module stays standalone.)
 */
async function readError(res: Response, fallback: string): Promise<string> {
  try {
    const problem = await res.json()
    if (typeof problem?.detail === 'string') return problem.detail
  } catch {
    /* body wasn't JSON */
  }
  return `${fallback}: ${res.status} ${res.statusText}`
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

export async function fetchFlightByNumber(
  flightNumber: string,
): Promise<ApiFlight> {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/flights/${encodeURIComponent(flightNumber)}`,
  );

  if (!res.ok) {
    throw new Error(await readError(res, 'Failed to fetch flight'));
  }

  return (await res.json()) as ApiFlight;
}

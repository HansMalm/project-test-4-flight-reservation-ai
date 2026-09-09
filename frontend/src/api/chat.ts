interface ChatResponse {
  reply: string
}

/**
 * Pulls a human-readable message out of a failed response. The backend sends
 * errors as RFC 7807 ProblemDetail JSON ({ title, status, detail }), so we
 * prefer `detail`; if the body isn't JSON we fall back to the status line.
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

export async function sendChatMessage(
  chatId: string,
  message: string,
): Promise<string> {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId, message }),
  })

  if (!res.ok) {
    throw new Error(await readError(res, 'Failed to send message'))
  }

  return ((await res.json()) as ChatResponse).reply
}

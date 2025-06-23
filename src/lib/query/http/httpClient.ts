/**
 * Makes an HTTP request using the Fetch API and returns the response as JSON.
 *
 * @template T - The expected response type.
 * @param url - The URL to send the request to.
 * @param options - Optional fetch options (method, headers, body, etc.).
 * @returns A promise that resolves to the parsed JSON response of type `T`.
 * @throws {Error} If the response is not OK, throws an error with the message from the response or a default message.
 */
export async function httpClient<T = unknown>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Something went wrong");
  }

  return res.json();
}

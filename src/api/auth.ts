export async function fetchCurrentUser(token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return await res.json();
}

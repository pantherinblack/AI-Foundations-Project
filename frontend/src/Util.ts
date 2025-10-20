export async function requestBackend(body: any): Promise<string> {
  const response = await fetch("/api/poem", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return await response.json();
}

export async function callAI(prompt: string): Promise<string> {
  const res = await fetch("http://localhost:4000/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) throw new Error("AI request failed");
  const data = await res.json();
  return data.choices[0].message.content;
}

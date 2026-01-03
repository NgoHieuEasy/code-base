export async function loginApi(payload: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 500));
  return payload;
}

import "server-only";

export class SupabaseRequestError extends Error {
  code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = "SupabaseRequestError";
    this.code = code;
  }
}

function databaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey =
    process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !secretKey) throw new Error("Rewards database is not configured.");
  return { url: url.replace(/\/$/, ""), secretKey };
}

export async function supabaseRest<T>(
  path: string,
  options: { method?: "GET" | "POST" | "PATCH"; body?: unknown; prefer?: string } = {},
): Promise<T> {
  const { url, secretKey } = databaseConfig();
  const isLegacyJwt = secretKey.startsWith("eyJ");
  const response = await fetch(`${url}/rest/v1/${path}`, {
    method: options.method ?? "GET",
    headers: {
      apikey: secretKey,
      ...(isLegacyJwt ? { authorization: `Bearer ${secretKey}` } : {}),
      "content-type": "application/json",
      ...(options.prefer ? { prefer: options.prefer } : {}),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: "no-store",
  });

  const text = await response.text();
  const payload = text ? (JSON.parse(text) as unknown) : null;
  if (!response.ok) {
    const error = payload as { message?: string; code?: string } | null;
    throw new SupabaseRequestError(error?.message ?? "Database request failed.", error?.code);
  }
  return payload as T;
}

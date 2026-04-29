type SupabaseRestMethod = "GET" | "POST" | "PATCH" | "DELETE";

type SupabaseRestOptions = {
  body?: unknown;
  method?: SupabaseRestMethod;
  prefer?: string;
  searchParams?: Record<string, string>;
};

type SupabaseAdminConfig = {
  serviceRoleKey: string;
  supabaseUrl: string;
};

export class SupabaseAdminError extends Error {
  payload?: unknown;
  status: number;

  constructor(message: string, status = 500, payload?: unknown) {
    super(message);
    this.name = "SupabaseAdminError";
    this.status = status;
    this.payload = payload;
  }
}

function getSupabaseAdminConfig(): SupabaseAdminConfig {
  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new SupabaseAdminError("missing_supabase_env", 500);
  }

  return {
    serviceRoleKey,
    supabaseUrl: supabaseUrl.replace(/\/+$/, "")
  };
}

function parseSupabasePayload(text: string) {
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

export function equalsFilter(value: string) {
  return `eq.${value}`;
}

export async function supabaseRest<T>(
  tableName: string,
  options: SupabaseRestOptions = {}
): Promise<T> {
  const config = getSupabaseAdminConfig();
  const url = new URL(`${config.supabaseUrl}/rest/v1/${tableName}`);

  Object.entries(options.searchParams ?? {}).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const headers: Record<string, string> = {
    apikey: config.serviceRoleKey,
    Authorization: `Bearer ${config.serviceRoleKey}`
  };

  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (options.prefer) {
    headers.Prefer = options.prefer;
  }

  const response = await fetch(url, {
    body:
      options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: "no-store",
    headers,
    method: options.method ?? "GET"
  });

  const payload = parseSupabasePayload(await response.text());

  if (!response.ok) {
    throw new SupabaseAdminError(
      "supabase_request_failed",
      response.status,
      payload
    );
  }

  return payload as T;
}

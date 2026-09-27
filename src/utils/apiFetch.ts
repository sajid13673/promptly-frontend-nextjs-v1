// utils/api/apiFetch.ts
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

async function ensureCsrfCookie(): Promise<void> {
  await fetch(`http://localhost:8000/sanctum/csrf-cookie`, {
    credentials: "include",
  });
}

const STATE_CHANGING_METHODS = ["POST", "PUT", "PATCH", "DELETE"];

export async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const method = (options.method ?? "GET").toUpperCase();

  // Only fetch a fresh CSRF cookie for requests that need it
  if (STATE_CHANGING_METHODS.includes(method)) {
    await ensureCsrfCookie();
  }

  const xsrfToken = getCookie("XSRF-TOKEN");

  const res = await fetch(`${apiUrl}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Client-Type": "web",
      ...(xsrfToken && STATE_CHANGING_METHODS.includes(method)
        ? { "X-XSRF-TOKEN": xsrfToken }
        : {}),
      ...options.headers,
    },
  });

  // Session expired or not authenticated
  const PUBLIC_PATHS = ["/login", "/register", "/forgot-password"];

  if (res.status === 401) {
    if (
      typeof window !== "undefined" &&
      !PUBLIC_PATHS.some((path) => window.location.pathname.startsWith(path))
    ) {
      window.location.href = "/login";
    }
  }

  return res;
}

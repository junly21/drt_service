/**
 * 공통 API 클라이언트
 * 모든 외부 API 호출은 이 클라이언트를 통해 이루어집니다.
 */

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: unknown;
};

type ApiResponse<T> = {
  data: T;
  status: number;
  statusText: string;
};

class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message?: string
  ) {
    super(message || `API Error: ${status} ${statusText}`);
    this.name = "ApiError";
  }
}

/**
 * 기본 API 엔드포인트 URL
 * 환경변수에서 가져오거나 기본값 사용
 * 기본은 /api. 엔드포인트 전용 Route를 우선 사용하고,
 * 필요 시 /api/proxy/[...path]를 사용할 수 있습니다.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

/**
 * 공통 fetch 래퍼 함수
 * 모든 API 호출은 이 함수를 통해 이루어집니다.
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  // 모든 요청은 POST 메소드 사용
  const { method = "POST", headers = {}, body } = options;

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    method: "POST", // 항상 POST 메소드 사용
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body || {}), // body가 없어도 빈 객체 전송
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new ApiError(
        response.status,
        response.statusText,
        `Failed to fetch ${endpoint}: ${response.statusText}`
      );
    }

    const data = await response.json();

    return {
      data,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(
      `Network error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * GET 요청 헬퍼
 */
export async function get<T>(
  endpoint: string,
  headers?: Record<string, string>
) {
  return apiClient<T>(endpoint, { method: "GET", headers });
}

/**
 * POST 요청 헬퍼
 */
export async function post<T>(
  endpoint: string,
  body: unknown,
  headers?: Record<string, string>
) {
  return apiClient<T>(endpoint, { method: "POST", body, headers });
}

/**
 * PUT 요청 헬퍼
 */
export async function put<T>(
  endpoint: string,
  body: unknown,
  headers?: Record<string, string>
) {
  return apiClient<T>(endpoint, { method: "PUT", body, headers });
}

/**
 * DELETE 요청 헬퍼
 */
export async function del<T>(
  endpoint: string,
  headers?: Record<string, string>
) {
  return apiClient<T>(endpoint, { method: "DELETE", headers });
}

export { ApiError };

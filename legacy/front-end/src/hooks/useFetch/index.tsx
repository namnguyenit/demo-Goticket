import { useReducer, useCallback } from "react";

interface FetchState<T> {
  data: any | T;
  loading: boolean;
  error: string | null;
}

type Action<T> =
  | { type: "REQUEST" }
  | { type: "SUCCESS"; payload: T }
  | { type: "ERROR"; payload: { error: string; data: T | null } };

function fetchReducer<T>(
  state: FetchState<T>,
  action: Action<T>,
): FetchState<T> {
  switch (action.type) {
    case "REQUEST":
      return { ...state, loading: true, error: null };
    case "SUCCESS":
      return { ...state, loading: false, data: action.payload };
    case "ERROR":
      return {
        ...state,
        loading: false,
        data: action.payload.data,
        error: action.payload.error,
      };
    default:
      return state;
  }
}

export function useFetch<T = any>(baseUrl: string) {
  const [state, dispatch] = useReducer(fetchReducer<T>, {
    data: null,
    loading: false,
    error: null,
  });

  const request = useCallback(
    async (
      method: string,
      endpoint = "",
      body?: any,
      headers: Record<string, string> = {},
    ): Promise<T | void> => {
      dispatch({ type: "REQUEST" });

      try {
        const res = await fetch(`${baseUrl}${endpoint}`, {
          method,
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          body: body ? JSON.stringify(body) : undefined,
        });

        let json: T | null = null;
        try {
          json = await res.json();
        } catch {
        }

        if (!res.ok) {
          dispatch({
            type: "ERROR",
            payload: {
              data: json,
              error: `HTTP ${res.status}: ${res.statusText}`,
            },
          });
          return;
        }

        dispatch({ type: "SUCCESS", payload: json as T });
        return json as T;
      } catch (err: any) {
        dispatch({
          type: "ERROR",
          payload: {
            data: null,
            error: err.message || "Unknown error",
          },
        });
      }
    },
    [baseUrl],
  );

  const get = useCallback(
    (endpoint = "", headers: Record<string, string> = {}) =>
      request("GET", endpoint, undefined, headers),
    [request],
  );

  const post = useCallback(
    (endpoint = "", body?: any, headers: Record<string, string> = {}) =>
      request("POST", endpoint, body, headers),
    [request],
  );

  const put = useCallback(
    (endpoint = "", body?: any, headers: Record<string, string> = {}) =>
      request("PUT", endpoint, body, headers),
    [request],
  );

  const del = useCallback(
    (endpoint = "", headers: Record<string, string> = {}) =>
      request("DELETE", endpoint, undefined, headers),
    [request],
  );

  return {
    ...state,
    get,
    post,
    put,
    delete: del,
  };
}

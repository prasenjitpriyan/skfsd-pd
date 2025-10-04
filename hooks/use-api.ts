'use client';

import { ApiRequestConfig } from '@/types/api';
import { useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

async function apiFetch<T>(
  url: string,
  { method = 'GET', headers = {}, params, timeout, data }: ApiRequestConfig = {}
): Promise<T> {
  try {
    // Build query params
    if (params) {
      const queryString = new URLSearchParams(
        Object.entries(params).map(([key, val]) => [key, String(val)])
      ).toString();
      url += `?${queryString}`;
    }

    const requestOptions: RequestInit = {
      method,
      headers: { ...headers },
      credentials: 'include',
    };

    // Handle body
    if (method !== 'GET' && method !== 'DELETE' && data !== undefined) {
      if (
        typeof data === 'object' &&
        !(data instanceof FormData) &&
        !(data instanceof Blob)
      ) {
        requestOptions.body = JSON.stringify(data);
        requestOptions.headers = {
          ...requestOptions.headers,
          'Content-Type': 'application/json',
        };
      } else {
        requestOptions.body = data as BodyInit;
      }
    }

    // Timeout handling
    const controller = new AbortController();
    if (timeout) {
      setTimeout(() => controller.abort(), timeout);
    }

    // Execute request
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...requestOptions,
      signal: controller.signal,
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.error?.message || 'Request failed');
    }

    // ✅ Always return `json.data` directly
    return json.data as T;
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') throw new Error('Request timed out');
      throw new Error(error.message);
    }
    throw new Error('Unexpected error');
  }
}

export function useApi() {
  const [isLoading, setIsLoading] = useState(false);

  const request = async <T>(url: string, config: ApiRequestConfig) => {
    setIsLoading(true);
    try {
      return await apiFetch<T>(url, config);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    get: <T>(url: string, config?: Omit<ApiRequestConfig, 'method' | 'data'>) =>
      request<T>(url, { ...config, method: 'GET' }),

    post: <T>(
      url: string,
      data?: ApiRequestConfig['data'],
      config?: Omit<ApiRequestConfig, 'method' | 'data'>
    ) => request<T>(url, { ...config, method: 'POST', data }),

    put: <T>(
      url: string,
      data?: ApiRequestConfig['data'],
      config?: Omit<ApiRequestConfig, 'method' | 'data'>
    ) => request<T>(url, { ...config, method: 'PUT', data }),

    patch: <T>(
      url: string,
      data?: ApiRequestConfig['data'],
      config?: Omit<ApiRequestConfig, 'method' | 'data'>
    ) => request<T>(url, { ...config, method: 'PATCH', data }),

    delete: <T>(
      url: string,
      config?: Omit<ApiRequestConfig, 'method' | 'data'>
    ) => request<T>(url, { ...config, method: 'DELETE' }),
  };
}

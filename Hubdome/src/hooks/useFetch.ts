// src/hooks/useFetch.ts

import { useState, useEffect } from "react";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for data fetching with loading, error states and refetch capability
 * @param fetchFunction Function that returns a promise with the data
 * @param initialData Initial data (optional)
 * @param dependencies Array of dependencies to trigger refetch
 * @returns Object with data, loading state, error state and refetch function
 */
export function useFetch<T>(
  fetchFunction: () => Promise<any>,
  initialData: T | null = null,
  dependencies: any[] = []
): FetchState<T> {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchFunction();
      setData(response.data.data || response.data);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
}

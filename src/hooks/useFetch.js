import { useState, useEffect } from "react";

export default function useFetch(fetchFunction, initialValue) {
  const [isFetching, setIsFetching] = useState();
  const [error, setError] = useState();
  const [data, setData] = useState(initialValue);

  useEffect(() => {
    async function fetchData() {
      setIsFetching(true);
      try {
        const places = await fetchFunction();
        setData(places);
      } catch (error) {
        setError({ message: error.message || "Failed to fetch data." });
      }

      setIsFetching(false);
    }

    fetchData();
  }, [fetchFunction]);

  return {
    isFetching,
    error,
    data,
    setData,
  };
}

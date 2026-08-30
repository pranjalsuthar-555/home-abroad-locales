import { useState, useEffect, useCallback } from 'react';

export function useDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch('/api/destinations')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        // API returns { destinations: [...] }
        setDestinations(data.destinations || data || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => { load(); }, [load]);

  // exposed so the error state can offer a retry instead of forcing a page refresh
  return { destinations, loading, error, retry: load };
}

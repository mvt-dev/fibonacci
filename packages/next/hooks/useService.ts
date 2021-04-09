import { useState, useEffect } from 'react';

const useService = (service: (...args: any[]) => Promise<any>, ...args: any[]) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    service(...args)
      .then(data => setData(data))
      .catch(error => setError(error))
      .finally(() => setLoading(false));
  }, []);

  return {
    data,
    loading,
    error,
  }
};

export default useService;

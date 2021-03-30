import React, { useState, useEffect } from 'react';

const useService = (service: null | Promise<any>) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (service) {
      service
        .then(data => setData(data))
        .catch(error => setError(error))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
  }
};

export default useService;

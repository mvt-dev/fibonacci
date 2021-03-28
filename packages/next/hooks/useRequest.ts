import useSWR from 'swr';
import request from '../libs/request';

const fetcher = (url: string) => request.get(url).then(res => res.data);

const useRequest = (url: string) => {
  const { data, error } = useSWR(url, fetcher);
  return {
    data,
    isLoading: !error && !data,
    isError: error
  }
};

export default useRequest;

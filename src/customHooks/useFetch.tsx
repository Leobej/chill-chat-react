import axios, { AxiosResponse, AxiosError } from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../constants/apiConstants";

interface FetchState<T> {
  responseData: T | null;
  error: AxiosError<any> | null;
  loading: boolean;
}

export const useFetch = (url: string): FetchState<any> => {
  const [responseData, setResponseData] = useState<any | null>(null);
  const [error, setError] = useState<AxiosError<any> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("send fetch request");
        setLoading(true);
        const response: AxiosResponse<any> = await axios.get(API_BASE_URL + url);
        setResponseData(response.data);
        console.log("Response Data ", response.data);
      } catch (err) {
        setError(err as AxiosError<any>);
        console.log("error", err); // Cast error to AxiosError type
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { responseData, error, loading };
};

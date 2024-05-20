import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../constants/apiConstants";

import { AxiosError } from "axios";

interface FetchState<T> {
  responseData: T | null;
  error: AxiosError<any> | null;
  loading: boolean;
}
export const useFetch = (url: string): FetchState<any> => {
  const [responseData, setResponseData] = useState<any | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        console.log("send fetch request");
        setLoading(true);
        const response: AxiosResponse<any> = await axios.get(API_BASE_URL + url);
        setResponseData(response.data);
        console.log("Response Data ", response.data);
      } catch (err) {
        setError(err as AxiosError<any>);
        console.log("error") // Cast error to AxiosError type
      } finally {

        setLoading(false);
      }
    })();
  }, [url]);

  return { responseData, error, loading };
};
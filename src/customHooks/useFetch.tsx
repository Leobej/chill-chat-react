import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../constants/apiConstants";

interface UseFetchResponse<T> {
  responseData: T | null;
  error: any;
  loading: boolean;
}
export const useFetch = (url: string): UseFetchResponse<any> => {
  const [responseData, setResponseData] = useState<any | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Sending fetch request");
        setLoading(true);
        const response: AxiosResponse<any> = await axios.get<any>(API_BASE_URL + url);
        setResponseData(response.data);
        console.log(response.data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function
    // return () => {
    //   // Any cleanup code goes here
    // };
  }, [url]);

  return { responseData, error, loading };
};
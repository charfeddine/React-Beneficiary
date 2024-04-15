import { useQuery } from "@tanstack/react-query";
import Axios from "axios";

export const useGetCat = () => {
  const {
    data: factInformation,
    isLoading: isCatLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["cat"],

    queryFn: async () => {
      const res = await Axios.get("https://catfact.ninja/fact?max_length=310");
      return await res.data;
    },
  });

  const refetchData = () => {
    refetch();
  };

  return { factInformation, isCatLoading, refetchData, error };
};

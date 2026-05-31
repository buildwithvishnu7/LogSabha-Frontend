import { useQuery } from "@tanstack/react-query";
import { getGlobalData } from "@/services";

export function useGlobalData() {
  return useQuery({
    queryKey: ["global"],
    queryFn: getGlobalData,
  });
}

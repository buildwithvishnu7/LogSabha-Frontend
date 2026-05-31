import { useQuery } from "@tanstack/react-query";
import { getHomeData } from "@/services";

export function useHomeData() {
  return useQuery({
    queryKey: ["home"],
    queryFn: getHomeData,
  });
}

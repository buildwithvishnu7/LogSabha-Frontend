import { useQuery } from "@tanstack/react-query";
import { getParties } from "@/services/api";

export function useParties() {
  return useQuery({
    queryKey: ["parties"],
    queryFn: getParties,
  });
}

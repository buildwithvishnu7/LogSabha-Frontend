import { useQuery } from "@tanstack/react-query";
import { getHinduForJustice } from "@/services/api";

export function useHinduForJustice() {
  return useQuery({
    queryKey: ["hindu-for-justice"],
    queryFn: getHinduForJustice,
  });
}

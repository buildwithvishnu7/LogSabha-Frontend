import { useQuery } from "@tanstack/react-query";
import { getEditorialInsights } from "@/services/api";

export function useEditorialInsights() {
  return useQuery({
    queryKey: ["editorial-insights"],
    queryFn: getEditorialInsights,
  });
}

import { useQuery } from "@tanstack/react-query";
import { getDataInsights } from "@/services/api";

export function useDataInsights() {
  return useQuery({ queryKey: ["data-insights"], queryFn: getDataInsights });
}

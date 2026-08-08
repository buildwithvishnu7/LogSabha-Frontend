import { useQuery } from "@tanstack/react-query";
import { getLiveCoverage } from "@/services/api";

export function useLiveCoverage() {
  return useQuery({ queryKey: ["live-coverage"], queryFn: getLiveCoverage });
}

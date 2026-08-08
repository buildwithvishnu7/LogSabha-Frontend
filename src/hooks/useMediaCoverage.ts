import { useQuery } from "@tanstack/react-query";
import { getMediaCoverage } from "@/services/api";

export function useMediaCoverage() {
  return useQuery({
    queryKey: ["media-coverage"],
    queryFn: getMediaCoverage,
  });
}

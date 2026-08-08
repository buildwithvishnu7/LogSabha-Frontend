import { useQuery } from "@tanstack/react-query";
import { getFounderEditorial } from "@/services/api";

export function useFounderEditorial() {
  return useQuery({
    queryKey: ["founder-editorial"],
    queryFn: getFounderEditorial,
  });
}

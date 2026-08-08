import { useQuery } from "@tanstack/react-query";
import { getCommunity } from "@/services/api";

export function useCommunity() {
  return useQuery({ queryKey: ["community"], queryFn: getCommunity });
}

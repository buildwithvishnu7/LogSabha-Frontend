import { useQuery } from "@tanstack/react-query";
import { getRss } from "@/services/api";

export function useRss() {
  return useQuery({ queryKey: ["rss"], queryFn: getRss });
}

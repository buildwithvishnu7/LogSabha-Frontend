import { useQuery } from "@tanstack/react-query";
import { getNewsTicker } from "@/services/api";

export function useNewsTicker() {
  return useQuery({ queryKey: ["news-ticker"], queryFn: getNewsTicker });
}

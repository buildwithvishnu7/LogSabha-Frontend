import { useQuery } from "@tanstack/react-query";
import { getSocialPresence } from "@/services/api";

export function useSocialPresence() {
  return useQuery({
    queryKey: ["social-presence"],
    queryFn: getSocialPresence,
  });
}

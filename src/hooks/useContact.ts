import { useQuery } from "@tanstack/react-query";
import { getContact } from "@/services/api";

export function useContact() {
  return useQuery({ queryKey: ["contact"], queryFn: getContact });
}

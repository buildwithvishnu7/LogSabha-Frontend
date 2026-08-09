import { useQuery } from "@tanstack/react-query";
import { getGlobalData } from "@/services";
import { globalData } from "@/data/global";

export function useGlobalData() {
  return useQuery({
    queryKey: ["global"],
    queryFn: getGlobalData,
    // Static-first: nav/badges render immediately from bundled data (also
    // server-rendered); API data replaces it when it arrives.
    placeholderData: globalData,
  });
}

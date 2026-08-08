import { useQuery } from "@tanstack/react-query";
import { getLogSabhaStory } from "@/services/api";

export function useLogSabhaStory() {
  return useQuery({
    queryKey: ["logsabha-story"],
    queryFn: getLogSabhaStory,
  });
}

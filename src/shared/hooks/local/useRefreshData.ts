import { useQueryClient } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";

export const useInvalidateQueries = () => {
  const queryClient = useQueryClient();

  const invalidate = (keys: QueryKey[]) => {
    keys.forEach((key) => {
      queryClient.invalidateQueries({ queryKey: key });
    });
  };

  return { invalidate };
};

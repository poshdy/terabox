import { useTRPC } from "@/utils/trpc/root";

export const queryKeys = (trpc: ReturnType<typeof useTRPC>) => {
  return {
    files: trpc.files.list.queryKey(),
  };
};

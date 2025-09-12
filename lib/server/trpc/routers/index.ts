import { router } from "../trpc";
import { files } from "./files.router";

export const appRouter = router({
  files,
});

export type AppRouter = typeof appRouter;

import { auth } from "@clerk/nextjs/server";
import { initTRPC, TRPCError } from "@trpc/server";
import { db } from "../db";
import superjson from "superjson";
import { ZodError, treeifyError } from "zod";

export const createContext = async (opts: { headers: Headers }) => {
  const user = await auth();

  return {
    user,
    db,
    ...opts,
  };
};
const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,

  // LEARN MORE ABOUT ERROR HANDLING FOR TRPC
  errorFormatter({ error, shape }) {
    if (error instanceof ZodError) {
      return {
        ...shape,
        data: {
          ...shape.data,
          zodError: treeifyError(error),
        },
      };
    }
  },
});

export const router = t.router;

const requestTiming = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  const result = await next();

  const end = Date.now();

  const duration = end - start;
  console.log(`[TRPC] ${path} took ${duration}ms`);
  return result;
});

const isAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ message: "UNAUTHORIZED", code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});
export const publicProcedure = t.procedure.use(requestTiming);
export const protectedProcedure = t.procedure.use(requestTiming).use(isAuthed);

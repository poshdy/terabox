import z, { file } from "zod";
import { protectedProcedure, router } from "../trpc";
import { filesService } from "../../services/file.service";
import { TRPCError } from "@trpc/server";

const folderSchema = z.object({
  name: z.string({ message: "name is required" }),
  description: z.string().optional(),
  parentId: z.string().nullish(),
});
export const fileSchema = z.object({
  name: z.string({ message: "name is required" }),
  folderId: z.string().nullish(),
  type: z.string(),
  size: z.coerce.number(),
  id: z.cuid(),
});
export type FileInput = z.infer<typeof fileSchema>;

export const files = router({
  listFolderTree: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx.user;

    if (!userId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return await filesService.listFoldersTree({ userId });
  }),
  updateFile: protectedProcedure
    .input(fileSchema.pick({ name: true, id: true }))
    .mutation(async ({ input, ctx }) => {
      const { userId } = ctx.user;

      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      const { id, name } = input;

      return filesService.updateFile({ id, name, userId });
    }),
  createFolder: protectedProcedure
    .input(folderSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        user: { userId },
      } = ctx;

      if (!userId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User id is missing",
        });
      }
      return await filesService.createFolder({ userId, input: { ...input } });
    }),
  updateFolder: protectedProcedure
    .input(folderSchema.partial().extend({ id: z.cuid() }))
    .mutation(async ({ input }) => {
      if (!input.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Folder id is missing",
        });
      }
      return await filesService.updateFolder({ input: { ...input } });
    }),
  list: protectedProcedure.query(
    async ({
      input,
      ctx: {
        user: { userId },
      },
    }) => {
      if (!userId)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "NO USER ID FOUND",
        });
      return await filesService.list({ userId });
    }
  ),

  getFile: protectedProcedure
    .input(z.object({ fileId: z.cuid() }))
    .query(async ({ ctx, input }) => {
      const {
        user: { userId },
      } = ctx;

      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const { fileId } = input;

      return filesService.getFile({ fileId, userId });
    }),
  generateSignedUrl: protectedProcedure
    .input(
      z.object({
        fileId: z.cuid(),
        expiration: z.enum(["1_day", "1_week", "1_month"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const {
        user: { userId },
      } = ctx;

      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const { fileId, expiration } = input;

      return filesService.generateSignedUrl({ fileId, userId, expiration });
    }),

  insertFile: protectedProcedure
    .input(fileSchema)
    .mutation(async ({ input, ctx }) => {
      const {
        user: { userId },
      } = ctx;

      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return await filesService.insertFile({ userId, input });
    }),
});

import { File, Folder, Prisma } from "@/lib/generated/prisma";
import { db } from "../db";
import { FileInput } from "../trpc/routers/files.router";
import { TRPCError } from "@trpc/server";
import { supabaseService } from "./supabase.service";

export type FolderWithSubFolders = Omit<Folder, "subFolders"> & {
  subFolders: FolderWithSubFolders[];
};
type CreateFolderInput = {
  name: string;
  description?: string;
  parentId?: string | null;
};

export type Item = {
  type: "file" | "folder";
  data: File | Folder;
};

class FileService {
  async createFolder({
    input: { name, description, parentId },
    userId,
  }: {
    input: CreateFolderInput;
    userId: string;
  }) {
    try {
      return await db.folder.create({
        data: {
          name,
          description,
          userId,
          parentId: parentId || null,
        },
      });
    } catch (error) {
      console.error({ error });
    }
  }

  async updateFile({
    userId,
    id,
    name,
  }: {
    userId: string;
    id: string;
    name: string;
  }) {
    return db.file.update({
      where: {
        id,
        userId,
      },
      data: {
        name,
      },
    });
  }

  async listFoldersTree({ userId }: { userId: string }) {
    const folders = await db.folder.findMany({
      where: {
        userId,
        parentId: null,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        subFolders: true,
      },
    });

    const folderIds = folders.map((folder) => folder.id);
    const foldersWithSubFolders = await this.getSubFolders({
      folderIds,
    });

    return { folders: foldersWithSubFolders };
  }

  private async getSubFolders({
    folderIds,
  }: {
    folderIds: string[];
  }): Promise<FolderWithSubFolders[]> {
    if (folderIds.length === 0) {
      return [];
    }
    const folders = await db.folder.findMany({
      where: { id: { in: folderIds } },
      include: { subFolders: true },
    });

    return await Promise.all(
      folders.map(async (folder) => {
        const ids = folder.subFolders.map((sb) => sb.id);
        const subfolders = await this.getSubFolders({ folderIds: ids });

        const { subFolders, ...rest } = folder;

        const data = {
          subFolders: subfolders,
          ...rest,
        };
        return data;
      })
    );
  }
  async updateFolder({
    input: { description, name, parentId, id },
  }: {
    input: Partial<CreateFolderInput> & { id: string };
  }) {
    try {
      return await db.folder.update({
        where: {
          id,
        },
        data: {
          parentId,
          name,
          description,
        },
      });
    } catch (error) {
      console.log({ error });
    }
  }

  async restore(fileId: string) {
    return await db.file.update({
      where: { id: fileId },
      data: { deletedAt: null },
    });
  }

  async list({
    userId,
    folderId,
    resource,
  }: {
    userId: string;
    folderId?: string | null;
    resource?: "deleted" | "starred" | "all" | null;
  }) {
    const filesWhere: Prisma.FileWhereInput = {
      userId,
      deletedAt: null,
    };
    const foldersWhere: Prisma.FolderWhereInput = {
      parentId: folderId,
      userId,
    };


    if (folderId) {
      filesWhere.folderId = folderId;
    }
    if (resource == "all") {
      filesWhere.folderId = folderId;
    }

    if (resource && resource == "deleted") {
      filesWhere.deletedAt = {
        not: null,
      };
    }

    if (resource == "starred") {
      filesWhere.starred = true;
      foldersWhere.starred = true;
    }
    const [folders, files] = await Promise.all([
      db.folder.findMany({
        where: {
          ...foldersWhere,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      db.file.findMany({
        where: {
          ...filesWhere,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    const items: Item[] = [];
    for (const file of files) {
      items.push({
        data: file,
        type: "file",
      });
    }
    if (!resource || resource !== "deleted") {
      for (const folder of folders) {
        items.push({
          data: folder,
          type: "folder",
        });
      }
    }

    const sortedItems = items.toSorted((a, b) => {
      return b.data.createdAt.getTime() - a.data.createdAt.getTime();
    });

    return sortedItems;
  }

  private async getFileOrThrow({
    fileId,
    userId,
  }: {
    userId: string;
    fileId: string;
  }) {
    const file = await db.file.findUnique({
      where: {
        id: fileId,
        userId,
      },
    });

    if (!file) throw new TRPCError({ code: "NOT_FOUND" });

    return file;
  }

  async generateSignedUrl({
    userId,
    expiration,
    fileId,
  }: {
    fileId: string;
    userId: string;
    expiration: "1_day" | "1_week" | "1_month";
  }) {
    const file = await this.getFileOrThrow({ fileId, userId });

    const SECONDS_IN_DAY = 24 * 60 * 60;
    let expirationInSecondary: number;
    switch (expiration) {
      case "1_day":
        expirationInSecondary = SECONDS_IN_DAY;
        break;
      case "1_week":
        expirationInSecondary = 7 * SECONDS_IN_DAY;
        break;
      case "1_month":
        expirationInSecondary = 30 * SECONDS_IN_DAY;
        break;
    }
    const objectPath = file.key;
    const url = await supabaseService.getSignedUrl(
      objectPath,
      expirationInSecondary
    );

    return url;
  }
  async getFile({ fileId, userId }: { fileId: string; userId: string }) {
    const file = await db.file.findUnique({
      where: {
        id: fileId,
        userId,
      },
    });

    if (!file) throw new TRPCError({ code: "NOT_FOUND" });

    const objectPath = `${file.key}`;
    const FIVE_MINUTES = 5 * 60;

    const url = await supabaseService.getSignedUrl(objectPath, FIVE_MINUTES);
    const result = {
      ...file,
      url,
    };

    return result;
  }
  async insertFile({ input, userId }: { userId: string; input: FileInput }) {
    const { id, name, size, type, folderId } = input;

    const key = `${userId}/${id}`;
    return await db.file.create({
      data: {
        key,
        userId,
        size,
        type,
        folderId,
        name,
      },
    });
  }

  async move({
    target,
    fileId,
    folderId,
  }: {
    target: string;
    fileId: string | null;
    folderId: string | null;
  }) {
    function isTheSameParent(id: string | null) {
      return id === target;
    }
    if (fileId) {
      const file = await db.file.findUnique({ where: { id: fileId } });

      if (!file) {
        throw new TRPCError({ code: "NOT_FOUND", message: "file not found" });
      }
      const isSameParent = isTheSameParent(file.folderId);

      if (isSameParent) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "you are trying to move the file to the same location",
        });
      }

      await db.file.update({
        where: {
          id: fileId,
        },
        data: {
          folderId: target,
        },
      });
    }
    if (folderId) {
      const folder = await db.folder.findUnique({ where: { id: folderId } });

      if (!folder) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }
      const isSameParent = isTheSameParent(folder.parentId);

      if (isSameParent) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "you are trying to move the file to the same location",
        });
      }

      await db.folder.update({
        where: {
          id: folderId,
        },
        data: {
          parentId: target,
        },
      });
    }
  }

  async starFile({
    fileId,
    folderId,
    action,
  }: {
    action: boolean;
    folderId?: string | null;
    fileId?: string | null;
  }) {
    if (fileId) {
      await db.file.update({
        where: {
          id: fileId,
        },
        data: {
          starred: action,
        },
      });
    }

    if (folderId) {
      await db.folder.update({
        data: {
          starred: action,
        },
        where: { id: folderId },
      });
    }
  }

  async delete({
    fileId,
    folderId,
    isPermenant,
  }: {
    fileId: string | null;
    folderId: string | null;
    isPermenant: boolean;
  }) {
    if (fileId) {
      if (isPermenant) {
        const file = await db.file.findUnique({ where: { id: fileId } });
        if (!file) throw new TRPCError({ code: "NOT_FOUND" });
        return await Promise.all([
          db.file.delete({
            where: {
              id: fileId,
            },
          }),

          supabaseService.deleteObject(file.key),
        ]);
      }
      await db.file.update({
        where: {
          id: fileId,
        },
        data: {
          deletedAt: new Date(),
          starred: false,
        },
      });
    }

    if (folderId) {
      if (isPermenant) {
        await db.$transaction(async (tx) => {
          const folder = await tx.folder.findUnique({
            where: { id: folderId },
          });
          if (!folder)
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Folder not found",
            });
          await this.deleteFolder(folderId, tx);
        });
      }
    }
  }
  async deleteFolder(folderId: string, tx: Prisma.TransactionClient) {
    try {
      const subFolders = await tx.folder.findMany({
        where: { parentId: folderId },
        select: { id: true },
      });

      for (const sb of subFolders) {
        await this.deleteFolder(sb.id, tx);
      }

      await tx.file.updateMany({
        where: {
          folderId,
          deletedAt: null,
        },
        data: {
          deletedAt: new Date(),
          starred: false,
        },
      });

      await tx.folder.delete({ where: { id: folderId } });
    } catch (err) {
      console.error({ err });
    }
  }

  private async isSubFolder() {}
}

export const filesService = new FileService();

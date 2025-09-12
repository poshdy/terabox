import { File, Folder } from "@/lib/generated/prisma";
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

  async list({ userId }: { userId: string }) {
    const [folders, files] = await Promise.all([
      db.folder.findMany({
        where: {
          userId,
          parentId: null,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      db.file.findMany({
        where: {
          folderId: null,
          userId,
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
    for (const folder of folders) {
      items.push({
        data: folder,
        type: "folder",
      });
    }

    const sortedItems = items.toSorted((a, b) => {
      return b.data.updatedAt.getTime() - a.data.updatedAt.getTime();
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
  async deleteFolder(folderId: string) {
    try {
      /* get the target folder
        check if it has children
        if yes
         loop over each child and check if it has children

 
 */
    } catch (err) {
      console.error({ err });
    }
  }

  private async isSubFolder() {}
}

export const filesService = new FileService();

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { File, Folder } from "@/lib/generated/prisma";
import { timeDistance } from "@/lib/dayjs";
import { FilesActions } from "../files-actions";
import { type Item } from "@/lib/server/services/file.service";
import { fileType, fileTypeIcon } from "@/lib/files";

const renderNameColumn = (type: "file" | "folder", data: File | Folder) => {
  if (type == "folder") {
    return <span>{fileTypeIcon()}</span>;
  } else {
    const file = data as File;
    return <span>{fileTypeIcon(file.type)}</span>;
  }
};

export const columns: ColumnDef<Item>[] = [
  {
    accessorKey: "data.name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          {renderNameColumn(row.original.type, row.original.data)}
          <span>{row.original.data.name}</span>
        </div>
      );
    },
  },

  {
    header: "Type",
    cell: ({ row }) => {
      const resourceType = row.original.type;

      if (resourceType == "folder") {
        return <span>-</span>;
      } else {
        const file = row.original.data as File;
        return <span>{fileType(file.type)}</span>;
      }
    },
  },

  {
    accessorKey: "updatedAt",
    header: "Last Modifies",
    cell: ({ row }) => {
      const createdAt = row.original.data?.createdAt;

      return timeDistance(createdAt);
    },
  },

  {
    header: "Actions",
    accessorKey: "actions",
    cell({ row }) {
      const item = row.original;
      return <FilesActions item={item} />;
    },
  },
];

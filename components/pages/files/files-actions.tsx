import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFilesContext } from "@/hooks/use-files-context";
import { queryKeys } from "@/lib/query-keys";
import { Item } from "@/lib/server/services/file.service";
import {
  IconRestore,
  IconStar,
  IconStarFilled,
  IconTrash,
} from "@tabler/icons-react";

import { useTRPC } from "@/utils/trpc/root";

import {
  IconArrowsMove,
  IconDotsVertical,
  IconEdit,
} from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Resource } from "./file-list";

export const FilesActions = ({ item }: { item: Item }) => {
  const params = useSearchParams();
  const resource = params.get("resource") as Resource;
  const trpc = useTRPC();
  const { files } = queryKeys(trpc);
  const { mutateAsync: handleStar } = useMutation(
    trpc.files.markStarred.mutationOptions({
      meta: {
        invalidateQueries: files,
        successMessage: `${item.type == "folder" ? "Folder" : "File"} ${
          item.data.starred == true ? "un-starred" : "starred"
        } successfully`,
        errorMessage: `Failed to  ${
          item.data.starred == true ? "un-star" : "star"
        }`,
      },
    })
  );
  const { mutateAsync: restore } = useMutation(
    trpc.files.restore.mutationOptions({
      meta: {
        invalidateQueries: files,
        successMessage: `${
          item.type == "folder" ? "Folder" : "File"
        } restored successfully`,
        errorMessage: `Failed to restore file`,
      },
    })
  );

  const { openModal, setEditItem, onSetItem } = useFilesContext();

  const handleUpdate = () => {
    setEditItem(item);
    openModal("createUpdate");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconDotsVertical size={20} className="cursor-pointer" />
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleUpdate();
          }}
        >
          <IconEdit />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={async (e) => {
            e.stopPropagation();
            const fileId = item.type == "file" ? item.data.id : null;
            const folderId = item.type == "folder" ? item.data.id : null;
            await handleStar({ action: !item.data.starred, fileId, folderId });
          }}
        >
          {item.data.starred ? <IconStarFilled /> : <IconStar />}
          {item.data.starred ? "Un-star" : "Star"}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onSetItem(item);
            openModal("move");
          }}
        >
          <IconArrowsMove />
          Move
        </DropdownMenuItem>

        {item.type == "file" && resource == "deleted" && (
          <DropdownMenuItem
            onClick={async (e) => {
              e.stopPropagation();

              if (item) {
                await restore({ fileId: item.data.id });
              }
            }}
          >
            <IconRestore />
            Restore
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onSetItem(item);
            openModal("delete");
          }}
        >
          <IconTrash />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

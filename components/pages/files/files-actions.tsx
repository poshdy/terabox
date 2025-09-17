import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFilesContext } from "@/hooks/use-files-context";
import { queryKeys } from "@/lib/query-keys";
import { Item } from "@/lib/server/services/file.service";
import { IconStar, IconStarFilled } from "@tabler/icons-react";

import { useTRPC } from "@/utils/trpc/root";

import {
  IconArrowsMove,
  IconDotsVertical,
  IconEdit,
} from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";

export const FilesActions = ({ item }: { item: Item }) => {
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
  const { openModal, setEditItem, onSetItem } = useFilesContext();

  const handleUpdate = () => {
    setEditItem(item);
    openModal("createUpdate");
  };

  const handleDelete = () => {
    try {
    } catch (error) {}
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

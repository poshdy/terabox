import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFilesContext } from "@/hooks/use-files-context";
import { Item } from "@/lib/server/services/file.service";

import {
  IconArrowsMove,
  IconDotsVertical,
  IconEdit,
} from "@tabler/icons-react";

export const FilesActions = ({ item }: { item: Item }) => {
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

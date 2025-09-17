import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useFilesContext } from "@/hooks/use-files-context";
import { queryKeys } from "@/lib/query-keys";
import { Item } from "@/lib/server/services/file.service";
import { useTRPC } from "@/utils/trpc/root";
import { useMutation } from "@tanstack/react-query";

type DeleteModalProps = {
  isPermenant: boolean;
  open: boolean;

  onClose: () => void;
};
export function DeleteModal({
  isPermenant,

  open,
  onClose,
}: DeleteModalProps) {
  const { item } = useFilesContext();
  const trpc = useTRPC();
  const { files } = queryKeys(trpc);
  const { mutateAsync: deleteAction } = useMutation(
    trpc.files.delete.mutationOptions({
      meta: {
        invalidateQueries: files,
        successMessage: `${
          item?.type == "folder" ? "Folder" : "File"
        } deleted successfully`,
        errorMessage: `Failed to delete ${
          item?.data.starred == true ? "un-star" : "star"
        }`,
      },
    })
  );

  const content = {
    title: "Are you absolutely sure?",
    description: isPermenant
      ? `This action cannot be undone. This will permanently delete ${item?.data.name} and remove it data from our servers.`
      : `are you sure?. This will move ${item?.data.name} to trash you can restore it later.`,
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogTrigger>Open</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{content.title}</AlertDialogTitle>
          <AlertDialogDescription>{content.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              const fileId = item?.type == "file" ? item.data.id : null;
              const folderId = item?.type == "folder" ? item.data.id : null;
              await deleteAction({ fileId, folderId, isPermenant });
            }}
          >
            {isPermenant ? "Delete for ever" : "Move to trash"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

import { FolderInput } from "@/components/pages/files/create-update-modal";
import { queryKeys } from "@/lib/query-keys";
import { Item } from "@/lib/server/services/file.service";
import { useTRPC } from "@/utils/trpc/root";
import { useMutation } from "@tanstack/react-query";

type Props = {
  resourceType: "file" | "folder";
  actionType: "create" | "edit";
  editItem?: Item | null;
};
export function useMutateFileFolder({
  actionType,
  resourceType,
  editItem,
}: Props) {
  const trpc = useTRPC();
  const { files } = queryKeys(trpc);
  const { mutateAsync: createFolder, isPending } = useMutation(
    trpc.files.createFolder.mutationOptions({
      meta: {
        invalidateQueries: files,
        successMessage: "Folder created successfully!",
        errorMessage: "Failed to create folder",
      },
    })
  );
  const { mutateAsync: updateFile, isPending: isFileUpdating } = useMutation(
    trpc.files.updateFile.mutationOptions({
      meta: {
        invalidateQueries: files,
        successMessage: "File updated successfully!",
        errorMessage: "Failed to update file",
      },
    })
  );
  const { mutateAsync: updateFolder, isPending: isFolderUpdating } =
    useMutation(
      trpc.files.updateFolder.mutationOptions({
        meta: {
          invalidateQueries: files,
          successMessage: "Folder updated successfully!",
          errorMessage: "Failed to update folder",
        },
      })
    );

  const handleSubmit = async (values: FolderInput) => {
    const { title, description } = values;
    try {
      if (actionType == "create") {
        await createFolder({
          name: title,
          description: description ? description : undefined,
        });
      } else if (actionType == "edit" && resourceType == "folder") {
        await updateFolder({
          id: editItem?.data.id as string,
          name: title,
          description: description ? description : undefined,
        });
      } else {
        await updateFile({ id: editItem?.data.id as string, name: title });
      }
    } catch (error) {
      console.error({ error });
    }
  };

  return {
    mutate: handleSubmit,
    isLoading: isFileUpdating || isFolderUpdating || isPending,
  };
}

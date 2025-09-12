import { QueryClient, useMutation } from "@tanstack/react-query";
import { useFilesContext } from "./use-files-context";
import { AppFile, UploadStatus } from "./use-upload";
import { useTRPC, useTRPCClient } from "@/utils/trpc/root";

export const useUploadWrapper = () => {
  const queryClient = new QueryClient();
  const trpc = useTRPC();

  const { mutateAsync: insertFile } = useMutation(
    trpc.files.insertFile.mutationOptions({})
  );
  const { files, setFiles } = useFilesContext();

  const onProgress = (file: AppFile, progress: string) => {
    setFiles((prev) => {
      const index = prev.findIndex((f) => f.id == file.id);

      if (index == -1) {
        return [...prev, file];
      }
      const newFiles = [...prev];
      newFiles[index] = Object.assign(file, { progress });

      return newFiles;
    });
  };

  const onSuccess = async (file: AppFile) => {
    console.log("file is uploaded successfully!", file);
    setFiles((prev) => {
      const files = [...prev];
      const index = files.findIndex((f) => f.id == file.id);

      if (index == -1) {
        return [...prev, file];
      }

      files[index] = Object.assign(file, {
        status: "completed" as UploadStatus,
      });

      return files;
    });
    await insertFile(
      {
        id: file.id as string,
        name: file.name,
        size: file.size,
        type: file.type,
      },
      {
        onSuccess() {
          console.log("file uploaded successfully ");
          queryClient.invalidateQueries({ queryKey: trpc.files.pathKey() });
        },
        onError(error) {
          console.error({ error });
        },
      }
    );
  };

  const onError = (file: AppFile, error: Error) => {
    setFiles((prev) => {
      const index = prev.findIndex((f) => f.id == file.id);

      if (index == -1) {
        return [...prev, file];
      }
      const newFiles = [...prev];
      newFiles[index] = Object.assign(file, { status: "failed" });

      return newFiles;
    });
  };

  return {
    onError,
    onProgress,
    onSuccess,
  };
};

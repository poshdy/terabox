"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import cuid from "cuid";
import { useFilesContext } from "@/hooks/use-files-context";
import { AppFile, UploadStatus, useUpload } from "@/hooks/use-upload";
import { ChangeEvent, useRef } from "react";
import { useUploadWrapper } from "@/hooks/use-upload-wrapper";
export const PageHeader = () => {
  const { openModal } = useFilesContext();
  return (
    <div className="w-full flex items-center justify-between  py-2">
      <h3 className="text-3xl font-semibold leading-tight tracking-tighter">
        Files
      </h3>

      <FileCreationDropdown
        onClick={() => {
          openModal("createUpdate");
        }}
      />
    </div>
  );
};

export const FileCreationDropdown = ({ onClick }: { onClick: () => void }) => {
  const { setFiles } = useFilesContext();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { onError, onProgress, onSuccess } = useUploadWrapper();
  const { upload } = useUpload({
    onSuccess: async (file) => {
      console.log("file is uploaded successfully!", file);
      onSuccess(file);
    },
    onError(file, error) {
      onError(file, error);
    },
    onProgress(file, progress: string) {
      onProgress(file, progress);
    },
  });
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    console.log({ e });
    const file = e.target.files?.item(0);

    if (!file) {
      console.log("no file found");
      return;
    }
    console.log({ file });
    const newFile: AppFile = Object.assign(file, {
      progress: "",
      status: "uploading" as UploadStatus,
      id: cuid(),
    });

    console.log({ newFile });
    setFiles([newFile]);

    upload({
      file: newFile,
      fileMetadata: { fileName: file.name, fileType: file.type },
    });
  };
  return (
    <>
      <input
        onChange={handleInputChange}
        type="file"
        className="hidden"
        ref={inputRef}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="cursor-pointer">New</Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={(e) => {
              inputRef.current?.click();
            }}
          >
            Upload Files
          </DropdownMenuItem>
          <DropdownMenuItem>Upload Folders</DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            Create Folder
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

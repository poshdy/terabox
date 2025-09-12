"use client";

import { UploadStatus, useUpload } from "@/hooks/use-upload";
import { useUploadWrapper } from "@/hooks/use-upload-wrapper";
import { cn } from "@/lib/utils";
import cuid from "cuid";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export const Dropzone = ({ children }: { children: React.ReactNode }) => {
  const { onError, onProgress, onSuccess } = useUploadWrapper();
  const { upload } = useUpload({
    onSuccess: async (file) => {
      console.log("file is uploaded successfully!", file);
      onSuccess(file);
    },
    onError(file, error) {
      console.error("Upload error:", error);
      onError(file, error);
    },
    onProgress(file, progress: string) {
      onProgress(file, progress);
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      console.log({ acceptedFiles });
      for (const file of acceptedFiles) {
        const newFile = Object.assign(file, {
          id: cuid(),
          status: "uploading" as UploadStatus,
          progress: "",
        });
        upload({
          file: newFile,
          fileMetadata: { fileName: file.name, fileType: file.type },
        });
      }
    },
    [upload]
  );

  const { isDragActive, getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
  });
  return (
    <div
      {...getRootProps({
        className: cn(`w-full h-full ${isDragActive && "bg-secondary/60"}`),
      })}
    >
      {children}
      <input {...getInputProps()} />
    </div>
  );
};

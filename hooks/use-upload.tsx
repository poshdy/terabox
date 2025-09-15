import { useAuth } from "@clerk/clerk-react";

import * as tus from "tus-js-client";

export type UploadStatus = "uploading" | "failed" | "completed" | "cancelled";

export interface AppFile extends File {
  id?: string;
  progress?: string;
  status?: UploadStatus;
}

type UploadProps = {
  file: AppFile;
  fileMetadata: {
    fileType: string;
    fileName: string;
  };
};
type useUploadProps = {
  onProgress?: (file: AppFile, progress: string) => void;
  onError?: (file: AppFile, error: Error) => void;
  onSuccess?: (file: AppFile) => void;
};

export const useUpload = ({
  onError,
  onProgress,
  onSuccess,
}: useUploadProps) => {
  const { userId } = useAuth();

  const upload = ({ file }: UploadProps) => {
    const tusObj = new tus.Upload(file, {
      endpoint: process.env.NEXT_PUBLIC_UPLOAD_ENDPOINT!,

      headers: {
        authorization: `Bearer ${process.env
          .NEXT_PUBLIC_SUPABASE_SERVICE_KEY!}`,
      },
      metadata: {
        bucketName: process.env.NEXT_PUBLIC_BUCKET!,
        objectName: `${userId}/${file.id}`,
        contentType: file.type,
      },

      onError(error) {
        onError?.(file, error);
      },
      onProgress(bytesSent, bytesTotal) {
        const progress = ((bytesSent / bytesTotal) * 100).toFixed(2);

        onProgress?.(file, progress);
      },
      onSuccess() {
        onSuccess?.(file);
      },
    });

    tusObj.start();
  };

  return { upload };
};

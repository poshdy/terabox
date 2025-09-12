"use client";

import { useFilesContext } from "@/hooks/use-files-context";
import { Progress } from "@/components/ui/progress";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { fileTypeIcon } from "@/lib/files";
import { filesize } from "filesize";
export const UploadProgress = () => {
  const { files } = useFilesContext();

  useEffect(() => {
    console.log({ allFiles: files });
  }, [files]);

  return (
    <div
      className={`px-4 py-3 space-y-2 w-[400px] absolute bottom-2 right-0 min-h-[300px] h-[300px]  rounded-lg bg-secondary ${
        files?.length == 0 && "hidden"
      }`}
    >
      <div>
        <h2>Upload Progress</h2>
      </div>
      <div className="w-full flex flex-col gap-2">
        {files.map((file) => (
          <div className="space-y-3" key={file.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="">{fileTypeIcon(file.type, 16)}</span>
                  <span className="text-sm truncate w-[150px]">{file.name}</span>
                </div>
                <Badge
                  variant={"outline"}
                  className="text-xs text-muted-foreground"
                >
                  {filesize(file.size)}
                </Badge>
              </div>
              <Badge className="text-xs font-semibold rounded-md">
                {file.status}
              </Badge>
            </div>

            <div className="w-full flex items-center gap-2">
              <Progress
                className="rounded-none h-1"
                value={file.progress ? Number(file.progress) : 0}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

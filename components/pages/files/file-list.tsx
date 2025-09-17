"use client";
import { useTRPC } from "@/utils/trpc/root";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React from "react";
import { CreateUpdateModal } from "./create-update-modal";
import { useFilesContext } from "@/hooks/use-files-context";
import { DataTable } from "./table/table";
import { columns } from "./table/columns";
import { FilePreviewer } from "./previewr.drawer";
import { MoveModal } from "./move-modal";
import { DeleteModal } from "./alert-modal";
import { useSearchParams } from "next/navigation";

export type Resource = "deleted" | "starred" | "all" | null;
const FilesList = () => {
  const params = useSearchParams();
  const resource = params.get("resource") as Resource;
  const { closeModal, modal, currentFolder } = useFilesContext();
  const trpc = useTRPC();
  const { data, isPending } = useQuery(
    trpc.files.list.queryOptions(
      {
        folderId: currentFolder ?? null,
        resource: params.get("resource") as Resource,
      },
      {
        staleTime: 2 * 60 * 1000,
      }
    )
  );

  if (isPending) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {data && <DataTable columns={columns} data={data} />}

      {modal?.type == "createUpdate" && (
        <CreateUpdateModal
          open={modal.isOpen}
          onClose={() => closeModal("createUpdate")}
        />
      )}

      {modal?.type == "move" && (
        <MoveModal open={modal.isOpen} onClose={() => closeModal("move")} />
      )}

      {modal?.type == "viewer" && modal.isOpen && (
        <FilePreviewer
          open={modal.isOpen}
          onClose={() => closeModal("viewer")}
        />
      )}
      {modal?.type == "delete" && modal.isOpen && (
        <DeleteModal
          isPermenant={resource == "deleted"}
          open={modal.isOpen}
          onClose={() => closeModal("viewer")}
        />
      )}
    </div>
  );
};

export default FilesList;

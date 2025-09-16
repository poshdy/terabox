import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFilesContext } from "@/hooks/use-files-context";
import { queryKeys } from "@/lib/query-keys";
import { FolderWithSubFolders } from "@/lib/server/services/file.service";
import { useTRPC } from "@/utils/trpc/root";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Tree, SimpleTreeData, NodeRendererProps } from "react-arborist";
type MoveModalProps = {
  open: boolean;
  onClose: () => void;
};

export const MoveModal = ({ onClose, open }: MoveModalProps) => {
  const trpc = useTRPC();
  const { files } = queryKeys(trpc);
  const [target, setTarget] = useState<string | null>(null);
  const { data, isPending } = useQuery(
    trpc.files.listFolderTree.queryOptions(undefined, { enabled: open == true })
  );
  const { mutateAsync: move, isPending: isMutationPending } = useMutation(
    trpc.files.move.mutationOptions({
      meta: {
        invalidateQueries: files,
        successMessage: "File moved successfully",
        errorMessage: "Failed to move file",
      },
    })
  );

  const { item } = useFilesContext();

  const folders = data?.folders;

  const buildTree = (folders: FolderWithSubFolders[]): SimpleTreeData[] => {
    const nodes: SimpleTreeData[] = [];

    if (!data) return [];

    for (const folder of folders) {
      const name = folder.name;
      const id = folder.id;

      const node: SimpleTreeData = {
        name,
        id,
      };

      if (folder.subFolders?.length > 0) {
        node.children = buildTree(folder.subFolders);
      }

      nodes.push(node);
    }

    return nodes;
  };

  const initalData = useMemo(() => {
    return buildTree(folders as FolderWithSubFolders[]);
  }, [folders]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Move Modal</DialogTitle>
        </DialogHeader>

        {isPending ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <Tree
            onSelect={(node) => {
              const tagetNode = node[0];
              const folderId = tagetNode?.id;

              if (folderId) {
                setTarget(folderId);
              }
            }}
            initialData={initalData}
          >
            {Node}
          </Tree>
        )}

        <DialogFooter>
          <Button variant={"secondary"}>cancel</Button>
          <Button
            onClick={async () => {
              const fileId = item?.type == "file" ? item.data.id : null;
              const folderId = item?.type == "folder" ? item.data.id : null;
              if (target) {
                await move({
                  fileId,
                  target: target,
                  folderId,
                });
              }
            }}
            disabled={!target || !item || isMutationPending}
          >
            {isMutationPending && <Loader2 className="animate-spin" />} move
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

function Node({ node, style, dragHandle }: NodeRendererProps<SimpleTreeData>) {
  /* This node instance can do many things. See the API reference. */
  return (
    <div style={style} ref={dragHandle}>
      {node.isOpen ? "📂" : "📁"}

      {node.data.name}
    </div>
  );
}

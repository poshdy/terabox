import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FolderWithSubFolders } from "@/lib/server/services/file.service";
import { useTRPC } from "@/utils/trpc/root";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import { Tree, SimpleTreeData } from "react-arborist";
type MoveModalProps = {
  open: boolean;
  onClose: () => void;
};

export const MoveModal = ({ onClose, open }: MoveModalProps) => {
  const trpc = useTRPC();
  const { data, isPending } = useQuery(
    trpc.files.listFolderTree.queryOptions(undefined, { enabled: open == true })
  );

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

      console.log({ node });

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
          <Tree initialData={initalData} />
        )}
      </DialogContent>
    </Dialog>
  );
};

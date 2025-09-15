import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useFilesContext } from "@/hooks/use-files-context";
import { useTRPC } from "@/utils/trpc/root";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";
import "./file-viewer.css";
import { filesize } from "filesize";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { IconCopy, IconDownload } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type FilePreviewerProps = {
  open: boolean;
  onClose: () => void;
};

export const FilePreviewer = ({ onClose, open }: FilePreviewerProps) => {
  const { fileId } = useFilesContext();

  const trpc = useTRPC();
  const { data, isPending } = useQuery(
    trpc.files.getFile.queryOptions(
      { fileId: fileId as string },
      { enabled: !!fileId }
    )
  );

  const handleDownload = async () => {
    if (data) {
      const signedUrl = data.url as string;
      const response = await fetch(signedUrl);
      const blob = await response.blob();

      const url = URL.createObjectURL(blob);

      const a = window.document.createElement("a");

      a.href = url;
      a.download = data.name;
      document.body.appendChild(a);

      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(url);
    }
  };
  /*
   add doc viewer component // 
   see how to interact with supabase sdk to get a signed url to use it in preview
   display created on & last modified dates //
  */

  return (
    <Sheet onOpenChange={onClose} open={open}>
      <SheetContent className="min-w-[600px] p-4 overflow-y-scroll">
        {isPending ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <>
            {data && (
              <div className="flex flex-col w-[90%]  mx-auto gap-1 items-center">
                <DocViewer
                  className="h-full"
                  config={{
                    header: {
                      disableHeader: false,
                      disableFileName: false,
                      retainURLParams: false,
                    },
                  }}
                  documents={[
                    {
                      uri: data.url as string,
                      fileName: data.name,
                      fileType: data.type,
                    },
                  ]}
                  pluginRenderers={DocViewerRenderers}
                />

                <div className="w-full flex flex-col gap-2">
                  <div>
                    <h4 className="text-muted-foreground font-semibold">
                      {data.name}
                    </h4>
                    <div className="flex items-center text-xs text-muted-foreground gap-1">
                      <span>{data?.type}</span>
                      <span>-</span>
                      <span>{filesize(data.size)}</span>
                    </div>
                  </div>

                  <div className="text-xs flex flex-col gap-2 text-muted-foreground">
                    <div className="flex flex-col items-start ">
                      <span>Added on</span>
                      <span>
                        {dayjs(data.createdAt).format("D/M/YYYY, hh:mm:ss A")}
                      </span>
                    </div>
                    <div className="flex flex-col items-start ">
                      <span>Last Modified</span>
                      <span>
                        {dayjs(data.updatedAt).format("D/M/YYYY, hh:mm:ss A")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size={"sm"}
                      onClick={handleDownload}
                      variant={"outline"}
                    >
                      <IconDownload /> Download
                    </Button>

                    <SelectPreviewLinkExpiration fileId={data.id} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

type SelectDurationProps = {
  fileId: string;
};

const SelectPreviewLinkExpiration = ({ fileId }: SelectDurationProps) => {
  const trpc = useTRPC();
  const { mutateAsync: generateSignedUrl, isPending } = useMutation(
    trpc.files.generateSignedUrl.mutationOptions({
      onSuccess: async (data) => {
        const url = data;
        console.log({ url });
        await navigator.clipboard.writeText(url);
        toast.success("File url is Copied Successfully!");
      },
    })
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"sm"} variant={"link"}>
          {isPending && <Loader2 className="animate-spin" />} <IconCopy /> Get
          URL
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={async (e) => {
            e.stopPropagation();
            await generateSignedUrl({ expiration: "1_day", fileId });
          }}
        >
          Expires in 1 day
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={async (e) => {
            e.stopPropagation();
            await generateSignedUrl({ expiration: "1_week", fileId });
          }}
        >
          Expires in 1 week
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={async (e) => {
            e.stopPropagation();
            await generateSignedUrl({ expiration: "1_month", fileId });
          }}
        >
          Expires in 1 month
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

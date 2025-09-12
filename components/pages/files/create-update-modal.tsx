import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Folder } from "@/lib/generated/prisma";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/utils/trpc/root";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useFilesContext } from "@/hooks/use-files-context";
import { toast } from "sonner";

type CreateUpdateModalProps = {
  open: boolean;
  onClose: () => void;
};
const folderSchema = z.object({
  title: z.string(),
  description: z.string().nullish(),
});
type FolderInput = z.infer<typeof folderSchema>;

export const CreateUpdateModal = ({
  open,
  onClose,
}: CreateUpdateModalProps) => {
  const { editItem } = useFilesContext();
  const resourceType = !editItem
    ? "folder"
    : editItem.type == "folder"
    ? "folder"
    : "file";

  const actionType = editItem ? "edit" : "create";

  const trpc = useTRPC();
  const queryClient = new QueryClient();
  const { mutateAsync: createFolder, isPending } = useMutation(
    trpc.files.createFolder.mutationOptions()
  );
  const { mutateAsync: updateFile, isPending: isFileUpdating } = useMutation(
    trpc.files.updateFile.mutationOptions()
  );
  const { mutateAsync: updateFolder, isPending: isFolderUpdating } =
    useMutation(trpc.files.updateFolder.mutationOptions());

  const handleSubmit = async (values: FolderInput) => {
    const { title, description } = values;
    try {
      if (actionType == "create") {
        await createFolder(
          {
            name: title,
            description: description ? description : undefined,
          },
          {
            onSuccess() {
              toast.success("Folder Created Successfully!");
              queryClient.invalidateQueries({
                queryKey: trpc.files.list.queryKey(),
              });
            },
          }
        );
      } else if (actionType == "edit" && resourceType == "folder") {
        await updateFolder(
          {
            id: editItem?.data.id as string,
            name: title,
            description: description ? description : undefined,
          },
          {
            onSuccess() {
              toast.success("Folder Updated Successfully!");
              queryClient.invalidateQueries({
                queryKey: trpc.files.list.queryKey(),
              });
            },
          }
        );
      } else {
        await updateFile(
          { id: editItem?.data.id as string, name: title },
          {
            onSuccess() {
              toast.success("File Updated Successfully!");
              queryClient.invalidateQueries({
                queryKey: trpc.files.list.queryKey(),
              });
            },
          }
        );
      }
    } catch (error) {
      console.error({ error });
    }
  };

  const form = useForm<FolderInput>({
    resolver: zodResolver(folderSchema),
    defaultValues: editItem
      ? {
          title: editItem.data.name,
          description:
            editItem.type == "folder"
              ? (editItem.data as Folder).description
              : undefined,
        }
      : undefined,
  });

  const title = `${actionType} ${resourceType}`;
  const description = `${actionType} the ${resourceType} details`;

  const isLoading = isPending || isFileUpdating || isFolderUpdating;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div>
          <Form {...form}>
            <form
              className="space-y-5 "
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" placeholder="Reports" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {resourceType == "folder" && (
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field: { value, ...rest } }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          value={value ? value : ""}
                          {...rest}
                          placeholder="folder that contains all 2024 sales reports"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <div className="w-full flex items-center gap-2">
                <Button
                  onClick={onClose}
                  className="w-[50%]"
                  type="button"
                  variant={"secondary"}
                >
                  Cancel
                </Button>
                <Button
                  disabled={isLoading}
                  className="w-[50%] text-center"
                  type="submit"
                >
                  {isLoading && <Loader2 className="animate-spin" />}{" "}
                  {actionType}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

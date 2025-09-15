"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dropzone } from "../drop-zone";
import { IconFiles } from "@tabler/icons-react";
import { useFilesContext } from "@/hooks/use-files-context";
import { Item } from "@/lib/server/services/file.service";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export const DataTable = <TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) => {
  const { handleTableRowClick } = useFilesContext();

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="overflow-hidden border rounded-md h-[70vh] max-h-[80vh]">
      <Dropzone>
        <Table className="">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="bg-secondary/60" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {!header.isPlaceholder &&
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="w-full h-full">
            {table.getRowModel().rows.length > 0 ? (
              <>
                {table.getRowModel().rows.map((row) => (
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                    key={row.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      const item = row.original as Item;
                      handleTableRowClick(item);
                    }}
                    className="hover:bg-muted duration-300 ease-in-out max-h-10"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell className="h-10" key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-[65vh] text-center"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <IconFiles className="text-muted-foreground" size={80} />

                      <h4 className="text-base font-semibold text-muted-foreground ">
                        Drop your files here!
                      </h4>
                    </div>
                    <p className="text-sm font-normal text-muted-foreground">
                      {"Or upload them by 'New -> Upload file' button above!"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Dropzone>
    </div>
  );
};

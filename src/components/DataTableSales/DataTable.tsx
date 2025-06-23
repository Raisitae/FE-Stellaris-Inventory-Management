"use client";

import {
  flexRender,
  getCoreRowModel,
  type SortingState,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import * as React from "react";

import type { ColumnDef } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { CardContent } from "../ui/card";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelectedProducts } from "@/context/SelectedProductsContext";
import type { Product } from "@/interfaces/product";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
interface DataTableProps<TData extends Product, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData extends Product, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { t } = useTranslation("sales");
  const [rowSelection, setRowSelection] = React.useState({});
  const navigate = useNavigate();
  const { addProduct } = useSelectedProducts();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  });

  const handleClickSale = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length > 0) {
      const products = selectedRows.map((row) => row.original);
      products.forEach((product) => addProduct(product));
      navigate("/sales/add");
    }
  };
  return (
    <>
      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">{t("title")}</CardTitle>
              <CardDescription className="mt-1">
                {t("description")}
              </CardDescription>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    size="icon"
                    className="rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold shadow-md"
                    aria-label={t("addSale")}
                    onClick={() => navigate("/products")}>
                    <span className="leading-none">+</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("goToProductsTooltip")}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border border-gray-200"></div>
          <div className="rounded-md border border-grey-200">
            <Table className="border-grey-200 ">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="bg-muted/50 hover:bg-muted/50">
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          className=" font-medium text-muted-foreground"
                          key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center">
                      {t("noResults")}.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="text-muted-foreground flex-1 text-sm">
              {table.getFilteredSelectedRowModel().rows.length} {t("of")}{" "}
              {table.getFilteredRowModel().rows.length} {t("selectedRows")}
              <Button
                variant="default"
                size="sm"
                className="ml-2"
                onClick={handleClickSale}
                disabled={table.getFilteredSelectedRowModel().rows.length === 0}
                aria-label={t("exportSalesInvoice")}>
                {t("exportSalesInvoice")}
              </Button>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}>
              {t("previous")}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}>
              {t("next")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

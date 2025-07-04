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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Sale } from "@/interfaces/sale";
interface DataTableProps<TData extends Sale, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  "data-testid"?: string;
}

export function DataTable<TData extends Sale, TValue>({
  columns,
  data,
  "data-testid": dataTestId = "datatable-sale-component",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { t } = useTranslation("sales");
  const [rowSelection, setRowSelection] = React.useState({});
  const navigate = useNavigate();

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

  function handleInvoiceSales(sales: Sale[]) {
    if (!sales || sales.length === 0) return;

    // Generar CSV
    const headers = Object.keys(sales[0]);
    const csvRows = [
      headers.join(","), // encabezados
      ...sales.map((sale) =>
        headers.map((header) => JSON.stringify(sale[header] ?? "")).join(",")
      ),
    ];
    const csvContent = csvRows.join("\n");

    // Descargar archivo
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sales.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle
                data-testid={`${dataTestId}.title`}
                className="text-2xl font-bold">
                {t("title")}
              </CardTitle>
              <CardDescription
                data-testid={`${dataTestId}.description`}
                className="mt-1">
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
                      data-testid={`${dataTestId}.noResults`}
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
                data-testid={`${dataTestId}.export.button`}
                onClick={() =>
                  handleInvoiceSales(
                    table
                      .getFilteredSelectedRowModel()
                      .rows.map((row) => row.original as unknown as Sale)
                  )
                }
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

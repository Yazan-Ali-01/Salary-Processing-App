import React from 'react';
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, SortingState, flexRender } from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaymentHistory } from '@/types';
import { ArrowDownNarrowWide, ArrowUpWideNarrow, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface PaymentHistoryTableProps {
  paymentHistories: PaymentHistory[];
}

export const PaymentHistoryTable: React.FC<PaymentHistoryTableProps> = ({ paymentHistories }) => {

  const [sorting, setSorting] = React.useState<SortingState>([])
  const data = paymentHistories;

  const columns = [
    {
      accessorKey: 'employeeId',
      header: 'Employee ID',
      enableSorting: true,
    },
    {
      accessorKey: 'name',
      header: 'Employee Name',
      enableSorting: true,
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: (info: { getValue: () => string; }) => {
        const value = info.getValue();
        // Format the date using Intl.DateTimeFormat
        const formattedDate = new Date(value).toLocaleDateString(undefined, {
          year: 'numeric', month: 'long', day: 'numeric'
        });
        return formattedDate;
      },
      enableSorting: true,
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: (info: { getValue: () => number; }) => {
        const value = info.getValue();
        return `$${value.toFixed(2)}`;
      },
      enableSorting: true,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (info: { getValue: () => string; }) => {
        const status = info.getValue();
        let icon;
        switch (status) {
          case 'processed':
            icon = <CheckCircle color="green" size={16} />;
            break;
          case 'pending':
            icon = <Clock color="orange" size={16} />;
            break;
          case 'failed':
            icon = <XCircle color="red" size={16} />;
            break;
          default:
            icon = null;
        }
        return (
          <div className="flex items-center justify-center space-x-2">
            <span className='font-semibold'>{status}</span>
            {icon}
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: 'endOfService',
      header: 'End Of Service',
      cell: (info: { getValue: () => string; }) => {
        const status = !!info.getValue();
        let icon;
        switch (status) {
          case true:
            icon = <CheckCircle color="green" size={18} />;
            break;
          case false:
            icon = <XCircle color="red" size={18} />;
            break;
          default:
            icon = null;
        }
        return (
          <div className="flex items-center justify-center space-x-2">
            {icon}
          </div>
        );
      },
      enableSorting: true,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const rowVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
      }
    }
  };

  return (
    <div className='max-h-[490px] overflow-auto printable'>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className='text-center sticky top-0 text-black bg-slate-100/85 '>
                  {header.isPlaceholder
                    ? null
                    : (
                      <div onClick={() => header.column.toggleSorting()} className={`flex justify-around items-center  ${header.column.getCanSort() ? 'hover:cursor-pointer' : ''}`}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() ? (header.column.getIsSorted() === 'asc' ? <ArrowUpWideNarrow size={16} color="#F72717" strokeWidth={1.75} /> : <ArrowDownNarrowWide size={16} color="#F72717" strokeWidth={1.75} />) : ''}
                      </div>
                    )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <motion.tr
              key={row.id}
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              exit="hidden" // Ensures the fading effect when rows exit
            >
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </motion.tr>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4 mr-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

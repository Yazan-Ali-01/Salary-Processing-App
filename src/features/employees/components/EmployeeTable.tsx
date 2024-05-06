// src/features/employees/components/EmployeeTable.tsx
// import React, { useEffect, useState } from 'react';
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, SortingState, flexRender } from '@tanstack/react-table';
// import { fetchEmployees, deleteEmployee } from '@/services/employeeService';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Employee } from '@/types';
import { EditEmployeeDialog } from './EditEmployeeDialog';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownNarrowWide, ArrowUpWideNarrow } from 'lucide-react';
import useStore from '@/store/useStore';

interface EmployeeTableProps {
  employees: Employee[];
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees }: EmployeeTableProps) => {
  const data = employees
  const { removeEmployee } = useStore();
  const [sorting, setSorting] = useState<SortingState>([])
  const columns = [
    {
      accessorKey: 'staffId',
      header: 'Staff ID',
      enableSorting: true,
    },
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'joiningDate',
      header: 'Joining Date',
      enableSorting: true,
      cell: (info: { getValue: () => string | number | Date; }) => new Date(info.getValue()).toLocaleDateString(),
    },
    {
      accessorKey: 'basicSalary',
      header: 'Basic Salary',
      enableSorting: true,
      cell: (info: { getValue: () => number; }) => `$${info.getValue().toFixed(2)}`,
    },
    {
      accessorKey: 'salaryAllowances',
      header: 'Salary Allowances',
      cell: (info: { getValue: () => number; }) => `$${info.getValue().toFixed(2)}`,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-2 justify-center">
          <EditEmployeeDialog employee={row.original} />
          <Button onClick={() => removeEmployee(row.original.id)}>Delete</Button>
        </div>
      )
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: sorting, // You can manage this state from outside the table to control sorting
    },
    onSortingChange: setSorting, // Function to update sorting state
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const variants = {
    hidden: { opacity: 0 },
    visible: i => ({
      opacity: 1,
      transition: {
        delay: i * 0.1, // each item will appear with a delay of index * 0.1 seconds
      }
    })
  };

  return (
    <div className='max-h-[490px] overflow-auto'>
      <Table>
        <TableHeader className=''>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {

                return (
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
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row, index) => (
            <motion.tr
              key={row.id}
              initial="hidden"
              animate="visible"
              custom={index} // Passing index as custom prop for staggering
              variants={variants}
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

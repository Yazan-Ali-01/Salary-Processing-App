// src/features/salaries/components/SalaryTable.tsx
import React, { useMemo, useState } from 'react';
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, SortingState, flexRender } from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Employee } from '@/types';
import { EditSalaryDialog } from './EditSalaryDialog';
import { ArrowDownNarrowWide, ArrowUpWideNarrow } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { SearchInput } from '@/components/SearchInput';
import { SalariesProcessingTable } from './SalariesProcessingTable';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import useStore from '@/store/useStore';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface SalaryTableProps {
  employees: Employee[];
}

export const SalaryTable: React.FC<SalaryTableProps> = ({ employees }) => {
  const { loading } = useStore();

  const { salaryRecords } = useStore(state => ({
    salaryRecords: state.salaryRecords,
  }));

  console.log(employees, 'testa')

  const { toast } = useToast()

  const { simulateSalaryRecords } = useStore(state => ({
    simulateSalaryRecords: state.simulateSalaryRecords,
  }));



  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sorting, setSorting] = useState<SortingState>([])

  const filteredData = useMemo(() => {
    return employees.filter(employee =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  const columns = [
    {
      accessorKey: 'staffId',
      header: 'Staff ID',
      enableSorting: true,
    },
    {
      accessorKey: 'name',
      header: 'Employee Name',
      enableSorting: true,
    },
    {
      accessorKey: 'basicSalary',
      header: 'Basic Salary',
      cell: (info: { getValue: () => number; }) => {
        const value = info.getValue();
        return `$${value ? value.toFixed(2) : '0.00'}`; // Same check here
      },
      enableSorting: true,
    },
    {
      accessorKey: 'salaryAllowances',
      header: 'Salary Allowances',
      cell: (info: { getValue: () => number; }) => {
        const value = info.getValue();
        return `$${value ? value.toFixed(2) : '0.00'}`; // Same check here
      },
      enableSorting: true,
    },
    {
      accessorKey: 'additions',
      header: 'Additions',
      enableSorting: true,
    },
    {
      accessorKey: 'deductions',
      header: 'Deductions',
      enableSorting: true,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-2 justify-center">
          <EditSalaryDialog employee={row.original} />
        </div>
      ),
      enableSorting: true,
    },
  ];

  const table = useReactTable({
    data: filteredData,
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
    <div key={employees.length} className='max-h-[490px] overflow-auto'>
      <div className='flex justify-between mr-6 mb-4 mt-2 sticky top-0 bottom-0'>
        <SearchInput onSearchChange={setSearchTerm} placeholder='Search By Name...' />
        <div className='flex space-x-2'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='outline' className='rounded-lg h-8 text-primary shadow-lg' disabled={loading} onClick={async () => {
                  await simulateSalaryRecords()
                  toast({
                    title: "Salary Records Successfully Added!",
                    description: "Your salary records were added on Friday, February 10, 2023, at 5:57 PM and are now awaiting processing. You will be notified once the processing is complete.",
                    variant: 'success'
                  })
                }}>
                  {!loading ? 'Generate Salary Records For All Employees' : (
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-1 w-1 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-1 w-[250px]" />
                        <Skeleton className="h-1 w-[200px]" />
                      </div>
                    </div>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent className='mx-4 bg-slate-100 text-destructive font-medium text-xs'>
                <p>Click to generate and update salary records for all employees since their joining date.</p>
              </TooltipContent>

            </Tooltip>
          </TooltipProvider>
          <Popover>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <PopoverTrigger className='bg-primary/95 rounded-lg shadow-lg hover:opacity-95 w-52 text-white h-8'>Process Salaries</PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent className='mx-2 bg-foreground'>
                  <p>Process all salaries resulted with variety of filters to choose from.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <PopoverContent className='mr-4 mt-2 bg-slate-50'>
              <SalariesProcessingTable salaryRecords={salaryRecords} />
            </PopoverContent>
          </Popover>
        </div>
      </div>
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
    </div >
  );
};

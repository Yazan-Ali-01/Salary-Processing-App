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
import { SalaryRecord } from '@/types';
import { ArrowDownNarrowWide, ArrowUpWideNarrow } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { MonthDropdown } from '@/components/MonthDropdown';
import { YearDropdown } from '@/components/YearDropdown';
import useStore from '@/store/useStore';
import { SearchInput } from '@/components/SearchInput';
import { SalariesProcessingDialog } from './SalariesProcessingDialog';

interface SalariesProcessingTableProps {
  salaryRecords: SalaryRecord[];
}

export const SalariesProcessingTable: React.FC<SalariesProcessingTableProps> = ({ salaryRecords }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSalaries, setSelectedSalaries] = useState({});
  const [endOfServiceStates, setEndOfServiceStates] = useState({});

  const handleEndOfServiceChange = (id, checked) => {
    setEndOfServiceStates(prev => ({ ...prev, [id]: checked }));
  };

  const { processSalary } = useStore(state => ({ processSalary: state.processSalary }));

  const processAllVisibleSalaries = () => {
    salaryRecords.forEach(record => {
      const endOfService = endOfServiceStates[record.id] || false;
      processSalary(record.id, endOfService);
    });
  };

  const processSelectedSalaries = () => {
    Object.keys(selectedSalaries).forEach(id => {
      if (selectedSalaries[id]) {
        const endOfService = endOfServiceStates[id] || false;
        processSalary(id, endOfService);
      }
    });
  };

  const handleSelectionChange = (id, checked) => {
    setSelectedSalaries(prev => ({
      ...prev,
      [id]: checked
    }));
  };

  const filteredData = useMemo(() => {
    return salaryRecords.filter(record =>
      (!selectedMonth || record.month === selectedMonth) &&
      (!selectedYear || record.year === selectedYear) &&
      record.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [salaryRecords, selectedMonth, selectedYear, searchTerm]);

  const totalSalary = useMemo(() => {
    return filteredData.reduce((sum, record) => sum + (record?.totalSalary || 0), 0).toFixed(2);
  }, [filteredData]);

  const selectedTotalSalary = useMemo(() => {
    return Object.keys(selectedSalaries).reduce((sum, id) => {
      if (selectedSalaries[id]) {
        const record = salaryRecords.find(record => record.id === id);
        return sum + (record?.totalSalary || 0);
      }
      return sum;
    }, 0).toFixed(2);
  }, [selectedSalaries, salaryRecords]);

  const [sorting, setSorting] = useState<SortingState>([])

  const columns = [
    {
      accessorKey: 'employeeId',
      header: 'Staff ID',
      enableSorting: true,
    },
    {
      accessorKey: 'employeeName',
      header: 'Employee Name',
      enableSorting: true,
    },
    {
      accessorKey: 'month',
      header: 'Month',
      cell: (info: { getValue: () => number; }) => new Date(0, info.getValue() - 1).toLocaleString('default', { month: 'long' }),
      enableSorting: true,
    },
    {
      accessorKey: 'year',
      header: 'Year',
      enableSorting: true,
    },
    {
      accessorKey: 'totalSalary',
      header: 'Total Salary',
      cell: (info: { getValue: () => number; }) => {
        const value = info.getValue();
        return `$${value ? value : '0.00'}`; // Same check here
      },
      enableSorting: true,
    },
    {
      id: 'endOfService',
      header: 'End of Service',
      cell: ({ row }) => (
        <div className="flex justify-center items-center h-full">
          <Checkbox
            checked={endOfServiceStates[row.original.id] || false}
            onCheckedChange={checked => handleEndOfServiceChange(row.original.id, checked)}
            aria-label={`End of service for ${row.original.employeeName}`}
          />
        </div>
      ),
      enableSorting: false,
    },
    {
      id: 'selection',
      header: () => <Checkbox aria-label="Select all rows" />, // Optional: header checkbox to select all rows
      cell: ({ row }) => (
        <Checkbox
          checked={selectedSalaries[row.original.id] || false}
          onCheckedChange={checked => handleSelectionChange(row.original.id, checked)}
          aria-label={`Select salary for ${row.original.employeeName}`}
        />
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-2 justify-center">
          <Button onClick={() => processSalary(row.original.id, endOfServiceStates[row.original.id] || false)}>
            Process Salary
          </Button>
        </div>
      ),
      enableSorting: false,
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

  return (

    <div className='max-h-[490px] overflow-hidden'>
      <div className="flex justify-between space-x-2 mx-2 mb-4 mt-2 sticky top-0">
        <div className='space-x-2 flex items-center justify-center'>
          <SearchInput onSearchChange={setSearchTerm} placeholder='Filter By Name...' />
          <MonthDropdown selectedMonth={selectedMonth} onSelectMonth={setSelectedMonth} />
          <YearDropdown selectedYear={selectedYear} onSelectYear={setSelectedYear} />
        </div>
        <div className='flex flex-row space-x-2'>
          <SalariesProcessingDialog key={totalSalary} text="Process Visible" totalSalary={totalSalary} processAllVisibleSalaries={processAllVisibleSalaries} />
          <SalariesProcessingDialog key={selectedTotalSalary} text="Process Selected" totalSalary={selectedTotalSalary} processAllVisibleSalaries={processSelectedSalaries} />
        </div>
      </div>

      <div className='max-h-[490px] overflow-auto'>
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
            {table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id} className='text-center'>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
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
    </div>
  );
};


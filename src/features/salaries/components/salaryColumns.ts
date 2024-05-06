export const salaryColumns = [
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
    enableSorting: true,
    cell: (info) => `$${info.getValue()?.toFixed(2) || '0.00'}`,
  },
  {
    accessorKey: 'salaryAllowances',
    header: 'Salary Allowances',
    enableSorting: true,
    cell: (info) => `$${info.getValue()?.toFixed(2) || '0.00'}`,
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
    enableSorting: true,
  },
];

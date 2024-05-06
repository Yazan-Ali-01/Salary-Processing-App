export interface User {
  id: string;
  username: string;
  email: string;
}
export interface Employee {
  id: string;
  staffId: string;
  name: string;
  joiningDate: Date;
  basicSalary: number;
  salaryAllowances: number;
  additions: number;  // Default additions
  deductions: number;  // Default deductions
}

export interface SalaryRecord {
  id: string;
  employeeId: string;  // No need for employeeName if it can be derived from employeeId
  employeeName: string;
  basicSalary: number;
  salaryAllowances: number;
  totalSalary: number;
  month: number;  // Consider using a Date object or maintaining as number if used for sorting/filtering
  year: number;
  additions: number;
  deductions: number;
  endOfService: boolean;
}

export interface PaymentHistory {
  id: string;
  employeeId: string;  // No need to duplicate name here, can be derived when needed
  date: string;  // Using Date type for consistency
  amount: number;
  endOfService: boolean;
  status: 'processed' | 'pending' | 'failed';  // Ensured only valid status values can be used
}

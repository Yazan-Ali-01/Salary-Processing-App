import { SalaryRecord } from "@/types";
import Chance from "chance";

const chance = new Chance();
// Utility to enrich salary records with additional employee details
export const enrichSalaryRecord = (record, employees) => {
  const employee = employees.find(emp => emp.id === record.employeeId);
  if (!employee) {
    console.error("Employee not found for salary record:", record);
    return record;  // Optionally, handle this more gracefully
  }
  return {
    ...record,
    employeeName: employee.name, // Include employee's name in the record
    basicSalary: employee.basicSalary, // Ensuring latest basic salary is used
    salaryAllowances: employee.salaryAllowances, // Ensuring latest allowances are used
    totalSalary: calculateTotalSalary(employee, record) // Calculate total salary based on current record
  };
};

// Helper function to calculate the total salary
export const calculateTotalSalary = (employee, record) => {
  return employee.basicSalary + employee.salaryAllowances + record.additions - record.deductions;
};

export const generateRandomEmployee = () => {
  return {
    id: chance.guid(),
    staffId: `E${chance.integer({ min: 1000, max: 9999 })}`,
    name: chance.name(),
    joiningDate: chance.date({ year: chance.year({ min: 2020, max: 2022 }) }),
    basicSalary: chance.floating({ min: 50000, max: 150000, fixed: 2 }),
    salaryAllowances: chance.floating({ min: 10000, max: 50000, fixed: 2 }),
    additions: chance.floating({ min: 0, max: 10000, fixed: 2 }),
    deductions: chance.floating({ min: 0, max: 5000, fixed: 2 }),
  };
}

// Utility to calculate pro-rated salary for a new employee based on their joining date
export const generateSalaryForEmployee = (employee, currentDate) => {
  if (typeof currentDate === 'string') {
    currentDate = new Date(currentDate);
  } else if (!currentDate) {
    currentDate = new Date();  // Use the current date if undefined
  }

  console.log('Current Date:', currentDate);

  const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const joiningDate = new Date(employee.joiningDate);
  console.log('Joining Date:', joiningDate);

  if (joiningDate >= currentMonthStart) {
    console.log('Joining date is in or after the current month:', joiningDate, currentMonthStart);
    return [];
  }

  const salaryRecords = [] as SalaryRecord[];
  const tempDate = new Date(joiningDate.getFullYear(), joiningDate.getMonth(), 1);

  while (tempDate < currentMonthStart) {
    console.log('test2');
    const daysInMonth = new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, 0).getDate();
    let workedDays = daysInMonth;

    if (tempDate.getFullYear() === joiningDate.getFullYear() && tempDate.getMonth() === joiningDate.getMonth()) {
      workedDays = daysInMonth - joiningDate.getDate() + 1;
    }

    const dailySalary = employee.basicSalary / daysInMonth;
    const totalSalaryForMonth = workedDays * dailySalary + employee.salaryAllowances + employee.additions - employee.deductions


    salaryRecords.push({
      id: `sr-${tempDate.getTime()}`,
      employeeId: employee.id,
      month: tempDate.getMonth() + 1,
      year: tempDate.getFullYear(),
      additions: 0,
      deductions: 0,
      endOfService: false,
      employeeName: employee.name,
      basicSalary: employee.basicSalary,
      salaryAllowances: employee.salaryAllowances,
      totalSalary: parseFloat(totalSalaryForMonth.toFixed(2))
    });

    tempDate.setMonth(tempDate.getMonth() + 1);
  }

  return salaryRecords;
};


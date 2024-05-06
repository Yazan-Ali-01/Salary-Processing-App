import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useStore from '@/store/useStore';
import { Employee } from '@/types';

interface EditEmployeeDialogProps {
  employee: Employee;
}

export const EditEmployeeDialog: React.FC<EditEmployeeDialogProps> = ({ employee }) => {
  const [name, setName] = useState(employee.name);
  const [joiningDate, setJoiningDate] = useState(employee.joiningDate);
  const [basicSalary, setBasicSalary] = useState(employee.basicSalary.toString());
  const [salaryAllowances, setSalaryAllowances] = useState(employee.salaryAllowances.toString());
  const { loading } = useStore();

  const updateEmployee = useStore((state) => state.updateEmployee);

  const handleSave = async () => {
    const updatedEmployee = {
      ...employee,
      name,
      joiningDate,
      basicSalary: parseFloat(basicSalary),
      salaryAllowances: parseFloat(salaryAllowances),
    };
    updateEmployee(updatedEmployee);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Employee</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
          <DialogDescription>Update the employee details below.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <FormField label="Name" id="name" value={name} onChange={setName} />
          <FormField label="Joining Date" id="joiningDate" type="date" value={joiningDate} onChange={setJoiningDate} />
          <FormField label="Basic Salary" id="basicSalary" type="number" value={basicSalary} onChange={setBasicSalary} />
          <FormField label="Salary Allowances" id="salaryAllowances" type="number" value={salaryAllowances} onChange={setSalaryAllowances} />
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const FormField = ({ label, id, type = 'text', value, onChange }) => (
  <div className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor={id}>{label}:</Label>
    <Input id={id} type={type} value={value} className="col-span-3" onChange={e => onChange(e.target.value)} />
  </div>
);

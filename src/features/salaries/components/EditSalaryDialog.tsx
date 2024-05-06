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
import { Employee } from '@/types'; // Import Employee type
import useStore from '@/store/useStore';

interface EditSalaryDialogProps {
  employee: Employee; // Changed to accept Employee type
}

export const EditSalaryDialog: React.FC<EditSalaryDialogProps> = ({ employee }) => {
  console.log(employee);

  const [additions, setAdditions] = useState(employee.additions.toString()); // Use employee.additions
  const [deductions, setDeductions] = useState(employee.deductions.toString()); // Use employee.deductions
  const updateEmployee = useStore(state => state.updateEmployee); // Method to update employee
  const { loading } = useStore();

  const handleSave = async () => {
    try {
      const updatedEmployee = {
        ...employee,
        additions: parseFloat(additions),
        deductions: parseFloat(deductions),
      };
      await updateEmployee(updatedEmployee); // Use store method to update employee
    } catch (error) {
      console.error('Failed to update employee data:', error);
    }
  };


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size='default' className='max-w-44 text-xs'>Edit Additions/Deductions</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Salary</DialogTitle>
          <DialogDescription>
            Update the salary record details below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <FormField label="Additions" id="additions" type="number" value={additions} onChange={setAdditions} />
          <FormField label="Deductions" id="deductions" type="number" value={deductions} onChange={setDeductions} />
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

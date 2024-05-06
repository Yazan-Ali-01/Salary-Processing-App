import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const SalariesProcessingDialog = ({ text, totalSalary, processAllVisibleSalaries }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className='bg-green-600 hover:bg-green-500 hover:opacity-95'>
          <span className='text-slate-50'>
            {text} <span className='ml-1 text-sm font-semibold text-foreground '>(${totalSalary})</span>
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md h-44 p-4">
        <DialogHeader>
          <DialogTitle className='mb-3 mt-1 font-bold'>Confirm Salary Processing</DialogTitle>
          <DialogDescription className='text-md font-semibold'>
            Are you sure you want to process all selected salaries totaling <span className='text-destructive font-bold'>${totalSalary}</span> ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end space-x-2">
          <DialogTrigger asChild>
            <Button variant="outline" onClick={() => {/* Dialog close logic here */ }}>Cancel</Button>
          </DialogTrigger>
          <Button variant="default" onClick={() => processAllVisibleSalaries()}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

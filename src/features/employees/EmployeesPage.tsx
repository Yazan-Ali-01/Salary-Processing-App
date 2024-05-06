// src/features/employees/EmployeesPage.tsx
import React from 'react';
import { EmployeeAddForm } from '@/features/employees/components/EmployeeAddForm';
import { EmployeeTable } from '@/features/employees/components/EmployeeTable';
import useStore from '@/store/useStore';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const EmployeesPage: React.FC = () => {
  const { employees, loading } = useStore();

  const { toast } = useToast()

  const { addRandomEmployees } = useStore(state => ({
    addRandomEmployees: state.addRandomEmployees,
  }));

  return (
    <div className='flex flex-col px-8 max-h-screen'>
      <div className='flex justify-between items-center mr-10 my-4'>
        <h2 className="border-b pb-2 text-3xl font-semibold tracking-tight">
          Employees Information Table
        </h2>
        <div className='flex space-x-2'>
          <EmployeeAddForm key={employees.length} />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='outline' className='rounded-lg h-8 text-primary shadow-lg' disabled={loading} onClick={async () => {
                  await addRandomEmployees(10)
                  toast({
                    title: "Employees Successfully Added!",
                    description: "Your employees were added on Friday, February 10, 2023, at 5:57 PM and are now awaiting processing.",
                    variant: 'success'
                  })
                }}>
                  {!loading ? 'Generate Random Employees (10)' : (
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
        </div>
      </div>
      <EmployeeTable key={employees.length} employees={employees} />
    </div>
  );
};

export default EmployeesPage;

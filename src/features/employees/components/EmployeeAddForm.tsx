import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import useStore from '@/store/useStore';
import { CalendarIcon } from '@radix-ui/react-icons';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';

const employeeSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long." }),
  joiningDate: z.date({ message: "Invalid date format." }).transform((date) => date.toISOString().slice(0, 10)),
  basicSalary: z.string().transform(val => parseFloat(val)).refine(val => !isNaN(val) && val > 0, { message: "Salary must be greater than zero." }),
});

const daysBefore = 68;
const defaultJoiningDate = new Date();
defaultJoiningDate.setDate(defaultJoiningDate.getDate() - daysBefore);

export const EmployeeAddForm = () => {
  const form = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      joiningDate: defaultJoiningDate,
      basicSalary: 0,
    }
  });

  const addEmployee = useStore(state => state.addEmployee);

  const { loading } = useStore();

  const onSubmit = async (data) => {

    await addEmployee({
      ...data,
      id: Math.floor(Math.random() * 1000),
      staffId: `E${Math.floor(Math.random() * 10000)}`, // Random staff ID generation for simplicity
      additions: 0,
      deductions: 0,
      salaryAllowances: 0,// Assuming salary allowances need to be set elsewhere or start as 0
    });
    form.reset();  // Reset form after submission
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className='rounded-lg h-8  shadow-lg'>Add New Employee</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            Enter the details of the new employee.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Enter the full name of the employee.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField
              control={form.control}
              name="joiningDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Joining Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    The Date on which the employee joined.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="basicSalary" render={({ field }) => (
              <FormItem>
                <FormLabel>Basic Salary</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>Enter the basic salary amount.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Close
                </Button>
              </DialogClose>
              <Button type="submit" disabled={loading}>{!loading ? 'Submit' : (
                <div className="flex items-center">
                  <div role="status">
                    <svg aria-hidden="true" className="w-4 h-4 me-2 text-gray-200 animate-spin dark:text-gray-600 fill-primary-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                  Adding Employee...
                </div>
              )}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

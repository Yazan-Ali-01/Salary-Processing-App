import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'
import { enrichSalaryRecord, generateRandomEmployee, generateSalaryForEmployee } from '@/lib/salary';  // Assume utilities are defined elsewhere
import { Employee, PaymentHistory, SalaryRecord } from '@/types';

interface StoreState {
  employees: Employee[];
  salaryRecords: SalaryRecord[];
  paymentHistories: PaymentHistory[];
  loading: boolean;
}

interface StoreActions {
  setLoading: (loading: boolean) => void;
  addEmployee: (employee: Employee) => void;
  updateEmployee: (employee: Employee) => void;
  removeEmployee: (employeeId: string) => void;
  simulateSalaryRecords: () => void;
  addRandomEmployees: (count: number) => void;
  addSalaryRecord: (record: SalaryRecord) => void;
  updateSalaryRecord: (record: SalaryRecord) => void;
  removeSalaryRecord: (recordId: string) => void;
  addPaymentHistory: (history: PaymentHistory) => void;
  removePaymentHistory: (historyId: string) => void;
  processSalary: (recordId: string, endOfService: boolean) => void;
}

type UseStoreType = StoreState & StoreActions;

const jsonStorage = createJSONStorage(() => window.localStorage);

const useStore = create<UseStoreType>(persist((set, get) => ({
  employees: [],
  salaryRecords: [] as SalaryRecord[],
  paymentHistories: [],
  loading: false,


  setLoading: (loading) => set({ loading }),

  addEmployee: async (employee: Employee) => {
    set({ loading: true });
    // Simulate an API call with a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    set(state => ({
      employees: [...state.employees, employee],
      loading: false
    }));
  },
  addRandomEmployees: (count: number) => {
    set({ loading: true });
    const newEmployees = Array.from({ length: count }, () => generateRandomEmployee());
    set(state => ({
      employees: [...state.employees, ...newEmployees],
      loading: false
    }));
  },
  simulateSalaryRecords: async () => {
    set({ loading: true });
    await new Promise(resolve => setTimeout(resolve, 1500));  // Simulating processing
    set(state => {
      const allRecords = state.employees.flatMap(employee =>
        generateSalaryForEmployee(employee, new Date()));
      console.log('Generated All Records:', allRecords);

      return {
        salaryRecords: [...state.salaryRecords, ...allRecords],
        loading: false
      };
    });
  },
  removeEmployee: async (employeeId) => {
    set({ loading: true });
    await new Promise(resolve => setTimeout(resolve, 1000));  // Simulating an API call
    set(state => ({
      employees: state.employees.filter(e => e.id !== employeeId),
      salaryRecords: state.salaryRecords.filter(sr => sr.employeeId !== employeeId),
      paymentHistories: state.paymentHistories.filter(ph => ph.employeeId !== employeeId),
      loading: false
    }));
  },

  updateEmployee: async (updatedEmployee) => {
    set({ loading: true });
    set(state => ({
      employees: state.employees.map(e => e.id === updatedEmployee.id ? updatedEmployee : e),
      loading: false
    }));
  },


  addSalaryRecord: async (record) => {
    set({ loading: true });
    await new Promise(resolve => setTimeout(resolve, 1000));  // Simulating data enrichment
    set(state => ({
      salaryRecords: [...state.salaryRecords, enrichSalaryRecord(record, get().employees)],
      loading: false
    }));
  },
  updateSalaryRecord: async (updatedRecord) => {
    set({ loading: true });
    await new Promise(resolve => setTimeout(resolve, 1000));  // Simulating data enrichment
    set(state => ({
      salaryRecords: state.salaryRecords.map(sr => sr.id === updatedRecord.id ? enrichSalaryRecord(updatedRecord, get().employees) : sr),
      loading: false
    }));
  },

  removeSalaryRecord: async (recordId) => {
    set({ loading: true });
    await new Promise(resolve => setTimeout(resolve, 1000));  // Simulating an API call
    set(state => ({
      salaryRecords: state.salaryRecords.filter(sr => sr.id !== recordId),
      loading: false
    }));
  },
  addPaymentHistory: async (history) => {
    set({ loading: true });
    await new Promise(resolve => setTimeout(resolve, 100));  // Simulating an API call
    set(state => ({
      paymentHistories: [...state.paymentHistories, history],
      loading: false
    }));
  },
  removePaymentHistory: async (historyId) => {
    set({ loading: true });
    await new Promise(resolve => setTimeout(resolve, 1000));  // Simulating an API call
    set(state => ({
      paymentHistories: state.paymentHistories.filter(ph => ph.id !== historyId),
      loading: false
    }));
  },
  processSalary: async (recordId, endOfService) => {
    set({ loading: true });
    await new Promise(resolve => setTimeout(resolve, 100));  // Simulating salary processing
    const record = get().salaryRecords.find(record => record.id === recordId);
    if (!record) {
      set({ loading: false });
      return;
    }

    const employee = get().employees.find(e => e.id === record.employeeId);
    if (!employee) {
      set({ loading: false });
      return;
    }

    const finalSalary = employee.basicSalary + employee.salaryAllowances + record.additions - record.deductions;
    const newPaymentHistory = {
      id: `${Date.now()}`,
      employeeId: record.employeeId,
      name: employee.name,
      date: new Date().toISOString(),
      amount: finalSalary,
      status: 'processed' as 'processed' | 'pending' | 'failed',
      endOfService
    };

    set(state => ({
      paymentHistories: [...state.paymentHistories, newPaymentHistory],
      salaryRecords: state.salaryRecords.filter(sr => sr.id !== recordId),
      loading: false
    }));
  }
}), {
  name: 'payrollStore',  // Unique key for the local storage item
  storage: jsonStorage,  // Use localStorage via createJSONStorage
}) as StateCreator<UseStoreType, [], []>);

export default useStore;

import React, { useState, useEffect } from 'react';

const TestFetchComponent = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch employee data including salary records and payment history
  useEffect(() => {
    const fetchData = async () => {
      try {
        const empResponse = await fetch('/api/employees');
        const data = await empResponse.json();
        const employees = await data.employees;
        console.log(employees);


        // Assume employee ID is available from fetched data for testing
        if (employees[0]) {
          const empId = employees[0].id;

          // Fetch data for a specific employee
          const detailedResponse = await fetch(`/api/employees/${empId}`);
          const detailedData = await detailedResponse.json();
          setEmployeeData(detailedData);
        }

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Data Fetch Test</h1>
      <h2>Employee Details</h2>
      {employeeData ? (
        <div>
          <pre>{JSON.stringify(employeeData.employee, null, 2)}</pre>
          <h3>Salary Records</h3>
          <pre>{JSON.stringify(employeeData.salaryRecords, null, 2)}</pre>
          <h3>Payment History</h3>
          <pre>{JSON.stringify(employeeData.paymentHistories, null, 2)}</pre>
        </div>
      ) : (
        <p>No detailed employee data fetched</p>
      )}
    </div>
  );
};

export default TestFetchComponent;

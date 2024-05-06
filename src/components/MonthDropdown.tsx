import React from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const MonthDropdown = ({ selectedMonth, onSelectMonth }) => {
  const currentMonthIndex = new Date().getMonth();
  const displayMonth = selectedMonth ? months[selectedMonth - 1] : months[currentMonthIndex];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{displayMonth}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {months.map((month, index) => (
          <DropdownMenuItem key={month} onSelect={() => onSelectMonth(index + 1)}>
            {month}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
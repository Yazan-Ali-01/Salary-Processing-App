import React from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export const YearDropdown = ({ selectedYear, onSelectYear }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(10), (_, index) => currentYear - index);

  const displayYear = selectedYear || currentYear;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{displayYear}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {years.map(year => (
          <DropdownMenuItem key={year} onSelect={() => onSelectYear(year)}>
            {year}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
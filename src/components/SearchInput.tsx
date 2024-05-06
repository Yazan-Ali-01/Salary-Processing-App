import React from 'react';
import { Input } from './ui/input';


export const SearchInput = ({ onSearchChange, placeholder }) => {
  return (
    <div className="flex max-w-md items-center space-x-2 mx-3">
      <Input placeholder={placeholder} type="search" onChange={(e) => onSearchChange(e.target.value)} className='max-h-8 max-w-sm ' />
    </div>
  );
};
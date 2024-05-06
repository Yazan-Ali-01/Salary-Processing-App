import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { SidebarItem } from '@/components/Sidebar/Sidebar';
import { Users, HandCoins, FolderClock } from 'lucide-react';

const PrivateLayout: React.FC = () => {
  return (
    <div className="flex max-h-screen">
      <Sidebar>
        <SidebarItem
          icon={<Users />}
          text="Employees"
          link="/employees"
        />
        <SidebarItem
          icon={<HandCoins />}
          text="Salaries"
          link="/salaries"
        />
        <SidebarItem
          icon={<FolderClock />}
          text="Payment History"
          link="/payment-history"
        />
      </Sidebar>
      <div className="flex-grow p-4 ">
        <Outlet />
      </div>
    </div>
  );
};

export default PrivateLayout;

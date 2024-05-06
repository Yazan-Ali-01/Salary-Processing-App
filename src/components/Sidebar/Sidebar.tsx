import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { ChevronLast, ChevronFirst, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Button } from '../ui/button';
import useAuthStore from '@/store/useAuthStore';

interface SidebarContextType {
  expanded: boolean;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  link: string;
  alert?: boolean;
}

interface SidebarProps {
  children?: ReactNode;  // Correctly typed as ReactNode
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [query]);

  return matches;
};

export const Sidebar = ({ children }: SidebarProps) => {
  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  const [expanded, setExpanded] = useState(!isSmallScreen);
  const { currentUser, logout } = useAuthStore(state => ({
    currentUser: state.currentUser,
    logout: state.logout,
  }));

  useEffect(() => {
    if (isSmallScreen) setExpanded(false);
    else setExpanded(true);
  }, [isSmallScreen]);


  if (!currentUser) {
    return <div>No user is currently logged in.</div>;
  }

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <NavLink to='/'>
            <img
              src="https://edenred.ae/wp-content/uploads/2021/02/Logo_Edenred_Digital-use.svg"
              className={`overflow-hidden transition-all ${expanded ? 'w-20' : 'w-0'}`}
              alt=""
            />
          </NavLink>
          <button
            onClick={() => setExpanded(curr => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>
        <div className="border-t flex p-3">
          <img
            src={`https://ui-avatars.com/api/?name=${currentUser.name}&background=c7d2fe&color=3730a3&bold=true`}
            alt=""
            className="w-10 h-10 rounded-md"
          />
          <div className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? 'w-52 ml-3' : 'w-0'}`}>
            <div className="leading-4">
              <h4 className="font-semibold">{currentUser!.name}</h4>
              <span className="text-xs text-gray-600">{currentUser!.email}</span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="outline" onClick={() => logout()} className='hover:scale-110'>
                    <LogOut color="#f43f5e" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className='bg-foreground'>
                  Logout
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export const SidebarItem = ({ icon, text, link, alert }: SidebarItemProps) => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('SidebarItem must be used within a SidebarContext.Provider');
  }
  const { expanded } = context;

  return (
    <li className={`relative flex items-center px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group mt-4`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <NavLink
              to={link}
              className={({ isActive }) =>
                `flex px-2 py-2 rounded-md items-center w-full ${isActive ? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-rose-500' : 'text-gray-600 hover:bg-indigo-50'}`
              }
            >
              {icon}
              <span className={`overflow-hidden transition-all ${expanded ? 'w-52 ml-3' : 'w-0'}`}>
                {text}
              </span>
            </NavLink>
            {alert && <div className={`absolute right-2 w-2 h-2 rounded-full bg-red-500 ${expanded ? '' : 'top-2'}`} />}
          </TooltipTrigger>
          {!expanded ? <TooltipContent>
            <p>{text}</p>
          </TooltipContent> : ''}
        </Tooltip>
      </TooltipProvider>
    </li>
  );
};


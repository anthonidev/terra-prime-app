'use client';

import * as React from 'react';

type Props = {
  children?: React.ReactNode;
};

type ISidebarContext = {
  isOpen: boolean;
  isCollapsed: boolean;
  toggleSidebar: () => void;
  toggleCollapse: () => void;
};

const SidebarContext = React.createContext<ISidebarContext>({
  isOpen: false,
  isCollapsed: false,
  toggleSidebar: () => {},
  toggleCollapse: () => {}
});

const SidebarProvider = ({ children }: Props) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = React.useState<boolean>(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <SidebarContext.Provider value={{ isOpen, isCollapsed, toggleSidebar, toggleCollapse }}>
      {children}
    </SidebarContext.Provider>
  );
};

export { SidebarContext, SidebarProvider };

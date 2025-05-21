import * as React from 'react';

type Props = {
  children?: React.ReactNode;
};

type ISidebarContext = {
  bSidebarOpen: boolean;
  setSidebarOpen: (state: boolean) => void;
};

const SidebarContext = React.createContext<ISidebarContext>({
  bSidebarOpen: true,
  setSidebarOpen: () => {}
});

const SidebarProvider = ({ children }: Props) => {
  const [bSidebarOpen, setSidebarOpen] = React.useState<boolean>(true);

  return (
    <SidebarContext.Provider value={{ bSidebarOpen, setSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export { SidebarContext, SidebarProvider };

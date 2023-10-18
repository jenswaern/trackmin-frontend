import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <main className="grid grid-cols-4 md:grid-cols-12 p-5 gap-x-5">
      {children}
    </main>
  );
};

export default MainLayout;

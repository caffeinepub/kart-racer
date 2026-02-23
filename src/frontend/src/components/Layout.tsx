import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-racing-blue via-racing-purple to-racing-pink">
      {children}
    </div>
  );
}

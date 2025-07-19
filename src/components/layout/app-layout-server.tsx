import { MobileLayoutManager } from './mobile-layout-manager';

interface AppLayoutServerProps {
  children: React.ReactNode;
}

export function AppLayoutServer({ children }: AppLayoutServerProps) {
  return (
    <>
      {/* Mobile Layout Manager handles all layout */}
      <MobileLayoutManager>{children}</MobileLayoutManager>
    </>
  );
}

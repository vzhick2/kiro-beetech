import { usePathname } from 'next/navigation';

export function usePageTitle() {
  const pathname = usePathname();

  const getPageTitle = () => {
    switch (pathname) {
      case '/':
        return 'Dashboard';
      case '/items':
        return 'Items';
      case '/purchases':
        return 'Purchases';
      case '/recipes':
        return 'Recipes';
      case '/batches':
        return 'Batches';
      case '/sales':
        return 'Sales';
      case '/reports':
        return 'Reports';
      case '/data':
        return 'Data';
      case '/suppliers':
        return 'Suppliers';
      case '/products':
        return 'Products';
      case '/search':
        return 'Search';
      case '/import-export':
        return 'Import/Export';
      case '/test-connection':
        return 'Test Connection';
      default:
        // Handle nested routes
        if (pathname.startsWith('/items/')) {
          return 'Items';
        }
        if (pathname.startsWith('/purchases/')) {
          return 'Purchases';
        }
        if (pathname.startsWith('/recipes/')) {
          return 'Recipes';
        }
        if (pathname.startsWith('/batches/')) {
          return 'Batches';
        }
        if (pathname.startsWith('/sales/')) {
          return 'Sales';
        }
        if (pathname.startsWith('/reports/')) {
          return 'Reports';
        }
        if (pathname.startsWith('/data/')) {
          return 'Data';
        }
        if (pathname.startsWith('/suppliers/')) {
          return 'Suppliers';
        }
        if (pathname.startsWith('/products/')) {
          return 'Products';
        }
        if (pathname.startsWith('/search/')) {
          return 'Search';
        }
        if (pathname.startsWith('/import-export/')) {
          return 'Import/Export';
        }
        if (pathname.startsWith('/test-connection/')) {
          return 'Test Connection';
        }
        return 'Dashboard';
    }
  };

  return getPageTitle();
}

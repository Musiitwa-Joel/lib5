import { useState } from 'react';
import {
  BookOpen,
  GraduationCap,
  Library,
  Menu,
  Moon,
  Settings,
  Sun,
  Users,
  BookCopy,
  Receipt,
  BarChart3,
  Bell,
  FileText,
  AlertCircle,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { DashboardStats } from '@/components/dashboard-stats';
import { ClearancePage } from '@/components/clearance/clearance-page';
import { BooksPage } from '@/components/books/books-page';
import { BorrowingPage } from '@/components/borrowing/borrowing-page';
import { PastPapersPage } from '@/components/past-papers/past-papers-page';
import { FinesPage } from '@/components/fines/fines-page';
import { ReportsPage } from '@/components/reports/reports-page';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

type ActivePage = 'dashboard' | 'books' | 'borrowings' | 'clearance' | 'digital' | 'fines' | 'reports' | 'past-papers';

// Mock notifications for demo
const notifications = [
  {
    id: 1,
    type: 'warning',
    message: '15 books are overdue today',
    time: '2 hours ago',
  },
  {
    id: 2,
    type: 'info',
    message: 'New past papers uploaded for Computer Science',
    time: '3 hours ago',
  },
  {
    id: 3,
    type: 'success',
    message: 'System backup completed successfully',
    time: '5 hours ago',
  },
];

export function Dashboard() {
  const { theme, setTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [alerts, setAlerts] = useState(notifications);

  const renderContent = () => {
    switch (activePage) {
      case 'books':
        return <BooksPage />;
      case 'borrowings':
        return <BorrowingPage />;
      case 'clearance':
        return <ClearancePage />;
      case 'past-papers':
        return <PastPapersPage />;
      case 'fines':
        return <FinesPage />;
      case 'reports':
        return <ReportsPage />;
      default:
        return (
          <div className="p-6">
            <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
            <DashboardStats />
            
            {/* Quick Actions Section */}
            <div className="mt-8">
              <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <Button
                  variant="outline"
                  className="h-auto p-4 text-left"
                  onClick={() => setActivePage('books')}
                >
                  <BookOpen className="mb-2 h-6 w-6" />
                  <div>
                    <h3 className="font-medium">Add New Book</h3>
                    <p className="text-sm text-muted-foreground">
                      Register a new book in the system
                    </p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 text-left"
                  onClick={() => setActivePage('past-papers')}
                >
                  <FileText className="mb-2 h-6 w-6" />
                  <div>
                    <h3 className="font-medium">Upload Past Papers</h3>
                    <p className="text-sm text-muted-foreground">
                      Add new examination papers
                    </p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 text-left"
                  onClick={() => setActivePage('reports')}
                >
                  <BarChart3 className="mb-2 h-6 w-6" />
                  <div>
                    <h3 className="font-medium">Generate Report</h3>
                    <p className="text-sm text-muted-foreground">
                      Create custom analytics reports
                    </p>
                  </div>
                </Button>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="mt-8">
              <h2 className="mb-4 text-xl font-semibold">Recent Activities</h2>
              <div className="rounded-lg border bg-card">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b p-4 last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">New book added</p>
                        <p className="text-sm text-muted-foreground">
                          "Clean Code" by Robert C. Martin
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">2h ago</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  const dismissAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 z-40 h-screen w-64 transform border-r bg-card transition-transform duration-200 ease-in-out',
          !isSidebarOpen && '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b bg-primary px-4">
          <div className="flex items-center space-x-2">
            <Library className="h-6 w-6 text-primary-foreground" />
            <span className="font-semibold text-primary-foreground">Nkumba Library</span>
          </div>
        </div>
        <nav className="space-y-1 p-4">
          <Button
            variant={activePage === 'dashboard' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActivePage('dashboard')}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button
            variant={activePage === 'books' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActivePage('books')}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Books
          </Button>
          <Button
            variant={activePage === 'borrowings' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActivePage('borrowings')}
          >
            <Users className="mr-2 h-4 w-4" />
            Borrowings
          </Button>
          <Button
            variant={activePage === 'past-papers' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActivePage('past-papers')}
          >
            <FileText className="mr-2 h-4 w-4" />
            Past Papers
          </Button>
          <Button
            variant={activePage === 'clearance' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActivePage('clearance')}
          >
            <GraduationCap className="mr-2 h-4 w-4" />
            Clearance
          </Button>
          <Button
            variant={activePage === 'fines' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActivePage('fines')}
          >
            <Receipt className="mr-2 h-4 w-4" />
            Fines
          </Button>
          <Button
            variant={activePage === 'reports' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActivePage('reports')}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Reports
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div
        className={cn(
          'transition-margin duration-200 ease-in-out',
          isSidebarOpen ? 'ml-64' : 'ml-0'
        )}
      >
        {/* Top Bar */}
        <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card px-4 shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Alerts Section */}
          <div className="flex items-center space-x-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {alerts.length > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-white">
                      {alerts.length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Notifications</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-start space-x-4">
                        <div className={cn(
                          "rounded-full p-2",
                          alert.type === 'warning' && "bg-yellow-100",
                          alert.type === 'info' && "bg-blue-100",
                          alert.type === 'success' && "bg-green-100"
                        )}>
                          <AlertCircle className={cn(
                            "h-4 w-4",
                            alert.type === 'warning' && "text-yellow-600",
                            alert.type === 'info' && "text-blue-600",
                            alert.type === 'success' && "text-green-600"
                          )} />
                        </div>
                        <div>
                          <p className="font-medium">{alert.message}</p>
                          <p className="text-sm text-muted-foreground">{alert.time}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => dismissAlert(alert.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="@admin" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Admin</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      admin@library.nkumba.edu
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Page Content */}
        {renderContent()}
      </div>
    </div>
  );
}
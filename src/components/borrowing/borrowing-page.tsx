import { useState } from 'react';
import { Search, BookCheck, AlertCircle, Plus, Library } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { BorrowRecord, Book, Student } from '@/lib/types';

// Mock available books
const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '978-0743273565',
    category: 'Fiction',
    status: 'available',
    location: 'Section A-12',
    addedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: '1984',
    author: 'George Orwell',
    isbn: '978-0451524935',
    category: 'Fiction',
    status: 'available',
    location: 'Section B-3',
    addedAt: new Date('2024-01-20'),
  },
];

// Mock students
const mockStudents: Student[] = [
  {
    id: '1',
    registrationNumber: 'NKU/2020/1234',
    name: 'John Doe',
    email: 'john.doe@student.nkumba.edu',
    faculty: 'Computing and Technology',
    course: 'Bachelor of Science in Software Engineering',
    graduationYear: 2024,
  },
  {
    id: '2',
    registrationNumber: 'NKU/2020/5678',
    name: 'Jane Smith',
    email: 'jane.smith@student.nkumba.edu',
    faculty: 'Business Administration',
    course: 'Bachelor of Business Administration',
    graduationYear: 2024,
  },
];

// Mock borrowings
const mockBorrowings: (BorrowRecord & { book: Book; student: Student })[] = [
  {
    id: '1',
    bookId: '1',
    studentId: '1',
    borrowDate: new Date('2024-03-01'),
    dueDate: new Date('2024-03-15'),
    status: 'active',
    book: mockBooks[0],
    student: mockStudents[0],
  },
];

const FINE_RATE_PER_DAY = 1000; // UGX 1,000 per day
const BORROW_DURATION_DAYS = 14; // 2 weeks default borrowing period

export function BorrowingPage() {
  const { toast } = useToast();
  const [borrowings, setBorrowings] = useState(mockBorrowings);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BorrowRecord['status'] | 'all'>('all');
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [isNewBorrowingOpen, setIsNewBorrowingOpen] = useState(false);
  const [selectedBorrowing, setSelectedBorrowing] = useState<(typeof mockBorrowings)[0] | null>(null);
  
  // New borrowing form state
  const [newBorrowing, setNewBorrowing] = useState({
    studentId: '',
    bookId: '',
  });

  // Get available books (not borrowed)
  const availableBooks = mockBooks.filter(book => 
    book.status === 'available' || 
    (book.status === 'borrowed' && borrowings.every(b => b.bookId !== book.id || b.status === 'returned'))
  );

  // Filter borrowings based on search and status
  const filteredBorrowings = borrowings.filter((borrowing) => {
    const matchesSearch =
      borrowing.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      borrowing.student.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      borrowing.book.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || borrowing.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const calculateFine = (borrowing: BorrowRecord) => {
    if (borrowing.status !== 'overdue') return 0;
    
    const today = new Date();
    const dueDate = new Date(borrowing.dueDate);
    const daysOverdue = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return Math.max(0, daysOverdue * FINE_RATE_PER_DAY);
  };

  const handleReturn = () => {
    if (!selectedBorrowing) return;

    const fine = calculateFine(selectedBorrowing);
    const returnDate = new Date();

    setBorrowings(borrowings.map(borrowing =>
      borrowing.id === selectedBorrowing.id
        ? {
            ...borrowing,
            status: 'returned',
            returnDate,
            fine,
          }
        : borrowing
    ));

    toast({
      title: 'Book Returned Successfully',
      description: fine > 0
        ? `Fine of UGX ${fine.toLocaleString()} has been recorded.`
        : 'No fines were charged.',
    });

    setIsReturnDialogOpen(false);
    setSelectedBorrowing(null);
  };

  const handleCreateBorrowing = () => {
    if (!newBorrowing.studentId || !newBorrowing.bookId) {
      toast({
        title: 'Error',
        description: 'Please select both a student and a book.',
        variant: 'destructive',
      });
      return;
    }

    const student = mockStudents.find(s => s.id === newBorrowing.studentId);
    const book = mockBooks.find(b => b.id === newBorrowing.bookId);

    if (!student || !book) {
      toast({
        title: 'Error',
        description: 'Invalid student or book selection.',
        variant: 'destructive',
      });
      return;
    }

    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + BORROW_DURATION_DAYS);

    const newRecord: (typeof mockBorrowings)[0] = {
      id: Math.random().toString(36).substr(2, 9),
      bookId: book.id,
      studentId: student.id,
      borrowDate,
      dueDate,
      status: 'active',
      book: { ...book, status: 'borrowed' },
      student,
    };

    setBorrowings([newRecord, ...borrowings]);
    setIsNewBorrowingOpen(false);
    setNewBorrowing({ studentId: '', bookId: '' });

    toast({
      title: 'Success',
      description: 'Book borrowed successfully.',
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Borrowings & Returns</h1>
        <Button onClick={() => setIsNewBorrowingOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Borrowing
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by student name, registration number, or book title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="returned">Returned</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Book</TableHead>
              <TableHead>Borrow Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Fine</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBorrowings.map((borrowing) => (
              <TableRow key={borrowing.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{borrowing.student.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {borrowing.student.registrationNumber}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{borrowing.book.title}</div>
                    <div className="text-sm text-muted-foreground">
                      by {borrowing.book.author}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{borrowing.borrowDate.toLocaleDateString()}</TableCell>
                <TableCell>{borrowing.dueDate.toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                    ${borrowing.status === 'active' ? 'bg-blue-100 text-blue-800' :
                    borrowing.status === 'returned' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'}`}>
                    {borrowing.status.charAt(0).toUpperCase() + borrowing.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>
                  {borrowing.fine
                    ? `UGX ${borrowing.fine.toLocaleString()}`
                    : calculateFine(borrowing) > 0
                    ? `UGX ${calculateFine(borrowing).toLocaleString()}`
                    : '-'}
                </TableCell>
                <TableCell>
                  {borrowing.status !== 'returned' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedBorrowing(borrowing);
                        setIsReturnDialogOpen(true);
                      }}
                    >
                      Return
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* New Borrowing Dialog */}
      <Dialog open={isNewBorrowingOpen} onOpenChange={setIsNewBorrowingOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>New Borrowing</DialogTitle>
            <DialogDescription>
              Create a new borrowing record by selecting a student and an available book.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="student">Student</label>
              <Select
                value={newBorrowing.studentId}
                onValueChange={(value) => setNewBorrowing({ ...newBorrowing, studentId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a student" />
                </SelectTrigger>
                <SelectContent>
                  {mockStudents.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} ({student.registrationNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label htmlFor="book">Book</label>
              <Select
                value={newBorrowing.bookId}
                onValueChange={(value) => setNewBorrowing({ ...newBorrowing, bookId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a book" />
                </SelectTrigger>
                <SelectContent>
                  {availableBooks.map((book) => (
                    <SelectItem key={book.id} value={book.id}>
                      {book.title} by {book.author}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-2 rounded-lg bg-muted p-4">
              <div className="flex items-center gap-2">
                <Library className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Books can be borrowed for {BORROW_DURATION_DAYS} days.
                  Late returns will incur a fine of UGX {FINE_RATE_PER_DAY.toLocaleString()} per day.
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewBorrowingOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateBorrowing}>
              Create Borrowing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Return Book Dialog */}
      <Dialog open={isReturnDialogOpen} onOpenChange={setIsReturnDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Return Book</DialogTitle>
            <DialogDescription>
              Confirm the return of this book and review any applicable fines.
            </DialogDescription>
          </DialogHeader>

          {selectedBorrowing && (
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="grid gap-2">
                  <div className="grid grid-cols-2">
                    <span className="font-medium">Book:</span>
                    <span>{selectedBorrowing.book.title}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="font-medium">Student:</span>
                    <span>{selectedBorrowing.student.name}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="font-medium">Due Date:</span>
                    <span>{selectedBorrowing.dueDate.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {calculateFine(selectedBorrowing) > 0 && (
                <div className="rounded-lg bg-destructive/10 p-4">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium">
                      Fine Amount: UGX {calculateFine(selectedBorrowing).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    This book is overdue. The fine has been calculated at UGX {FINE_RATE_PER_DAY.toLocaleString()} per day.
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsReturnDialogOpen(false);
                setSelectedBorrowing(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleReturn}>
              <BookCheck className="mr-2 h-4 w-4" />
              Confirm Return
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
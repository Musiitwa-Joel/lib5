import { useState } from 'react';
import { Book, Plus, Trash2, AlertCircle, Search, Filter, BookCheck } from 'lucide-react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Book as BookType } from '@/lib/types';
import { Label } from '@/components/ui/label';

const ITEMS_PER_PAGE = 10;

// Book categories
const BOOK_CATEGORIES = [
  'Fiction',
  'Non-Fiction',
  'Science',
  'Technology',
  'Business',
  'Arts',
  'History',
  'Philosophy',
  'Mathematics',
  'Engineering',
] as const;

// Mock books with more realistic data
const mockBooks: BookType[] = [
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
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    isbn: '978-0262033848',
    category: 'Technology',
    status: 'borrowed',
    location: 'Section B-03',
    addedAt: new Date('2024-02-01'),
  },
  {
    id: '3',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isbn: '978-0132350884',
    category: 'Technology',
    status: 'available',
    location: 'Section B-04',
    addedAt: new Date('2024-02-15'),
  },
];

// ISBN validation
const isValidISBN = (isbn: string) => {
  // Basic ISBN-13 format validation
  const isbnRegex = /^(?:\d{3}-)?\d{10}|\d{13}$/;
  return isbnRegex.test(isbn.replace(/-/g, ''));
};

export function BooksPage() {
  const { toast } = useToast();
  const [books, setBooks] = useState<BookType[]>(mockBooks);
  const [selectedBooks, setSelectedBooks] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<BookType['status'] | 'all'>('all');
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<BookType | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // New book form state
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    location: '',
  });

  // Validate form
  const validateForm = (book: typeof newBook) => {
    const errors: Record<string, string> = {};

    if (!book.title.trim()) {
      errors.title = 'Title is required';
    }
    if (!book.author.trim()) {
      errors.author = 'Author is required';
    }
    if (!book.isbn.trim()) {
      errors.isbn = 'ISBN is required';
    } else if (!isValidISBN(book.isbn)) {
      errors.isbn = 'Invalid ISBN format';
    }
    if (!book.category) {
      errors.category = 'Category is required';
    }
    if (!book.location.trim()) {
      errors.location = 'Location is required';
    }

    return errors;
  };

  // Filter books based on search, category, and status
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.includes(searchQuery);

    const matchesCategory = categoryFilter === 'all' || book.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || book.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBooks(new Set(paginatedBooks.map(book => book.id)));
    } else {
      setSelectedBooks(new Set());
    }
  };

  const handleSelectBook = (bookId: string, checked: boolean) => {
    const newSelected = new Set(selectedBooks);
    if (checked) {
      newSelected.add(bookId);
    } else {
      newSelected.delete(bookId);
    }
    setSelectedBooks(newSelected);
  };

  const handleAddBook = () => {
    const errors = validateForm(newBook);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const book: BookType = {
      id: Math.random().toString(36).substr(2, 9),
      ...newBook,
      status: 'available',
      addedAt: new Date(),
    };

    setBooks([book, ...books]);
    setIsAddBookOpen(false);
    setNewBook({
      title: '',
      author: '',
      isbn: '',
      category: '',
      location: '',
    });
    setFormErrors({});

    toast({
      title: 'Success',
      description: 'Book added successfully',
    });
  };

  const handleUpdateBook = () => {
    if (!editingBook) return;

    const errors = validateForm(editingBook);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setBooks(books.map(book => 
      book.id === editingBook.id ? editingBook : book
    ));
    setEditingBook(null);
    setFormErrors({});
    
    toast({
      title: 'Success',
      description: 'Book updated successfully',
    });
  };

  const handleDeleteBooks = () => {
    setBooks(books.filter(book => !selectedBooks.has(book.id)));
    setSelectedBooks(new Set());
    setIsDeleteDialogOpen(false);

    toast({
      title: 'Success',
      description: `${selectedBooks.size} book(s) deleted successfully`,
      variant: 'destructive',
    });
  };

  const handleStatusChange = (status: BookType['status']) => {
    setBooks(books.map(book => 
      selectedBooks.has(book.id) ? { ...book, status } : book
    ));
    setSelectedBooks(new Set());

    toast({
      title: 'Success',
      description: `Status updated for ${selectedBooks.size} book(s)`,
    });
  };

  const renderFormField = (
    label: string,
    id: string,
    value: string,
    onChange: (value: string) => void,
    error?: string,
    type: 'input' | 'select' = 'input'
  ) => (
    <div className="grid gap-2">
      <Label htmlFor={id} className="font-medium">
        {label}
      </Label>
      {type === 'input' ? (
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={error ? 'border-destructive' : ''}
        />
      ) : (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className={error ? 'border-destructive' : ''}>
            <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {BOOK_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {error && (
        <span className="text-sm text-destructive">{error}</span>
      )}
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Books Management</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your library's book collection
          </p>
        </div>
        <Button onClick={() => setIsAddBookOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Book
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search books by title, author, or ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {BOOK_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
            <SelectTrigger className="w-[150px]">
              <BookCheck className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="borrowed">Borrowed</SelectItem>
              <SelectItem value="damaged">Damaged</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {selectedBooks.size > 0 && (
          <div className="flex items-center gap-2">
            <Select onValueChange={handleStatusChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Update status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="borrowed">Borrowed</SelectItem>
                <SelectItem value="damaged">Damaged</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    paginatedBooks.length > 0 &&
                    paginatedBooks.every(book => selectedBooks.has(book.id))
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>ISBN</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Added Date</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedBooks.map((book) => (
              <TableRow key={book.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedBooks.has(book.id)}
                    onCheckedChange={(checked) => handleSelectBook(book.id, checked)}
                  />
                </TableCell>
                <TableCell>
                  <div className="font-medium">{book.title}</div>
                </TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>
                  <span className="font-mono text-sm">{book.isbn}</span>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {book.category}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                    ${book.status === 'available' ? 'bg-green-100 text-green-800' :
                    book.status === 'borrowed' ? 'bg-blue-100 text-blue-800' :
                    book.status === 'damaged' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'}`}>
                    {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>{book.location}</TableCell>
                <TableCell>{book.addedAt.toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingBook(book)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredBooks.length)} of {filteredBooks.length} books
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Add/Edit Book Dialog */}
      <Dialog
        open={isAddBookOpen || !!editingBook}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddBookOpen(false);
            setEditingBook(null);
            setFormErrors({});
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingBook ? 'Edit Book' : 'Add New Book'}
            </DialogTitle>
            <DialogDescription>
              {editingBook
                ? 'Update the book details below.'
                : 'Enter the details of the new book.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {renderFormField(
              'Title',
              'title',
              editingBook?.title ?? newBook.title,
              (value) => {
                if (editingBook) {
                  setEditingBook({ ...editingBook, title: value });
                } else {
                  setNewBook({ ...newBook, title: value });
                }
              },
              formErrors.title
            )}
            {renderFormField(
              'Author',
              'author',
              editingBook?.author ?? newBook.author,
              (value) => {
                if (editingBook) {
                  setEditingBook({ ...editingBook, author: value });
                } else {
                  setNewBook({ ...newBook, author: value });
                }
              },
              formErrors.author
            )}
            {renderFormField(
              'ISBN',
              'isbn',
              editingBook?.isbn ?? newBook.isbn,
              (value) => {
                if (editingBook) {
                  setEditingBook({ ...editingBook, isbn: value });
                } else {
                  setNewBook({ ...newBook, isbn: value });
                }
              },
              formErrors.isbn
            )}
            {renderFormField(
              'Category',
              'category',
              editingBook?.category ?? newBook.category,
              (value) => {
                if (editingBook) {
                  setEditingBook({ ...editingBook, category: value });
                } else {
                  setNewBook({ ...newBook, category: value });
                }
              },
              formErrors.category,
              'select'
            )}
            {renderFormField(
              'Location',
              'location',
              editingBook?.location ?? newBook.location,
              (value) => {
                if (editingBook) {
                  setEditingBook({ ...editingBook, location: value });
                } else {
                  setNewBook({ ...newBook, location: value });
                }
              },
              formErrors.location
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddBookOpen(false);
                setEditingBook(null);
                setFormErrors({});
              }}
            >
              Cancel
            </Button>
            <Button onClick={editingBook ? handleUpdateBook : handleAddBook}>
              {editingBook ? 'Update Book' : 'Add Book'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Books</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedBooks.size} selected books?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteBooks}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
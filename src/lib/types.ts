export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  status: 'available' | 'borrowed' | 'damaged' | 'lost';
  location: string;
  addedAt: Date;
}

export interface Student {
  id: string;
  registrationNumber: string;
  name: string;
  email: string;
  faculty: string;
  course: string;
  graduationYear: number;
}

export interface BorrowRecord {
  id: string;
  bookId: string;
  studentId: string;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: 'active' | 'returned' | 'overdue';
  fine?: number;
}

export interface ClearanceRequest {
  id: string;
  studentId: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
  hasPendingBooks: boolean;
  hasUnpaidFines: boolean;
}
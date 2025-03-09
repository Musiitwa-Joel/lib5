import { useState } from 'react';
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ClearanceRequest, Student } from '@/lib/types';

const mockData: (ClearanceRequest & { student: Student })[] = [
  {
    id: '1',
    studentId: '1',
    status: 'pending',
    submittedAt: new Date('2024-03-20'),
    hasPendingBooks: false,
    hasUnpaidFines: false,
    student: {
      id: '1',
      registrationNumber: 'NKU/2020/1234',
      name: 'John Doe',
      email: 'john.doe@student.nkumba.edu',
      faculty: 'Computing and Technology',
      course: 'Bachelor of Science in Software Engineering',
      graduationYear: 2024,
    },
  },
  // Add more mock data as needed
];

interface ClearanceTableProps {
  searchQuery: string;
}

export function ClearanceTable({ searchQuery }: ClearanceTableProps) {
  const [selectedRequest, setSelectedRequest] = useState<(ClearanceRequest & { student: Student }) | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const filteredData = mockData.filter((item) =>
    item.student.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: ClearanceRequest['status']) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const handleApprove = () => {
    // Implement approval logic
    setSelectedRequest(null);
  };

  const handleReject = () => {
    // Implement rejection logic
    setSelectedRequest(null);
    setRejectionReason('');
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Registration No.</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Submitted Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Issues</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.student.registrationNumber}</TableCell>
                <TableCell>{request.student.name}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {request.student.course}
                </TableCell>
                <TableCell>
                  {request.submittedAt.toLocaleDateString()}
                </TableCell>
                <TableCell>{getStatusBadge(request.status)}</TableCell>
                <TableCell>
                  {request.hasPendingBooks && (
                    <Badge variant="destructive" className="mr-1">
                      Pending Books
                    </Badge>
                  )}
                  {request.hasUnpaidFines && (
                    <Badge variant="destructive">Unpaid Fines</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedRequest(request)}
                  >
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Review Clearance Request</DialogTitle>
            <DialogDescription>
              Review and update the clearance status for this student.
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <h4 className="font-medium">Student Details</h4>
                <div className="text-sm">
                  <p><strong>Name:</strong> {selectedRequest.student.name}</p>
                  <p><strong>Registration:</strong> {selectedRequest.student.registrationNumber}</p>
                  <p><strong>Course:</strong> {selectedRequest.student.course}</p>
                </div>
              </div>

              <div className="grid gap-2">
                <h4 className="font-medium">Issues</h4>
                <div className="space-y-2">
                  {selectedRequest.hasPendingBooks && (
                    <div className="flex items-center text-sm text-destructive">
                      ⚠️ Student has pending books
                    </div>
                  )}
                  {selectedRequest.hasUnpaidFines && (
                    <div className="flex items-center text-sm text-destructive">
                      ⚠️ Student has unpaid fines
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <h4 className="font-medium">Rejection Reason (if applicable)</h4>
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter reason for rejection..."
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedRequest(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={!rejectionReason}
                >
                  Reject
                </Button>
                <Button
                  onClick={handleApprove}
                  disabled={selectedRequest.hasPendingBooks || selectedRequest.hasUnpaidFines}
                >
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
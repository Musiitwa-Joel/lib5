import { useState } from "react";
import {
  Receipt,
  Search,
  CreditCard,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input as NumberInput } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Fine {
  id: string;
  studentId: string;
  studentName: string;
  registrationNumber: string;
  amount: number;
  reason: string;
  status: "pending" | "paid" | "waived";
  dueDate: Date;
  createdAt: Date;
  paidAt?: Date;
  paymentMethod?: string;
  transactionId?: string;
}

const mockFines: Fine[] = [
  {
    id: "1",
    studentId: "1",
    studentName: "John Doe",
    registrationNumber: "NKU/2020/1234",
    amount: 15000,
    reason: 'Overdue book: "Clean Code"',
    status: "pending",
    dueDate: new Date("2024-04-15"),
    createdAt: new Date("2024-03-15"),
  },
  {
    id: "2",
    studentId: "2",
    studentName: "Jane Smith",
    registrationNumber: "NKU/2020/5678",
    amount: 25000,
    reason: 'Lost book: "Design Patterns"',
    status: "paid",
    dueDate: new Date("2024-03-30"),
    createdAt: new Date("2024-03-10"),
    paidAt: new Date("2024-03-25"),
    paymentMethod: "TredPay",
    transactionId: "TXN123456",
  },
];

export function FinesPage() {
  const { toast } = useToast();
  const [fines, setFines] = useState<Fine[]>(mockFines);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedFine, setSelectedFine] = useState<Fine | null>(null);
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false);
  const [adjustmentAmount, setAdjustmentAmount] = useState("");

  // Calculate total statistics
  const totalPending = fines
    .filter((f) => f.status === "pending")
    .reduce((sum, fine) => sum + fine.amount, 0);
  const totalCollected = fines
    .filter((f) => f.status === "paid")
    .reduce((sum, fine) => sum + fine.amount, 0);
  const totalWaived = fines
    .filter((f) => f.status === "waived")
    .reduce((sum, fine) => sum + fine.amount, 0);

  const filteredFines = fines.filter((fine) => {
    const matchesSearch =
      fine.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fine.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || fine.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handlePayment = () => {
    if (!selectedFine) return;

    // Simulate payment processing
    const updatedFines = fines.map((fine) =>
      fine.id === selectedFine.id
        ? {
            ...fine,
            status: "paid",
            paidAt: new Date(),
            paymentMethod: "TredPay",
            transactionId: `TXN${Math.random()
              .toString(36)
              .substr(2, 6)
              .toUpperCase()}`,
          }
        : fine
    );

    setFines(updatedFines);
    setIsPaymentDialogOpen(false);
    setSelectedFine(null);

    toast({
      title: "Payment Successful",
      description: `Payment of UGX ${selectedFine.amount.toLocaleString()} processed successfully.`,
    });
  };

  const handleAdjustFine = () => {
    if (!selectedFine || !adjustmentAmount) return;

    const newAmount = parseInt(adjustmentAmount);
    if (isNaN(newAmount) || newAmount < 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount.",
        variant: "destructive",
      });
      return;
    }

    const updatedFines = fines.map((fine) =>
      fine.id === selectedFine.id
        ? {
            ...fine,
            amount: newAmount,
          }
        : fine
    );

    setFines(updatedFines);
    setIsAdjustDialogOpen(false);
    setSelectedFine(null);
    setAdjustmentAmount("");

    toast({
      title: "Fine Adjusted",
      description: `Fine amount updated to UGX ${newAmount.toLocaleString()}.`,
    });
  };

  const handleWaiveFine = (fine: Fine) => {
    const updatedFines = fines.map((f) =>
      f.id === fine.id
        ? {
            ...f,
            status: "waived",
          }
        : f
    );

    setFines(updatedFines);

    toast({
      title: "Fine Waived",
      description: `Fine of UGX ${fine.amount.toLocaleString()} has been waived.`,
    });
  };

  const handleGenerateReceipt = (fine: Fine) => {
    toast({
      title: "Receipt Generated",
      description: "Receipt has been generated and is ready for download.",
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Fines & Penalties</h1>
        <p className="mt-2 text-muted-foreground">
          Manage student fines and process payments
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Fines</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              UGX {totalPending.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Collected
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              UGX {totalCollected.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waived Fines</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              UGX {totalWaived.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total amount waived</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by student name or registration number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="waived">Waived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment Details</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFines.map((fine) => (
              <TableRow key={fine.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{fine.studentName}</div>
                    <div className="text-sm text-muted-foreground">
                      {fine.registrationNumber}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    UGX {fine.amount.toLocaleString()}
                  </div>
                </TableCell>
                <TableCell>{fine.reason}</TableCell>
                <TableCell>{fine.dueDate.toLocaleDateString()}</TableCell>
                <TableCell>
                  <div
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                    ${
                      fine.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : fine.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {fine.status.charAt(0).toUpperCase() + fine.status.slice(1)}
                  </div>
                </TableCell>
                <TableCell>
                  {fine.status === "paid" && (
                    <div className="text-sm">
                      <div>{fine.paymentMethod}</div>
                      <div className="text-muted-foreground">
                        {fine.transactionId}
                      </div>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end space-x-2">
                    {fine.status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedFine(fine);
                            setIsPaymentDialogOpen(true);
                          }}
                        >
                          <CreditCard className="mr-2 h-4 w-4" />
                          Pay
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedFine(fine);
                            setIsAdjustDialogOpen(true);
                          }}
                        >
                          Adjust
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleWaiveFine(fine)}
                        >
                          Waive
                        </Button>
                      </>
                    )}
                    {fine.status === "paid" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateReceipt(fine)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Receipt
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
            <DialogDescription>
              Complete the payment using TredPay integration.
            </DialogDescription>
          </DialogHeader>

          {selectedFine && (
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="grid gap-2">
                  <div className="grid grid-cols-2">
                    <span className="font-medium">Student:</span>
                    <span>{selectedFine.studentName}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="font-medium">Amount:</span>
                    <span>UGX {selectedFine.amount.toLocaleString()}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="font-medium">Due Date:</span>
                    <span>{selectedFine.dueDate.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Payment will be processed securely via TredPay
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsPaymentDialogOpen(false);
                setSelectedFine(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handlePayment}>Process Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Adjust Fine Dialog */}
      <Dialog open={isAdjustDialogOpen} onOpenChange={setIsAdjustDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Fine Amount</DialogTitle>
            <DialogDescription>
              Modify the fine amount for this student.
            </DialogDescription>
          </DialogHeader>

          {selectedFine && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Current Amount</Label>
                <div className="rounded-lg bg-muted p-2 text-center text-lg font-medium">
                  UGX {selectedFine.amount.toLocaleString()}
                </div>
              </div>

              <div className="grid gap-2">
                <Label>New Amount</Label>
                <NumberInput
                  type="number"
                  value={adjustmentAmount}
                  onChange={(e) => setAdjustmentAmount(e.target.value)}
                  placeholder="Enter new amount"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAdjustDialogOpen(false);
                setSelectedFine(null);
                setAdjustmentAmount("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAdjustFine}>Update Amount</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

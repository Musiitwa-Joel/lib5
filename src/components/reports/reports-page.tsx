import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Download, FileSpreadsheet, File as FilePdf, Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// Mock data for charts
const borrowingData = [
  { month: 'Jan', borrowed: 65, returned: 45 },
  { month: 'Feb', borrowed: 75, returned: 60 },
  { month: 'Mar', borrowed: 85, returned: 70 },
  { month: 'Apr', borrowed: 95, returned: 85 },
  { month: 'May', borrowed: 80, returned: 65 },
  { month: 'Jun', borrowed: 70, returned: 55 },
];

const resourceUsageData = [
  { name: 'Textbooks', value: 45 },
  { name: 'Past Papers', value: 25 },
  { name: 'Digital Resources', value: 20 },
  { name: 'Journals', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const reportTypes = [
  { id: 'borrowing', name: 'Borrowing Statistics' },
  { id: 'overdue', name: 'Overdue Books' },
  { id: 'fines', name: 'Fines Collection' },
  { id: 'resources', name: 'Resource Usage' },
] as const;

const timeRanges = [
  { id: 'week', name: 'This Week' },
  { id: 'month', name: 'This Month' },
  { id: 'quarter', name: 'This Quarter' },
  { id: 'year', name: 'This Year' },
] as const;

export function ReportsPage() {
  const { toast } = useToast();
  const [selectedReport, setSelectedReport] = useState<string>('borrowing');
  const [timeRange, setTimeRange] = useState<string>('month');

  const handleExport = (format: 'pdf' | 'excel') => {
    toast({
      title: 'Export Started',
      description: `Exporting report as ${format.toUpperCase()}...`,
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="mt-2 text-muted-foreground">
            Generate and analyze library statistics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <FilePdf className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => handleExport('excel')}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Select value={selectedReport} onValueChange={setSelectedReport}>
          <SelectTrigger className="w-[200px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Select report type" />
          </SelectTrigger>
          <SelectContent>
            {reportTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <Calendar className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            {timeRanges.map((range) => (
              <SelectItem key={range.id} value={range.id}>
                {range.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Borrowing Statistics */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Borrowing Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={borrowingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="borrowed" name="Books Borrowed" fill="#0088FE" />
                  <Bar dataKey="returned" name="Books Returned" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Resource Usage Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Resource Usage Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={resourceUsageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {resourceUsageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Summary Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Summary Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Books
                  </p>
                  <p className="mt-2 text-2xl font-bold">2,350</p>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Borrowers
                  </p>
                  <p className="mt-2 text-2xl font-bold">145</p>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Overdue Books
                  </p>
                  <p className="mt-2 text-2xl font-bold text-destructive">23</p>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Fines Collected
                  </p>
                  <p className="mt-2 text-2xl font-bold">UGX 450K</p>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="font-medium">Top Borrowed Books</h3>
                <ul className="mt-2 space-y-2">
                  <li className="flex items-center justify-between">
                    <span>Clean Code</span>
                    <span className="text-muted-foreground">45 times</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Design Patterns</span>
                    <span className="text-muted-foreground">38 times</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Algorithms</span>
                    <span className="text-muted-foreground">32 times</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
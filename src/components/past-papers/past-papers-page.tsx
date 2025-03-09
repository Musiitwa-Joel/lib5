import { useState } from 'react';
import { FileText, Upload, Search, Filter, Download, Trash2 } from 'lucide-react';
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
import { Label } from '@/components/ui/label';

interface PastPaper {
  id: string;
  title: string;
  course: string;
  subject: string;
  year: number;
  semester: string;
  uploadedBy: string;
  uploadedAt: Date;
  downloads: number;
  fileSize: string;
}

const mockPapers: PastPaper[] = [
  {
    id: '1',
    title: 'Introduction to Programming Final Exam',
    course: 'Bachelor of Science in Software Engineering',
    subject: 'Programming Fundamentals',
    year: 2023,
    semester: 'First',
    uploadedBy: 'Dr. John Smith',
    uploadedAt: new Date('2024-01-15'),
    downloads: 145,
    fileSize: '2.3 MB',
  },
  {
    id: '2',
    title: 'Database Systems Mid-Term',
    course: 'Bachelor of Science in Software Engineering',
    subject: 'Database Management',
    year: 2023,
    semester: 'Second',
    uploadedBy: 'Prof. Jane Doe',
    uploadedAt: new Date('2024-02-01'),
    downloads: 98,
    fileSize: '1.8 MB',
  },
];

const COURSES = [
  'Bachelor of Science in Software Engineering',
  'Bachelor of Business Administration',
  'Bachelor of Arts in Education',
] as const;

const SUBJECTS = [
  'Programming Fundamentals',
  'Database Management',
  'Software Engineering',
  'Web Development',
  'Computer Networks',
] as const;

const YEARS = [2024, 2023, 2022, 2021, 2020] as const;
const SEMESTERS = ['First', 'Second', 'Third'] as const;

export function PastPapersPage() {
  const { toast } = useToast();
  const [papers, setPapers] = useState<PastPaper[]>(mockPapers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Filters
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [semesterFilter, setSemesterFilter] = useState<string>('all');

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    course: '',
    subject: '',
    year: '',
    semester: '',
  });

  // Filter papers based on search and filters
  const filteredPapers = papers.filter((paper) => {
    const matchesSearch =
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCourse = courseFilter === 'all' || paper.course === courseFilter;
    const matchesYear = yearFilter === 'all' || paper.year.toString() === yearFilter;
    const matchesSemester = semesterFilter === 'all' || paper.semester === semesterFilter;

    return matchesSearch && matchesCourse && matchesYear && matchesSemester;
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files);
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles || !uploadForm.course || !uploadForm.subject || !uploadForm.year || !uploadForm.semester) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields and select files to upload.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Add new papers to the list
    const newPapers: PastPaper[] = Array.from(selectedFiles).map((file, index) => ({
      id: Math.random().toString(36).substr(2, 9),
      title: file.name.replace(/\.[^/.]+$/, ''),
      course: uploadForm.course,
      subject: uploadForm.subject,
      year: parseInt(uploadForm.year),
      semester: uploadForm.semester,
      uploadedBy: 'Admin',
      uploadedAt: new Date(),
      downloads: 0,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
    }));

    setPapers([...newPapers, ...papers]);
    setIsUploadDialogOpen(false);
    setSelectedFiles(null);
    setUploadForm({
      course: '',
      subject: '',
      year: '',
      semester: '',
    });
    setUploading(false);

    toast({
      title: 'Success',
      description: `${newPapers.length} past paper(s) uploaded successfully.`,
    });
  };

  const handleDownload = (paper: PastPaper) => {
    // Simulate download
    toast({
      title: 'Download Started',
      description: `Downloading ${paper.title}...`,
    });
  };

  const handleDelete = (paperId: string) => {
    setPapers(papers.filter(paper => paper.id !== paperId));
    toast({
      title: 'Success',
      description: 'Past paper deleted successfully.',
      variant: 'destructive',
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Past Papers Management</h1>
          <p className="mt-2 text-muted-foreground">
            Upload and manage examination past papers
          </p>
        </div>
        <Button onClick={() => setIsUploadDialogOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Papers
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="w-[200px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {COURSES.map((course) => (
                <SelectItem key={course} value={course}>
                  {course}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {YEARS.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={semesterFilter} onValueChange={setSemesterFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Semesters</SelectItem>
              {SEMESTERS.map((semester) => (
                <SelectItem key={semester} value={semester}>
                  {semester}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Semester</TableHead>
              <TableHead>Downloads</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPapers.map((paper) => (
              <TableRow key={paper.id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{paper.title}</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {paper.course}
                </TableCell>
                <TableCell>{paper.subject}</TableCell>
                <TableCell>{paper.year}</TableCell>
                <TableCell>{paper.semester}</TableCell>
                <TableCell>{paper.downloads}</TableCell>
                <TableCell>{paper.fileSize}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{paper.uploadedAt.toLocaleDateString()}</div>
                    <div className="text-muted-foreground">
                      by {paper.uploadedBy}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(paper)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(paper.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload Past Papers</DialogTitle>
            <DialogDescription>
              Upload examination papers with their details. Supported formats: PDF, DOC, DOCX.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="course">Course</Label>
              <Select
                value={uploadForm.course}
                onValueChange={(value) => setUploadForm({ ...uploadForm, course: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {COURSES.map((course) => (
                    <SelectItem key={course} value={course}>
                      {course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Select
                value={uploadForm.subject}
                onValueChange={(value) => setUploadForm({ ...uploadForm, subject: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="year">Year</Label>
                <Select
                  value={uploadForm.year}
                  onValueChange={(value) => setUploadForm({ ...uploadForm, year: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEARS.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="semester">Semester</Label>
                <Select
                  value={uploadForm.semester}
                  onValueChange={(value) => setUploadForm({ ...uploadForm, semester: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEMESTERS.map((semester) => (
                      <SelectItem key={semester} value={semester}>
                        {semester}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="files">Files</Label>
              <Input
                id="files"
                type="file"
                multiple
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
              />
              <p className="text-sm text-muted-foreground">
                Maximum file size: 10MB. Supported formats: PDF, DOC, DOCX
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUploadDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={uploading || !selectedFiles}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
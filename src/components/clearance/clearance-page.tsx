import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ClearanceTable } from './clearance-table';
import { ClearanceStats } from './clearance-stats';

export function ClearancePage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Graduation Clearance</h1>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by registration number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button>Export Report</Button>
        </div>
      </div>

      <ClearanceStats />
      <ClearanceTable searchQuery={searchQuery} />
    </div>
  );
}
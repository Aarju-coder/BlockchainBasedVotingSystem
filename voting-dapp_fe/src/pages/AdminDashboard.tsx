import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ElectionCard, type Election } from '@/components/ElectionCard';
import { Search, PlusCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// Mock data - replace with contract calls
const mockElections: Election[] = [
  {
    id: '1',
    title: 'Board Member Election 2025',
    description: 'Annual election for the board of directors',
    status: 'open',
    endTime: '2025-04-01T00:00:00Z',
    totalVotes: 156,
    candidates: 5,
    isOwner: true,
  },
  {
    id: '2',
    title: 'Community Project Funding',
    description: 'Vote for the next community development project',
    status: 'open',
    endTime: '2025-03-25T00:00:00Z',
    totalVotes: 89,
    candidates: 3,
    isOwner: true,
  },
  {
    id: '3',
    title: 'Technical Committee Selection',
    description: 'Select members for the technical advisory committee',
    status: 'closed',
    endTime: '2025-03-15T00:00:00Z',
    totalVotes: 234,
    candidates: 4,
    isOwner: true,
  },
];

export function AdminDashboard() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedElectionId, setSelectedElectionId] = useState<string | null>(
    null
  );

  const filteredElections = mockElections.filter((election) => {
    const matchesSearch = election.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus = status === 'all' || election.status === status;
    return matchesSearch && matchesStatus;
  });

  const handleFinalizeElection = async (id: string) => {
    try {
      // TODO: Call smart contract to finalize election
      console.log('Finalizing election:', id);

      toast.success('The election has been successfully finalized.');

      // Mock update
      setSelectedElectionId(null);
    } catch (error) {
      toast.error('Failed to finalize election. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">My Elections</h1>
        <div className="flex gap-4 w-full md:w-auto">
          <Button onClick={() => navigate('/create')} className="gap-2">
            <PlusCircle className="h-5 w-5" />
            Create Election
          </Button>
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search elections..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredElections.map((election) => (
          <AlertDialog
            key={election.id}
            open={selectedElectionId === election.id}
            onOpenChange={(open) => !open && setSelectedElectionId(null)}
          >
            <AlertDialogTrigger asChild>
              <div
                onClick={() =>
                  election.status === 'open' &&
                  setSelectedElectionId(election.id)
                }
              >
                <ElectionCard
                  election={election}
                  showAdminActions={true}
                  onFinalizeElection={() => setSelectedElectionId(election.id)}
                />
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Finalize Election</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to finalize this election? This action
                  cannot be undone, and no more votes will be accepted after
                  finalization.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleFinalizeElection(election.id)}
                >
                  Finalize Election
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ))}
      </div>

      {filteredElections.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No elections found</p>
        </div>
      )}
    </div>
  );
}

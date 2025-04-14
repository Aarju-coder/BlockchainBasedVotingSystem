import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Timer, Users, Vote } from "lucide-react";
import { getFactoryContract, getElectionContract } from "@/lib/contract";
import { formatUnits } from "ethers";

type Election = {
  id: string; // Contract address
  title: string;
  description: string;
  status: "open" | "closed";
  endTime: string;
  totalVotes: number;
  candidates: number;
};

export function ElectionList() {
  const navigate = useNavigate();
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchElections = async () => {
      try {
        setLoading(true);
        const factory = await getFactoryContract();
        const addresses: string[] = await factory.getAllElections();

        const electionData = await Promise.all(
          addresses.map(async (address) => {
            const contract = await getElectionContract(address);

            const title = await contract.title();
            const description = await contract.description();
            const endTimeSec = await contract.endTime(); // assume seconds
            const candidates = await contract.getCandidateCount();
            const totalVotes = await contract.getTotalVotes();

            const endTime = new Date(Number(endTimeSec) * 1000).toISOString();
            const status: "open" | "closed" =
              new Date() < new Date(endTime) ? "open" : "closed";

            return {
              id: address,
              title,
              description,
              endTime,
              candidates: Number(candidates),
              totalVotes: Number(totalVotes),
              status,
            };
          })
        );

        setElections(electionData);
      } catch (err) {
        console.error("Failed to load elections", err);
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

  const filteredElections = elections.filter((election) => {
    const matchesSearch = election.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus = status === "all" || election.status === status;
    return matchesSearch && matchesStatus;
  });

  const getTimeLeft = (endTime: string) => {
    const end = new Date(endTime);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
  
    if (diff <= 0) return "Ended";
  
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Elections</h1>
        <div className="flex gap-4 w-full md:w-auto">
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
          <Card key={election.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="line-clamp-1">
                    {election.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {election.description}
                  </CardDescription>
                </div>
                <Badge
                  variant={election.status === "open" ? "default" : "secondary"}
                >
                  {election.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Timer className="h-4 w-4" />
                  {getTimeLeft(election.endTime)}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {election.candidates} candidates
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Vote className="h-4 w-4" />
                  {election.totalVotes} votes cast
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => navigate(`/elections/${election.id}`)}
              >
                View Details
              </Button>
            </CardFooter>
          </Card>
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

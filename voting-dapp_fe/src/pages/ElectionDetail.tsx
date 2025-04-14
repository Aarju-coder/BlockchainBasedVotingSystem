import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
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
} from "@/components/ui/alert-dialog";
import { Timer, Users, Vote } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { getElectionContract, getProvider } from "@/lib/contract";

type Candidate = {
  id: string;
  name: string;
  imageUrl: string;
  voteCount: number;
};

type Election = {
  id: string;
  title: string;
  description: string;
  status: "open" | "closed";
  endTime: string;
  totalVotes: number;
  candidates: Candidate[];
  userHasVoted: boolean;
};

export function ElectionDetail() {
  const { electionId } = useParams();
  const [selectedCandidate, setSelectedCandidate] = useState<string>("");
  const [election, setElection] = useState<Election | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchElection = async () => {
      try {
        if (!electionId) return;

        console.log("📦 Fetching election:", electionId);

        const contract = await getElectionContract(electionId);
        console.log("✅ Got election contract:", contract.address);
        const provider = await getProvider();
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();

        const [title, description, endTimeRaw, candidateCount, hasVoted] =
          await Promise.all([
            contract.title(),
            contract.description(),
            contract.endTime(),
            contract.getCandidateCount(),
            contract.hasVoted(userAddress),
          ]);

        console.log("🗳️ Election Title:", title);
        console.log("📜 Description:", description);
        console.log("⏱️ EndTime (raw):", endTimeRaw.toString());
        console.log("👥 Candidate count:", candidateCount.toString());
        console.log("🙋 Has user voted?", hasVoted);

        const endTime = new Date(Number(endTimeRaw) * 1000).toISOString();
        const now = Date.now();
        const status = now < new Date(endTime).getTime() ? "open" : "closed";

        const candidates: Candidate[] = [];

        for (let i = 0; i < candidateCount; i++) {
          const candidate = await contract.candidates(i);
          candidates.push({
            id: i.toString(),
            name: candidate.name,
            imageUrl: `https://ipfs.io/ipfs/${candidate.imageHash}`,
            voteCount: Number(candidate.voteCount),
          });
        }

        const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);

        setElection({
          id: electionId,
          title,
          description,
          endTime,
          status,
          totalVotes,
          userHasVoted: hasVoted,
          candidates,
        });
      } catch (err) {
        console.error("Failed to fetch election", err);
        toast.error("Failed to load election details.");
      } finally {
        setLoading(false);
      }
    };

    fetchElection();
  }, [electionId]);

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

  const handleVote = async () => {
    try {
      const contract = await getElectionContract(electionId as string);
      const tx = await contract.vote(Number(selectedCandidate));
      await tx.wait();

      toast.success("Your vote has been recorded successfully.");
      window.location.reload(); // Refresh to reflect results
    } catch (error) {
      toast.error("Failed to cast vote. Please try again.");
      console.error(error);
    }
  };

  if (loading || !election) {
    return <div className="text-center py-12">Loading election details...</div>;
  }

  const chartData = election.candidates.map((candidate) => ({
    name: candidate.name,
    votes: candidate.voteCount,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <CardTitle className="text-2xl">{election.title}</CardTitle>
              <CardDescription className="text-base">
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
        <CardContent>
          <div className="flex gap-6 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4" />
              {getTimeLeft(election.endTime)}
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {election.candidates.length} candidates
            </div>
            <div className="flex items-center gap-2">
              <Vote className="h-4 w-4" />
              {election.totalVotes} votes cast
            </div>
          </div>

          {election.status === "open" && !election.userHasVoted && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Cast Your Vote</h3>
              <RadioGroup
                value={selectedCandidate}
                onValueChange={setSelectedCandidate}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {election.candidates.map((candidate) => (
                  <Label
                    key={candidate.id}
                    className={`flex items-center space-x-4 p-4 border rounded-lg cursor-pointer hover:bg-accent ${
                      selectedCandidate === candidate.id ? "border-primary" : ""
                    }`}
                  >
                    <RadioGroupItem value={candidate.id} id={candidate.id} />
                    <div className="flex items-center gap-3">
                      <img
                        src={candidate.imageUrl}
                        alt={candidate.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium">{candidate.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {candidate.voteCount} votes
                        </p>
                      </div>
                    </div>
                  </Label>
                ))}
              </RadioGroup>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="w-full mt-6" disabled={!selectedCandidate}>
                    Cast Vote
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Your Vote</AlertDialogTitle>
                    <AlertDialogDescription>
                      You are about to vote for{" "}
                      {
                        election.candidates.find(
                          (c) => c.id === selectedCandidate
                        )?.name
                      }
                      . This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleVote}>
                      Confirm Vote
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-4">Current Results</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="votes"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

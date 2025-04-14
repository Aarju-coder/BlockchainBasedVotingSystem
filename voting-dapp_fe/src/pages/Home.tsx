import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, ListChecks, Vote, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getFactoryContract } from "@/lib/contract";

export function Home() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalElections: 0,
    activeElections: 0,
    totalVoters: 0,
    totalVotes: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const factory = await getFactoryContract();
        const [totalElections, activeElections, totalVotes, totalVoters] =
          await Promise.all([
            factory.getElectionCount(),
            factory.getActiveElectionCount(),
            factory.getTotalVotesCast(),
            factory.getUniqueVotersCount(),
          ]);

        setStats({
          totalElections: Number(totalElections),
          activeElections: Number(activeElections),
          totalVotes: Number(totalVotes),
          totalVoters: Number(totalVoters),
        });
      } catch (err) {
        console.error("📉 Failed to fetch stats from blockchain:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Welcome to the Decentralized Voting System
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Create and participate in transparent, secure elections powered by blockchain technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
          <Button
            size="lg"
            className="h-24 text-lg gap-3"
            onClick={() => navigate('/create')}
          >
            <PlusCircle className="h-6 w-6" />
            Create New Election
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-24 text-lg gap-3"
            onClick={() => navigate('/elections')}
          >
            <ListChecks className="h-6 w-6" />
            Browse Elections
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <Card className="backdrop-blur-sm bg-card/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Vote className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalElections}</p>
                  <p className="text-muted-foreground">Total Elections</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <ListChecks className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.activeElections}</p>
                  <p className="text-muted-foreground">Active Elections</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalVoters}</p>
                  <p className="text-muted-foreground">Total Voters</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Vote className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalVotes}</p>
                  <p className="text-muted-foreground">Votes Cast</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
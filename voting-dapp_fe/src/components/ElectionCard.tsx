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
import { Badge } from "@/components/ui/badge";
import { Timer, Users, Vote } from "lucide-react";

export interface Election {
  id: string;
  title: string;
  description: string;
  status: "open" | "closed";
  endTime: string;
  totalVotes: number;
  candidates: number;
  isOwner?: boolean;
}

interface ElectionCardProps {
  election: Election;
  showAdminActions?: boolean;
  onFinalizeElection?: (id: string) => void;
}

export function ElectionCard({ 
  election, 
  showAdminActions = false,
  onFinalizeElection 
}: ElectionCardProps) {
  const navigate = useNavigate();

  const getTimeLeft = (endTime: string) => {
    const end = new Date(endTime);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return "Ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}d ${hours}h left`;
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="line-clamp-1">{election.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {election.description}
            </CardDescription>
          </div>
          <Badge variant={election.status === "open" ? "default" : "secondary"}>
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
      <CardFooter className="flex gap-2">
        <Button
          className="flex-1"
          onClick={() => navigate(`/elections/${election.id}`)}
        >
          View Details
        </Button>
        {showAdminActions && election.status === "open" && (
          <Button
            variant="secondary"
            onClick={() => onFinalizeElection?.(election.id)}
          >
            Finalize
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
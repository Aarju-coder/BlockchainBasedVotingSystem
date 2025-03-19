export interface Election {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  candidates: Candidate[];
  endDate: string;
  totalVotes: number;
  createdBy: string;
  status: 'active' | 'completed' | 'upcoming';
}

export interface Candidate {
  id: string;
  name: string;
  imageUrl: string;
  voteCount: number;
  description?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Vote {
  id: string;
  electionId: string;
  candidateId: string;
  timestamp: string;
  voterHash: string;
}
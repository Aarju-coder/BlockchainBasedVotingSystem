import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Check } from 'lucide-react';
import { updateElection } from '../store/slices/electionSlice';
import toast from 'react-hot-toast';
import type { RootState } from '../store';

const Vote: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const election = useSelector((state: RootState) => 
    state.elections.elections.find(e => e.id === id)
  );

  if (!election) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Election not found
        </h2>
      </div>
    );
  }

  if (election.status !== 'active') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          This election is not currently active
        </h2>
      </div>
    );
  }

  const handleVote = async () => {
    if (!selectedCandidate) return;

    setLoading(true);
    try {
      const updatedElection = {
        ...election,
        totalVotes: election.totalVotes + 1,
        candidates: election.candidates.map(c => ({
          ...c,
          voteCount: c.id === selectedCandidate ? c.voteCount + 1 : c.voteCount
        }))
      };

      dispatch(updateElection(updatedElection));
      toast.success('Vote cast successfully!');
      navigate(`/election/${election.id}`);
    } catch (error) {
      toast.error('Failed to cast vote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Cast Your Vote
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Select your preferred candidate for {election.title}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {election.candidates.map((candidate, index) => (
          <motion.div
            key={candidate.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedCandidate(candidate.id)}
            className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg 
              cursor-pointer transform transition-all duration-200
              ${selectedCandidate === candidate.id ? 
                'ring-2 ring-red-500 scale-105' : 
                'hover:scale-105'}`}
          >
            <div className="relative">
              <img
                src={candidate.imageUrl || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=800&auto=format&fit=crop&q=80'}
                alt={candidate.name}
                className="w-full h-48 object-cover"
              />
              {selectedCandidate === candidate.id && (
                <div className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full">
                  <Check className="w-5 h-5" />
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {candidate.name}
              </h3>
              {candidate.description && (
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {candidate.description}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleVote}
          disabled={!selectedCandidate || loading}
          className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg
            transform hover:scale-105 transition-all duration-200 
            shadow-lg hover:shadow-red-500/25 disabled:opacity-50 
            disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
            />
          ) : (
            'Confirm Vote'
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default Vote;
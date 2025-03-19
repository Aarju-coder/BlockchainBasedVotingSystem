import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Plus, X, Upload } from 'lucide-react';
import { addElection } from '../store/slices/electionSlice';
import toast from 'react-hot-toast';
import type { Candidate } from '../types';

const CreateElection: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState<Partial<Candidate>[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const election = {
        id: crypto.randomUUID(),
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        imageUrl: 'https://images.unsplash.com/photo-1494172892981-ce47ca685ecd?w=800&auto=format&fit=crop&q=80',
        endDate: formData.get('endDate') as string,
        candidates: candidates.map(c => ({
          ...c,
          id: crypto.randomUUID(),
          voteCount: 0,
        })) as Candidate[],
        totalVotes: 0,
        createdBy: 'user-1',
        status: 'upcoming' as const,
      };

      dispatch(addElection(election));
      toast.success('Election created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to create election. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addCandidate = () => {
    setCandidates([...candidates, { name: '', imageUrl: '' }]);
  };

  const removeCandidate = (index: number) => {
    setCandidates(candidates.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Create New Election
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Election Title
            </label>
            <input
              type="text"
              name="title"
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 
                rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 
                focus:border-transparent bg-white dark:bg-gray-700 
                text-gray-900 dark:text-white"
              placeholder="Enter election title"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Description
            </label>
            <textarea
              name="description"
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 
                rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 
                focus:border-transparent bg-white dark:bg-gray-700 
                text-gray-900 dark:text-white"
              placeholder="Describe the election"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 
                rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 
                focus:border-transparent bg-white dark:bg-gray-700 
                text-gray-900 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Election Image
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 
              rounded-lg p-8 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
              <input
                type="file"
                name="image"
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                className="text-red-600 dark:text-red-400 hover:text-red-700 
                  dark:hover:text-red-300"
              >
                Upload Image
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Candidates
              </label>
              <button
                type="button"
                onClick={addCandidate}
                className="inline-flex items-center px-3 py-1.5 bg-red-100 dark:bg-red-900/30 
                  text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 
                  dark:hover:bg-red-900/50 transition-colors duration-200"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Candidate
              </button>
            </div>

            {candidates.map((candidate, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 relative"
              >
                <button
                  type="button"
                  onClick={() => removeCandidate(index)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-600 
                    dark:hover:text-red-400"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={candidate.name}
                    onChange={(e) => {
                      const newCandidates = [...candidates];
                      newCandidates[index].name = e.target.value;
                      setCandidates(newCandidates);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 
                      rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 
                      focus:border-transparent bg-white dark:bg-gray-700 
                      text-gray-900 dark:text-white"
                    placeholder="Candidate Name"
                    required
                  />
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 
                    rounded-lg p-4 text-center">
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <button
                      type="button"
                      className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 
                        dark:hover:text-red-300"
                    >
                      Upload Photo
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || candidates.length === 0}
            className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg
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
              'Create Election'
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default CreateElection;
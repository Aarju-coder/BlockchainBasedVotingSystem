import React from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Users, Calendar, BarChart3, ArrowRight } from 'lucide-react';
import type { RootState } from '../store';

const ElectionDetails: React.FC = () => {
  const { id } = useParams();
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="relative h-64 rounded-xl overflow-hidden">
        <img
          src={election.imageUrl}
          alt={election.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            {election.title}
          </h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium
            ${election.status === 'active' ? 'bg-green-100 text-green-800' :
              election.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'}`}>
            {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Total Candidates', value: election.candidates.length, icon: Users },
          { title: 'End Date', value: new Date(election.endDate).toLocaleDateString(), icon: Calendar },
          { title: 'Total Votes', value: election.totalVotes, icon: BarChart3 },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <stat.icon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          About this Election
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {election.description}
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Candidates
          </h2>
          {election.status === 'active' && (
            <Link
              to={`/vote/${election.id}`}
              className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 
                text-white rounded-lg transform hover:scale-105 transition-all duration-200
                shadow-lg hover:shadow-red-500/25"
            >
              Cast Your Vote
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          )}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {election.candidates.map((candidate, index) => (
            <motion.div
              key={candidate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg"
            >
              <img
                src={candidate.imageUrl || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=800&auto=format&fit=crop&q=80'}
                alt={candidate.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {candidate.name}
                </h3>
                <div className="mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Votes
                    </span>
                    <span className="text-lg font-bold text-red-600 dark:text-red-400">
                      {candidate.voteCount}
                    </span>
                  </div>
                  <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-red-600 dark:bg-red-500 h-2 rounded-full"
                      style={{
                        width: `${election.totalVotes ? (candidate.voteCount / election.totalVotes) * 100 : 0}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ElectionDetails;
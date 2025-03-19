import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Search, Calendar, Users } from 'lucide-react';
import type { RootState } from '../store';

const Elections: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { elections } = useSelector((state: RootState) => state.elections);

  const filteredElections = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return elections.filter(election =>
      election.title.toLowerCase().includes(query) ||
      election.description.toLowerCase().includes(query)
    );
  }, [elections, searchQuery]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Browse Elections
        </h1>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search elections..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 
              rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 
              focus:border-transparent bg-white dark:bg-gray-700 
              text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredElections.map((election, index) => (
          <motion.div
            key={election.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg 
              hover:shadow-xl transition-all duration-300"
          >
            <img
              src={election.imageUrl}
              alt={election.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {election.title}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium
                  ${election.status === 'active' ? 'bg-green-100 text-green-800' :
                    election.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'}`}>
                  {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                {election.description}
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(election.endDate).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {election.candidates.length} candidates
                </div>
              </div>
              <div className="pt-4 flex gap-2">
                <Link
                  to={`/election/${election.id}`}
                  className="flex-1 text-center py-2 px-4 bg-red-100 dark:bg-red-900/30 
                    text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 
                    dark:hover:bg-red-900/50 transition-colors duration-200"
                >
                  View Details
                </Link>
                {election.status === 'active' && (
                  <Link
                    to={`/vote/${election.id}`}
                    className="flex-1 text-center py-2 px-4 bg-red-600 hover:bg-red-700 
                      text-white rounded-lg transform hover:scale-105 transition-all duration-200"
                  >
                    Vote Now
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredElections.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            No elections found
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Try adjusting your search criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default Elections;
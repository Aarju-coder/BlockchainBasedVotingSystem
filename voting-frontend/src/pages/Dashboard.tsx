import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Plus, BarChart3, Clock, CheckCircle } from 'lucide-react';
import type { RootState } from '../store';

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { elections } = useSelector((state: RootState) => state.elections);

  const stats = {
    active: elections.filter(e => e.status === 'active').length,
    completed: elections.filter(e => e.status === 'completed').length,
    upcoming: elections.filter(e => e.status === 'upcoming').length,
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name}!
        </h1>
        <Link
          to="/create-election"
          className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 
            text-white rounded-lg transform hover:scale-105 transition-all duration-200
            shadow-lg hover:shadow-red-500/25"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Election
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Active Elections', count: stats.active, icon: BarChart3, color: 'bg-green-500' },
          { title: 'Upcoming', count: stats.upcoming, icon: Clock, color: 'bg-blue-500' },
          { title: 'Completed', count: stats.completed, icon: CheckCircle, color: 'bg-gray-500' },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center space-x-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {stat.title}
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.count}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Your Elections
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {elections
            .filter(election => election.createdBy === user?.id)
            .map((election, index) => (
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
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Ends: {new Date(election.endDate).toLocaleDateString()}
                    </span>
                    <span className="text-sm text-red-600 dark:text-red-400">
                      {election.totalVotes} votes
                    </span>
                  </div>
                  <Link
                    to={`/election/${election.id}`}
                    className="block w-full text-center py-2 px-4 bg-red-100 dark:bg-red-900/30 
                      text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 
                      dark:hover:bg-red-900/50 transition-colors duration-200"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
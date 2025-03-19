import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Vote, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  const mockElections = [
    {
      id: '1',
      title: 'Student Council Election 2024',
      description: 'Vote for your next student council representatives',
      imageUrl: 'https://images.unsplash.com/photo-1494172892981-ce47ca685ecd?w=800&auto=format&fit=crop&q=80',
      endDate: '2024-04-01',
      totalVotes: 156
    },
    {
      id: '2',
      title: 'Community Garden Project',
      description: 'Choose the next community garden development plan',
      imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&auto=format&fit=crop&q=80',
      endDate: '2024-03-25',
      totalVotes: 89
    }
  ];

  return (
    <div className="space-y-12">
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          className="inline-block p-4 bg-red-100 dark:bg-red-900/30 rounded-full"
        >
          <Vote className="w-12 h-12 text-red-600 dark:text-red-500" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
          Secure Blockchain Voting
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Participate in transparent and secure elections powered by blockchain technology.
          Your vote matters, and we ensure it counts.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 
              text-white rounded-lg transform hover:scale-105 transition-all duration-200
              shadow-lg hover:shadow-red-500/25"
          >
            Create an Election
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </motion.section>

      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
          Active Elections
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {mockElections.map((election) => (
            <motion.div
              key={election.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg 
                hover:shadow-xl transition-all duration-300"
            >
              <img 
                src={election.imageUrl} 
                alt={election.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {election.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
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
      </section>

      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-8 text-center space-y-4"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Ready to make your voice heard?
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Join thousands of others in shaping the future through secure blockchain voting.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 
            text-white rounded-lg transform hover:scale-105 transition-all duration-200
            shadow-lg hover:shadow-red-500/25"
        >
          Get Started
          <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
      </motion.section>
    </div>
  );
};

export default Home;
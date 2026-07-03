import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { fadeIn } from '../../animations';

const StatisticsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Courses',
      value: stats.totalCourses || 0,
      icon: '📚',
      color: 'from-blue-500 to-blue-600',
      trend: '+12%',
    },
    {
      title: 'Total Instructors',
      value: stats.totalInstructors || 0,
      icon: '👨‍🏫',
      color: 'from-green-500 to-green-600',
      trend: '+8%',
    },
    {
      title: 'Total Lectures',
      value: stats.totalLectures || 0,
      icon: '📝',
      color: 'from-purple-500 to-purple-600',
      trend: '+15%',
    },
    {
      title: 'Upcoming Lectures',
      value: stats.upcomingLectures || 0,
      icon: '📅',
      color: 'from-orange-500 to-orange-600',
      trend: '+5%',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          variants={fadeIn('up', index * 0.1)}
          initial="hidden"
          animate="show"
          className="glass rounded-2xl p-6 card-hover"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {card.value}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center text-2xl`}>
              {card.icon}
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">{card.trend}</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">increase</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatisticsCards;
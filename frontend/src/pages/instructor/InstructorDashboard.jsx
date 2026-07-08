import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Users, 
  Video, 
  MapPin, 
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import { getInstructorDashboard } from '../../services/instructorService';
import { useAuth } from '../../components/context/AuthContext';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalLectures: 0,
    todayLectures: 0,
    upcomingLectures: 0,
    pastLectures: 0,
    todayLecturesList: [],
    upcomingLecturesList: [],
    pastLecturesList: [],
  });

  // ✅ Fetch dashboard when user ID is available
  useEffect(() => {
    if (user?._id) {
      fetchDashboard();
    } else {
      // If no user ID, stop loading and set empty data
      setLoading(false);
    }
  }, [user?.id]); // ✅ Add user.id as dependency

  const fetchDashboard = async () => {
    // ✅ Double check user ID exists
    if (!user?._id) {
      console.warn('No user ID available, skipping dashboard fetch');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getInstructorDashboard(user._id);
      
      if (response && response.data) {
        setData({
          totalLectures: response.data.totalLectures || 0,
          todayLectures: response.data.todayLectures || 0,
          upcomingLectures: response.data.upcomingLectures || 0,
          pastLectures: response.data.pastLectures || 0,
          todayLecturesList: response.data.todayLecturesList || [],
          upcomingLecturesList: response.data.upcomingLecturesList || [],
          pastLecturesList: response.data.pastLecturesList || [],
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      // Keep existing data, don't reset to zeros
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle loading state properly
  if (loading) {
    return <LoadingSkeleton type="dashboard" />;
  }

  const stats = [
    {
      title: 'Total Lectures',
      value: data.totalLectures,
      icon: Calendar,
      color: 'bg-blue-500',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      title: "Today's Lectures",
      value: data.todayLectures,
      icon: Clock,
      color: 'bg-green-500',
      gradient: 'from-green-500 to-green-600',
    },
    {
      title: 'Upcoming Lectures',
      value: data.upcomingLectures,
      icon: BookOpen,
      color: 'bg-purple-500',
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Past Lectures',
      value: data.pastLectures,
      icon: Users,
      color: 'bg-orange-500',
      gradient: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name || 'Instructor'}!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Here's your lecture schedule overview
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-2xl p-6 card-hover"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Today's Lectures */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Today's Lectures
          </h2>
          <button className="text-sm text-primary-500 hover:text-primary-600 flex items-center">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        <div className="space-y-4">
          {data.todayLecturesList && data.todayLecturesList.length > 0 ? (
            data.todayLecturesList.map((lecture) => (
              <div
                key={lecture._id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {lecture.batchName}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {lecture.course?.name}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {lecture.startTime} - {lecture.endTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {lecture.roomNumber}
                      </span>
                      {lecture.meetingLink && (
                        <a
                          href={lecture.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary-500 hover:text-primary-600"
                        >
                          <Video className="w-4 h-4" />
                          Join Meeting
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <span className="mt-2 md:mt-0 px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                  {lecture.status}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                No lectures scheduled for today
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Enjoy your free time! 🎉
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Upcoming Lectures */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Upcoming Lectures
          </h2>
          <button className="text-sm text-primary-500 hover:text-primary-600 flex items-center">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        <div className="space-y-4">
          {data.upcomingLecturesList && data.upcomingLecturesList.length > 0 ? (
            data.upcomingLecturesList.map((lecture) => (
              <div
                key={lecture._id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {lecture.batchName}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {lecture.course?.name}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(lecture.lectureDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {lecture.startTime} - {lecture.endTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {lecture.roomNumber}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="mt-2 md:mt-0 px-3 py-1 text-xs font-medium text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400 rounded-full">
                  Upcoming
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                No upcoming lectures
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Check back later for new assignments
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Past Lectures (Optional Section) */}
      {data.pastLecturesList && data.pastLecturesList.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Past Lectures
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {data.pastLectures} total
            </span>
          </div>
          <div className="space-y-3">
            {data.pastLecturesList.slice(0, 3).map((lecture) => (
              <div
                key={lecture._id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {lecture.batchName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(lecture.lectureDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                  Completed
                </span>
              </div>
            ))}
            {data.pastLectures > 3 && (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                +{data.pastLectures - 3} more past lectures
              </p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default InstructorDashboard;
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  MapPin, 
  Video,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Filter,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { getLectures } from '../../services/lectureService';
import { useAuth } from '../../components/context/AuthContext';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import useDebounce from '../../components/hooks/useDebounce';

const InstructorLectures = () => {
  const { user } = useAuth();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [filters, setFilters] = useState({ status: '' });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchLectures();
  }, [pagination.page, debouncedSearch, filters]);

  const fetchLectures = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: 10,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...filters,
      };
      const response = await getLectures(params);
      setLectures(response.data || []);
      setPagination(response.pagination || { page: 1, limit: 10, total: 0, pages: 0 });
    } catch (error) {
      console.error('Error fetching lectures:', error);
      setLectures([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPagination({ ...pagination, page: 1 });
  };
  const handlePageChange = (newPage) => {
    if (newPage !== pagination.page) {
      setPagination({ ...pagination, page: newPage });
    }
  };
  const clearFilters = () => {
    setFilters({ status: '' });
    setSearchTerm('');
    setPagination({ ...pagination, page: 1 });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const configs = {
      upcoming: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: <Clock className="w-3 h-3" /> },
      completed: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: <CheckCircle className="w-3 h-3" /> },
      cancelled: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: <XCircle className="w-3 h-3" /> },
    };
    const config = configs[status] || configs.upcoming;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.icon}
        {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Upcoming'}
      </span>
    );
  };

  if (loading) {
    return <LoadingSkeleton type="table" />;
  }

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-primary-500" />
            My Lectures
          </h1>
          <p className="text-gray-500 dark:text-gray-400">View all your scheduled lectures</p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Total: <span className="font-semibold text-gray-900 dark:text-white">{pagination.total}</span> lectures
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search your lectures..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <select
            className="px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all min-w-[130px]"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {Object.values(filters).some(v => v) && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Lectures List */}
      {lectures.length === 0 ? (
        <div className="text-center py-16 glass rounded-2xl">
          <BookOpen className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">No lectures found</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {searchTerm ? 'Try adjusting your search' : 'You have no lectures scheduled yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {lectures.map((lecture, index) => (
            <motion.div
              key={lecture._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass rounded-2xl p-5 hover:shadow-lg transition-shadow border border-gray-200/50 dark:border-gray-700/50"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-primary-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {lecture.batchName}
                        </h3>
                        {getStatusBadge(lecture.status)}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {lecture.course?.name || 'Course not assigned'}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(lecture.lectureDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {lecture.startTime} - {lecture.endTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {lecture.roomNumber || 'TBD'}
                        </span>
                        {lecture.meetingLink && (
                          <a
                            href={lecture.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-primary-500 hover:text-primary-600 transition-colors"
                          >
                            <Video className="w-4 h-4" />
                            Join Meeting
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:flex-col md:items-end">
                  <span className="text-xs text-gray-400">
                    Created: {new Date(lecture.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {lectures.length} of {pagination.total} lectures
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-4 py-2 rounded-lg bg-primary-500 text-white min-w-[40px] text-center">
              {pagination.page}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorLectures;
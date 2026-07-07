import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Calendar,
  Clock,
  User,
  Building,
  Video,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Loader2,
  BookOpen,
  MapPin,
  Users,
  Filter,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getLectures, createLecture, updateLecture, cancelLecture, deleteLecture } from '../../services/lectureService';
import { getCourses } from '../../services/courseService';
import { getInstructors } from '../../services/instructorService';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import useDebounce from '../../components/hooks/useDebounce';

const lectureSchema = z.object({
  batchName: z.string().min(2, 'Batch name is required'),
  course: z.string().min(1, 'Course is required'),
  instructor: z.string().min(1, 'Instructor is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  lectureDate: z.string().min(1, 'Lecture date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  roomNumber: z.string().min(1, 'Room number is required'),
  meetingLink: z.string().url('Invalid URL').optional().or(z.literal('')),
});

const LectureManagement = () => {
  const [lectures, setLectures] = useState([]);
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLecture, setEditingLecture] = useState(null);
  
  // Search state with debounce
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  
  // Filter state
  const [filters, setFilters] = useState({
    status: '',
    course: '',
  });
  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  
  // Track previous values to prevent unnecessary API calls
  const [prevDebouncedSearch, setPrevDebouncedSearch] = useState('');
  const [prevFilters, setPrevFilters] = useState({});

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(lectureSchema),
  });

  const lectureDate = watch('lectureDate');
  const startTime = watch('startTime');
  const endTime = watch('endTime');

  // Fetch data when page, debounced search, or filters change
  useEffect(() => {
    const searchChanged = prevDebouncedSearch !== debouncedSearch;
    const filtersChanged = JSON.stringify(prevFilters) !== JSON.stringify(filters);
    
    if (searchChanged || filtersChanged) {
      setPagination(prev => ({ ...prev, page: 1 }));
      setPrevDebouncedSearch(debouncedSearch);
      setPrevFilters(filters);
    }
    
    fetchData();
  }, [pagination.page, debouncedSearch, filters]);

  // Load courses and instructors only once
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [coursesRes, instructorsRes] = await Promise.all([
          getCourses({ limit: 100 }),
          getInstructors({ limit: 100 }),
        ]);
        setCourses(coursesRes.data || []);
        setInstructors(instructorsRes.data || []);
      } catch (error) {
        console.error('Failed to load options:', error);
      }
    };
    loadOptions();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: 10,
      };
      
      if (debouncedSearch) {
        params.search = debouncedSearch;
      }
      
      if (filters.status) {
        params.status = filters.status;
      }
      
      if (filters.course) {
        params.course = filters.course;
      }
      
      const response = await getLectures(params);
      setLectures(response.data || []);
      setPagination(response.pagination || { page: 1, limit: 10, total: 0, pages: 0 });
    } catch (error) {
      console.error('Error fetching lectures:', error);
      toast.error('Failed to fetch lectures');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage !== pagination.page) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const clearFilters = () => {
    setFilters({ status: '', course: '' });
    setSearchTerm('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (editingLecture) {
        await updateLecture(editingLecture._id, data);
        toast.success('Lecture updated successfully');
      } else {
        await createLecture(data);
        toast.success('Lecture scheduled successfully');
      }
      setShowModal(false);
      reset();
      setEditingLecture(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save lecture');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (lecture) => {
    setEditingLecture(lecture);
    setValue('batchName', lecture.batchName);
    setValue('course', lecture.course?._id || lecture.course || '');
    setValue('instructor', lecture.instructor?._id || lecture.instructor || '');
    setValue('startDate', lecture.startDate ? lecture.startDate.split('T')[0] : '');
    setValue('endDate', lecture.endDate ? lecture.endDate.split('T')[0] : '');
    setValue('lectureDate', lecture.lectureDate ? lecture.lectureDate.split('T')[0] : '');
    setValue('startTime', lecture.startTime || '');
    setValue('endTime', lecture.endTime || '');
    setValue('roomNumber', lecture.roomNumber || '');
    setValue('meetingLink', lecture.meetingLink || '');
    setShowModal(true);
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this lecture?')) {
      try {
        await cancelLecture(id);
        toast.success('Lecture cancelled successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to cancel lecture');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lecture?')) {
      try {
        await deleteLecture(id);
        toast.success('Lecture deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete lecture');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingLecture(null);
    reset();
  };

  const statusColors = {
    upcoming: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  const statusIcons = {
    upcoming: <Clock className="w-3 h-3" />,
    completed: <CheckCircle className="w-3 h-3" />,
    cancelled: <XCircle className="w-3 h-3" />,
  };

  // Get active filter count
  const activeFilterCount = Object.values(filters).filter(v => v !== '').length;

  if (loading) {
    return <LoadingSkeleton type="table" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-7 h-7 text-primary-500" />
            Lectures
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Manage lecture schedules</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          Schedule Lecture
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 space-y-4 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search lectures..."
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

          {/* Status Filter */}
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

          {/* Course Filter */}
          <select
            className="px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all min-w-[150px]"
            value={filters.course}
            onChange={(e) => handleFilterChange('course', e.target.value)}
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.name}
              </option>
            ))}
          </select>

          {/* Clear Filters Button */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <X className="w-4 h-4" />
              Clear Filters ({activeFilterCount})
            </button>
          )}
        </div>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Active Filters:</span>
            {filters.status && (
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[filters.status] || 'bg-gray-100 text-gray-700'}`}>
                Status: {filters.status}
                <button
                  onClick={() => handleFilterChange('status', '')}
                  className="hover:text-current"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.course && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                Course: {courses.find(c => c._id === filters.course)?.name || filters.course}
                <button
                  onClick={() => handleFilterChange('course', '')}
                  className="hover:text-current"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Lectures Table */}
      {lectures.length === 0 ? (
        <div className="text-center py-16 glass rounded-2xl">
          <Calendar className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">No lectures found</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {searchTerm || activeFilterCount > 0 
              ? 'Try adjusting your search or filters' 
              : 'Schedule your first lecture to get started'}
          </p>
          {(searchTerm || activeFilterCount > 0) && (
            <button
              onClick={clearFilters}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-primary-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Batch
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Room
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {lectures.map((lecture) => (
                  <motion.tr
                    key={lecture._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {lecture.batchName}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {lecture.course?.name || 'N/A'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-xs">
                          {lecture.instructor?.name?.charAt(0) || '?'}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {lecture.instructor?.name || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {new Date(lecture.lectureDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {lecture.startTime} - {lecture.endTime}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {lecture.roomNumber}
                        </p>
                        {lecture.meetingLink && (
                          <a
                            href={lecture.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary-500 hover:text-primary-600 flex items-center gap-1"
                          >
                            <Video className="w-3 h-3" />
                            Meeting Link
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${
                          statusColors[lecture.status] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {statusIcons[lecture.status]}
                        {lecture.status?.charAt(0).toUpperCase() + lecture.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {lecture.status === 'upcoming' && (
                          <>
                            <button
                              onClick={() => handleEdit(lecture)}
                              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </button>
                            <button
                              onClick={() => handleCancel(lecture._id)}
                              className="p-2 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/20 transition-colors"
                              title="Cancel"
                            >
                              <XCircle className="w-4 h-4 text-yellow-500" />
                            </button>
                            <button
                              onClick={() => handleDelete(lecture._id)}
                              className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </>
                        )}
                        {lecture.status === 'cancelled' && (
                          <button
                            onClick={() => handleDelete(lecture._id)}
                            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        )}
                        {lecture.status === 'completed' && (
                          <span className="text-xs text-gray-400 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                            Completed
                          </span>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
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

      {/* Modal - Schedule/Edit Lecture */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-3xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingLecture ? 'Edit Lecture' : 'Schedule Lecture'}
              </h2>
              <button onClick={closeModal} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Batch Name *
                  </label>
                  <input
                    {...register('batchName')}
                    type="text"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    placeholder="Batch A"
                  />
                  {errors.batchName && (
                    <p className="text-red-500 text-sm mt-1">{errors.batchName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Course *
                  </label>
                  <select
                    {...register('course')}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                  {errors.course && (
                    <p className="text-red-500 text-sm mt-1">{errors.course.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Instructor *
                  </label>
                  <select
                    {...register('instructor')}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  >
                    <option value="">Select Instructor</option>
                    {instructors.map((instructor) => (
                      <option key={instructor._id} value={instructor._id}>
                        {instructor.name}
                      </option>
                    ))}
                  </select>
                  {errors.instructor && (
                    <p className="text-red-500 text-sm mt-1">{errors.instructor.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Room Number *
                  </label>
                  <input
                    {...register('roomNumber')}
                    type="text"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    placeholder="Room 101"
                  />
                  {errors.roomNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.roomNumber.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Start Date *
                  </label>
                  <input
                    {...register('startDate')}
                    type="date"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    End Date *
                  </label>
                  <input
                    {...register('endDate')}
                    type="date"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Lecture Date *
                  </label>
                  <input
                    {...register('lectureDate')}
                    type="date"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  />
                  {errors.lectureDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.lectureDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Start Time *
                  </label>
                  <input
                    {...register('startTime')}
                    type="time"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  />
                  {errors.startTime && (
                    <p className="text-red-500 text-sm mt-1">{errors.startTime.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    End Time *
                  </label>
                  <input
                    {...register('endTime')}
                    type="time"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  />
                  {errors.endTime && (
                    <p className="text-red-500 text-sm mt-1">{errors.endTime.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Meeting Link (Optional)
                  </label>
                  <input
                    {...register('meetingLink')}
                    type="url"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    placeholder="https://meet.google.com/..."
                  />
                  {errors.meetingLink && (
                    <p className="text-red-500 text-sm mt-1">{errors.meetingLink.message}</p>
                  )}
                </div>
              </div>

              {/* Schedule Preview */}
              {lectureDate && startTime && endTime && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
                    <Clock className="w-4 h-4" />
                    <span>
                      Scheduling: {new Date(lectureDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })} at {startTime} - {endTime}
                      {instructors.find(i => i._id === watch('instructor')) && (
                        <> with <strong>{instructors.find(i => i._id === watch('instructor'))?.name}</strong></>
                      )}
                      {courses.find(c => c._id === watch('course')) && (
                        <> for <strong>{courses.find(c => c._id === watch('course'))?.name}</strong></>
                      )}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editingLecture ? 'Update Lecture' : 'Schedule Lecture'
                  )}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default LectureManagement;
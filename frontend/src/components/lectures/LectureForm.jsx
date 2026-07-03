import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Calendar, Clock, User, Building, Video } from 'lucide-react';
import { modalAnimation } from '../../animations';

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

const LectureForm = ({
  isOpen,
  onClose,
  onSubmit,
  editingLecture,
  loading,
  courses,
  instructors,
}) => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [lectureDate, setLectureDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(lectureSchema),
  });

  const watchCourse = watch('course');
  const watchInstructor = watch('instructor');
  const watchLectureDate = watch('lectureDate');
  const watchStartTime = watch('startTime');
  const watchEndTime = watch('endTime');

  useEffect(() => {
    if (editingLecture) {
      setValue('batchName', editingLecture.batchName);
      setValue('course', editingLecture.course._id);
      setValue('instructor', editingLecture.instructor._id);
      setValue('startDate', editingLecture.startDate.split('T')[0]);
      setValue('endDate', editingLecture.endDate.split('T')[0]);
      setValue('lectureDate', editingLecture.lectureDate.split('T')[0]);
      setValue('startTime', editingLecture.startTime);
      setValue('endTime', editingLecture.endTime);
      setValue('roomNumber', editingLecture.roomNumber);
      setValue('meetingLink', editingLecture.meetingLink || '');
    }
  }, [editingLecture, setValue]);

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        variants={modalAnimation}
        initial="hidden"
        animate="show"
        exit="exit"
        className="glass rounded-3xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {editingLecture ? 'Edit Lecture' : 'Schedule Lecture'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Batch Name *
              </label>
              <input
                {...register('batchName')}
                type="text"
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                placeholder="Batch A"
              />
              {errors.batchName && (
                <p className="text-red-500 text-sm mt-1">{errors.batchName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Course *
              </label>
              <select
                {...register('course')}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Instructor *
              </label>
              <select
                {...register('instructor')}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Room Number *
              </label>
              <input
                {...register('roomNumber')}
                type="text"
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                placeholder="Room 101"
              />
              {errors.roomNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.roomNumber.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date *
              </label>
              <input
                {...register('startDate')}
                type="date"
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date *
              </label>
              <input
                {...register('endDate')}
                type="date"
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              />
              {errors.endDate && (
                <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lecture Date *
              </label>
              <input
                {...register('lectureDate')}
                type="date"
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              />
              {errors.lectureDate && (
                <p className="text-red-500 text-sm mt-1">{errors.lectureDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Time *
              </label>
              <input
                {...register('startTime')}
                type="time"
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              />
              {errors.startTime && (
                <p className="text-red-500 text-sm mt-1">{errors.startTime.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Time *
              </label>
              <input
                {...register('endTime')}
                type="time"
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              />
              {errors.endTime && (
                <p className="text-red-500 text-sm mt-1">{errors.endTime.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Meeting Link (Optional)
              </label>
              <input
                {...register('meetingLink')}
                type="url"
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                placeholder="https://meet.google.com/..."
              />
              {errors.meetingLink && (
                <p className="text-red-500 text-sm mt-1">{errors.meetingLink.message}</p>
              )}
            </div>
          </div>

          {/* Schedule Preview */}
          {watchLectureDate && watchStartTime && watchEndTime && watchInstructor && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
                <Clock className="w-4 h-4" />
                <span>
                  Scheduling: {new Date(watchLectureDate).toLocaleDateString()} at{' '}
                  {watchStartTime} - {watchEndTime}
                  {watchInstructor && instructors.find(i => i._id === watchInstructor) && (
                    <> with {instructors.find(i => i._id === watchInstructor)?.name}</>
                  )}
                  {watchCourse && courses.find(c => c._id === watchCourse) && (
                    <> for {courses.find(c => c._id === watchCourse)?.name}</>
                  )}
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : editingLecture ? 'Update Lecture' : 'Schedule Lecture'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LectureForm;
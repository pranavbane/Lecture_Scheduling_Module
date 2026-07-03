import { motion } from 'framer-motion';
import { Calendar, Clock, User, Building, Video, Edit, Trash2, XCircle, CheckCircle } from 'lucide-react';
import { cardHover } from '../../animations';

const LectureCard = ({ lecture, onEdit, onDelete, onCancel }) => {
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

  return (
    <motion.div
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {lecture.batchName}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {lecture.course?.name}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${
            statusColors[lecture.status] || 'bg-gray-100 text-gray-700'
          }`}
        >
          {statusIcons[lecture.status]}
          {lecture.status?.charAt(0).toUpperCase() + lecture.status?.slice(1)}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{new Date(lecture.lectureDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>{lecture.startTime} - {lecture.endTime}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <User className="w-4 h-4 text-gray-400" />
          <span>{lecture.instructor?.name}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <Building className="w-4 h-4 text-gray-400" />
          <span>Room {lecture.roomNumber}</span>
        </div>
        {lecture.meetingLink && (
          <div className="flex items-center gap-2 text-sm">
            <Video className="w-4 h-4 text-primary-500" />
            <a
              href={lecture.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-500 hover:text-primary-600"
            >
              Join Meeting
            </a>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex gap-2">
          {lecture.status === 'upcoming' && (
            <>
              <button
                onClick={() => onEdit && onEdit(lecture)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={() => onCancel && onCancel(lecture._id)}
                className="p-2 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/20 transition-colors"
              >
                <XCircle className="w-4 h-4 text-yellow-500" />
              </button>
              <button
                onClick={() => onDelete && onDelete(lecture._id)}
                className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </>
          )}
          {lecture.status === 'cancelled' && (
            <button
              onClick={() => onDelete && onDelete(lecture._id)}
              className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          )}
        </div>
        <span className="text-xs text-gray-400">
          Created {new Date(lecture.createdAt).toLocaleDateString()}
        </span>
      </div>
    </motion.div>
  );
};

export default LectureCard;
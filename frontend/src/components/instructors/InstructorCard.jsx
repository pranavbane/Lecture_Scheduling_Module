import { motion } from 'framer-motion';
import { User, Mail, Phone, Building, GraduationCap, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { cardHover } from '../../animations';

const InstructorCard = ({ instructor, onEdit, onDelete }) => {
  return (
    <motion.div
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      className="glass rounded-2xl overflow-hidden p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden flex-shrink-0">
            {instructor.profilePhoto ? (
              <img
                src={instructor.profilePhoto}
                alt={instructor.name}
                className="w-full h-full object-cover"
              />
            ) : (
              instructor.name.charAt(0)
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {instructor.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {instructor.qualification || 'No qualification'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit && onEdit(instructor)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={() => onDelete && onDelete(instructor._id)}
            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <Mail className="w-4 h-4 text-gray-400" />
          <span>{instructor.email}</span>
        </div>
        {instructor.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Phone className="w-4 h-4 text-gray-400" />
            <span>{instructor.phone}</span>
          </div>
        )}
        {instructor.department && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Building className="w-4 h-4 text-gray-400" />
            <span>{instructor.department}</span>
          </div>
        )}
        {instructor.qualification && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <GraduationCap className="w-4 h-4 text-gray-400" />
            <span>{instructor.qualification}</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${
              instructor.availability === 'available'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}
          >
            {instructor.availability === 'available' ? (
              <CheckCircle className="w-3 h-3" />
            ) : (
              <XCircle className="w-3 h-3" />
            )}
            {instructor.availability || 'Unavailable'}
          </span>
          <span className="text-xs text-gray-400">
            Joined {new Date(instructor.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default InstructorCard;
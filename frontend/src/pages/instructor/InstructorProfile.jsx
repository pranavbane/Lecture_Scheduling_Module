import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  Building, 
  Edit, 
  X, 
  Camera,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle,
  XCircle,
  Award,
  Shield,
  Sparkles,
  BarChart3,
  Loader2,
  Save,
} from 'lucide-react';
import { useAuth } from '../../components/context/AuthContext';
import { updateInstructor, getInstructorDashboard } from '../../services/instructorService';
import { changePassword } from '../../services/authService';
import toast from 'react-hot-toast';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().optional(),
  qualification: z.string().optional(),
  department: z.string().optional(),
  availability: z.string().optional(),
  bio: z.string().max(200, 'Bio must be less than 200 characters').optional(),
});

const InstructorProfile = () => {
  const { user, loadUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [stats, setStats] = useState({
    totalLectures: 0,
    todayLectures: 0,
    upcomingLectures: 0,
    pastLectures: 0,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  const availability = watch('availability');

  // Set form values when user data is available
  useEffect(() => {
    if (user) {
      setValue('name', user.name || '');
      setValue('phone', user.phone || '');
      setValue('qualification', user.qualification || '');
      setValue('department', user.department || '');
      setValue('availability', user.availability || 'available');
      setValue('bio', user.bio || '');
      if (user.profilePhoto) {
        setPreviewUrl(user.profilePhoto);
      }
    }
  }, [user, setValue]);

  // Fetch stats only when user ID is available
  useEffect(() => {
    if (user?.id) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    // Check if user ID exists
    if (!user?.id) {
      console.warn('User ID not available, skipping stats fetch');
      return;
    }

    setDashboardLoading(true);
    try {
      const response = await getInstructorDashboard(user.id);
      if (response && response.data) {
        setStats({
          totalLectures: response.data.totalLectures || 0,
          todayLectures: response.data.todayLectures || 0,
          upcomingLectures: response.data.upcomingLectures || 0,
          pastLectures: response.data.pastLectures || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Don't show toast for stats error, just log it
    } finally {
      setDashboardLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    if (!user?.id) {
      toast.error('Work in progress');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key]) formData.append(key, data[key]);
      });
      if (selectedFile) {
        formData.append('profilePhoto', selectedFile);
      }

      await updateInstructor(user.id, formData);
      await loadUser();
      toast.success('Profile updated successfully');
      setIsEditing(false);
      setSelectedFile(null);
      // Refresh stats after update
      if (user.id) {
        fetchStats();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    reset();
    setSelectedFile(null);
    if (user?.profilePhoto) {
      setPreviewUrl(user.profilePhoto);
    }
  };

  // Show loading skeleton if user is not loaded yet
  if (!user) {
    return <LoadingSkeleton type="card" />;
  }

  const statCards = [
    {
      title: 'Total Lectures',
      value: stats.totalLectures,
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: "Today's Lectures",
      value: stats.todayLectures,
      icon: Clock,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Upcoming Lectures',
      value: stats.upcomingLectures,
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Past Lectures',
      value: stats.pastLectures,
      icon: CheckCircle,
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-8 relative overflow-hidden"
      >
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <User className="w-7 h-7 text-primary-500" />
                My Profile
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Manage your personal information and preferences
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={cancelEdit}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Photo */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center overflow-hidden ring-4 ring-primary-100 dark:ring-primary-900/30 shadow-xl">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-white">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                {isEditing && (
                  <>
                    <label className="absolute bottom-0 right-0 p-2.5 bg-primary-500 rounded-full cursor-pointer hover:bg-primary-600 transition-colors shadow-lg hover:scale-105 transform">
                      <Camera className="w-4 h-4 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    {selectedFile && (
                      <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-green-500 font-medium whitespace-nowrap">
                        ✓ Image selected
                      </span>
                    )}
                  </>
                )}
              </div>
              <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                {user.name}
                {user.isActive !== false && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle className="w-3 h-3" />
                    Active
                  </span>
                )}
              </h2>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 mt-1">
                <Shield className="w-3 h-3" />
                {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
              </span>
              {user.availability && (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full mt-2 ${
                  user.availability === 'available'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {user.availability === 'available' ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <XCircle className="w-3 h-3" />
                  )}
                  {user.availability.charAt(0).toUpperCase() + user.availability.slice(1)}
                </span>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        {...register('name')}
                        type="text"
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl cursor-not-allowed opacity-60"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Phone
                      </label>
                      <input
                        {...register('phone')}
                        type="tel"
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                        placeholder="+1 234 567 890"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Availability
                      </label>
                      <select
                        {...register('availability')}
                        className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all ${
                          availability === 'available'
                            ? 'border-green-500 dark:border-green-500'
                            : 'border-red-500 dark:border-red-500'
                        }`}
                      >
                        <option value="available">🟢 Available</option>
                        <option value="unavailable">🔴 Unavailable</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Qualification
                      </label>
                      <input
                        {...register('qualification')}
                        type="text"
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                        placeholder="PhD in Computer Science"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Department
                      </label>
                      <input
                        {...register('department')}
                        type="text"
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                        placeholder="Computer Science"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Bio / About
                      </label>
                      <textarea
                        {...register('bio')}
                        rows="3"
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
                        placeholder="Tell us about yourself..."
                      />
                      {errors.bio && (
                        <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
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
                        <>
                          <Save className="w-5 h-5" />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                      <User className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Full Name</p>
                        <p className="text-gray-900 dark:text-white font-medium">{user.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                      <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Email Address</p>
                        <p className="text-gray-900 dark:text-white font-medium">{user.email}</p>
                      </div>
                    </div>

                    {user.phone && (
                      <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                        <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                          <p className="text-gray-900 dark:text-white font-medium">{user.phone}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                      <Award className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Availability</p>
                        <p className={`font-medium flex items-center gap-1 ${
                          user.availability === 'available'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {user.availability === 'available' ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                          {user.availability?.charAt(0).toUpperCase() + user.availability?.slice(1)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {user.qualification && (
                    <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                      <GraduationCap className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Qualification</p>
                        <p className="text-gray-900 dark:text-white font-medium">{user.qualification}</p>
                      </div>
                    </div>
                  )}

                  {user.department && (
                    <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                      <Building className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Department</p>
                        <p className="text-gray-900 dark:text-white font-medium">{user.department}</p>
                      </div>
                    </div>
                  )}

                  {user.bio && (
                    <div className="flex items-start gap-3 py-3 px-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                      <Sparkles className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Bio</p>
                        <p className="text-gray-900 dark:text-white font-medium">{user.bio}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Statistics Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary-500" />
          Lecture Statistics
        </h2>
        {dashboardLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass rounded-2xl p-4 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
                className="glass rounded-2xl p-4 card-hover"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default InstructorProfile;
import { motion } from 'framer-motion';

const LoadingSkeleton = ({ type = 'card' }) => {
  const skeletonVariants = {
    initial: { opacity: 0.6 },
    animate: {
      opacity: [0.6, 1, 0.6],
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: 'easeInOut',
      },
    },
  };

  if (type === 'card') {
    return (
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <motion.div
            variants={skeletonVariants}
            initial="initial"
            animate="animate"
            className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"
          />
          <motion.div
            variants={skeletonVariants}
            initial="initial"
            animate="animate"
            className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"
          />
        </div>
        <motion.div
          variants={skeletonVariants}
          initial="initial"
          animate="animate"
          className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4"
        />
        <motion.div
          variants={skeletonVariants}
          initial="initial"
          animate="animate"
          className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded"
        />
      </div>
    );
  }

  if (type === 'dashboard') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <LoadingSkeleton key={i} type="card" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            variants={skeletonVariants}
            initial="initial"
            animate="animate"
            className="lg:col-span-2 glass rounded-2xl p-6 h-80"
          />
          <motion.div
            variants={skeletonVariants}
            initial="initial"
            animate="animate"
            className="glass rounded-2xl p-6 h-80"
          />
        </div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="glass rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <motion.div
            variants={skeletonVariants}
            initial="initial"
            animate="animate"
            className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded"
          />
          <motion.div
            variants={skeletonVariants}
            initial="initial"
            animate="animate"
            className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded"
          />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              variants={skeletonVariants}
              initial="initial"
              animate="animate"
              className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={skeletonVariants}
      initial="initial"
      animate="animate"
      className="h-64 w-full bg-gray-200 dark:bg-gray-700 rounded-2xl"
    />
  );
};

export default LoadingSkeleton;
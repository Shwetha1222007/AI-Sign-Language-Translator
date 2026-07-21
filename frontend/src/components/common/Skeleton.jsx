import { motion } from 'framer-motion';

export const Skeleton = ({ width = 'w-full', height = 'h-4', className = '' }) => {
  return (
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className={`${width} ${height} bg-primary-800/50 rounded-lg ${className}`}
    />
  );
};

export default Skeleton;

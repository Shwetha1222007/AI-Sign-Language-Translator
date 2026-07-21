import { motion } from 'framer-motion';

export const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-accent-blue/10 text-accent-blue border border-accent-blue/30',
    purple: 'bg-accent-purple/10 text-accent-purple border border-accent-purple/30',
    success: 'bg-green-500/10 text-green-400 border border-green-500/30',
    warning: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30',
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}
    >
      {children}
    </motion.span>
  );
};

export default Badge;

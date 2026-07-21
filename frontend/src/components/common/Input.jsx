import { motion } from 'framer-motion';

export const Input = ({ 
  label, 
  error, 
  icon: Icon,
  className = '',
  ...props 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      {label && (
        <label className="block text-sm font-medium text-neutral-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-accent-blue/50" />
        )}
        <input
          className={`
            w-full bg-primary-900/50 border border-primary-800/50 rounded-lg
            text-white placeholder-neutral-500 focus:outline-none focus:border-accent-blue
            focus:ring-2 focus:ring-accent-blue/20 transition-all duration-200
            ${Icon ? 'pl-12 pr-4' : 'px-4'} py-3
            ${error ? 'border-red-500/50 focus:ring-red-500/20' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-400 text-sm mt-2"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

export default Input;

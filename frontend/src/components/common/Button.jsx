import { motion } from 'framer-motion';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  isLoading = false,
  disabled = false,
  onClick,
  ...props 
}) => {
  const baseStyles = 'font-medium transition-all duration-200 rounded-lg flex items-center gap-2 justify-center';
  
  const variants = {
    primary: 'bg-gradient-primary text-white hover:shadow-glow-md disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'bg-primary-800 text-accent-blue hover:bg-primary-700 hover:shadow-glow-sm border border-accent-blue/30',
    ghost: 'text-neutral-300 hover:text-white hover:bg-primary-800/50',
    outline: 'border border-accent-blue/50 text-accent-blue hover:border-accent-blue hover:shadow-glow-sm',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={isLoading || disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
        />
      )}
      {children}
    </motion.button>
  );
};

export default Button;

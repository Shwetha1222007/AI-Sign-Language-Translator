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
  const baseStyles = 'font-semibold transition-all duration-300 rounded-xl flex items-center gap-2 justify-center cursor-pointer select-none active:scale-95';
  
  const variants = {
    primary: 'bg-gradient-primary text-white hover:shadow-glow-md shadow-glow-sm disabled:opacity-50 disabled:cursor-not-allowed border border-white/20',
    secondary: 'bg-primary-800/80 text-accent-blue hover:bg-primary-700 hover:text-white hover:shadow-glow-sm border border-accent-blue/30 backdrop-blur-md',
    ghost: 'text-neutral-300 hover:text-white hover:bg-white/10',
    outline: 'border border-accent-blue/50 text-accent-blue hover:border-accent-blue hover:bg-accent-blue/10 hover:shadow-glow-sm',
    danger: 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/40 hover:text-white shadow-[0_0_15px_rgba(239,68,68,0.2)]',
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
      disabled={isLoading || disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
        />
      )}
      {children}
    </motion.button>
  );
};

export default Button;


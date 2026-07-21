import { motion } from 'framer-motion';

export const Card = ({ children, className = '', hover = true, ...props }) => {
  return (
    <motion.div
      whileHover={hover ? { translateY: -4 } : {}}
      className={`
        bg-primary-900/50 backdrop-blur-md border border-primary-800/50 
        rounded-2xl p-6 hover:border-accent-blue/30 transition-all duration-300
        hover:shadow-glow-md ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;

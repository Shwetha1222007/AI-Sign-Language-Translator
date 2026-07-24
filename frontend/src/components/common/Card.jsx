import { motion } from 'framer-motion';

export const Card = ({ children, className = '', hover = true, ...props }) => {
  return (
    <motion.div
      whileHover={hover ? { translateY: -4 } : {}}
      className={`
        glass-card rounded-2xl p-6 transition-all duration-300
        border border-white/10 ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;


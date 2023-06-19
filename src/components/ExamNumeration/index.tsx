import { motion } from 'framer-motion';

interface ExamNumerationProps {
  wasAnswered?: boolean;
  active?: boolean;
  isWrong?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const ExamNumeration: React.FC<ExamNumerationProps> = ({
  wasAnswered,
  active,
  onClick,
  isWrong,
  children
}) => {
  return (
    <motion.div
      animate={{
        opacity: [0, 1],
        scale: [0.5, 1],
        background: active ? '#d35d19' : wasAnswered ? '#d35d1970' : isWrong ? '#f05252' : '#fff'
      }}
      transition={{
        duration: 0.5,
        delay: 0.1,
        ease: 'easeInOut',
        background: {
          duration: 0.2
        }
      }}
      style={{
        border: active ? 'none' : wasAnswered ? 'none' : '1px solid #d35d19',
        color: active ? '#fff' : wasAnswered ? '#d35d19' : isWrong ? '#fff' : '#d35d19'
      }}
      onClick={onClick}
      className="h-10 w-10 p-5 flex items-center justify-center rounded-full hover:cursor-pointer">
      <p>{children}</p>
    </motion.div>
  );
};

export default ExamNumeration;

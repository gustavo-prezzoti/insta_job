
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const ScheduleHeader = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex items-center mb-8"
  >
    <Calendar className="text-viral-accent-purple mr-3 h-6 w-6" />
    <h1 className="text-2xl font-bold text-white">Agendamentos</h1>
  </motion.div>
);

export default ScheduleHeader;

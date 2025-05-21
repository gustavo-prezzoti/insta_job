
import { motion } from 'framer-motion';

const NoSchedules = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-16"
  >
    <h2 className="text-xl font-medium text-white mb-2">
      Nenhum agendamento encontrado
    </h2>
    <p className="text-white/60 mb-6">
      Você ainda não tem nenhuma postagem agendada.
    </p>
  </motion.div>
);

export default NoSchedules;

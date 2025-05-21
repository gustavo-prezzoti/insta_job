
import { Shield, HeartHandshake, Gift } from "lucide-react";
import { motion } from "framer-motion";

const GuaranteesSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="py-20 px-4 border-t border-white/5 relative overflow-hidden">
      {/* Background effect */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
        initial={{ opacity: 0.2 }}
        animate={{ opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-full h-full bg-viral-accent-purple/20 rounded-full blur-3xl"></div>
      </motion.div>
      
      <motion.div 
        className="max-w-6xl mx-auto relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
            Garantias <span className="gradient-text">Exclusivas</span>
          </h2>
          <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto">
            Você está 100% protegido com nossas garantias premium
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          <motion.div 
            className="ai-card p-6 text-center"
            variants={itemVariants}
            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
          >
            <div className="w-16 h-16 mx-auto relative mb-4">
              <div className="absolute inset-0 bg-viral-accent-pink/20 rounded-full animate-pulse-light"></div>
              <div className="w-full h-full rounded-full ai-glow flex items-center justify-center">
                <Shield className="h-8 w-8 text-viral-accent-pink" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Garantia de 7 Dias</h3>
            <p className="text-gray-300">
              Se você não ficar satisfeito por qualquer motivo, devolvemos 100% do seu dinheiro.
            </p>
          </motion.div>
          
          <motion.div 
            className="ai-card p-6 text-center"
            variants={itemVariants}
            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
          >
            <div className="w-16 h-16 mx-auto relative mb-4">
              <div className="absolute inset-0 bg-viral-accent-pink/20 rounded-full animate-pulse-light"></div>
              <div className="w-full h-full rounded-full ai-glow flex items-center justify-center">
                <HeartHandshake className="h-8 w-8 text-viral-accent-pink" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Suporte Premium</h3>
            <p className="text-gray-300">
              Acesso a suporte exclusivo via WhatsApp para tirar todas as suas dúvidas.
            </p>
          </motion.div>
          
          <motion.div 
            className="ai-card p-6 text-center"
            variants={itemVariants}
            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
          >
            <div className="w-16 h-16 mx-auto relative mb-4">
              <div className="absolute inset-0 bg-viral-accent-pink/20 rounded-full animate-pulse-light"></div>
              <div className="w-full h-full rounded-full ai-glow flex items-center justify-center">
                <Gift className="h-8 w-8 text-viral-accent-pink" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Bônus Exclusivos</h3>
            <p className="text-gray-300">
              Receba acesso a treinamentos e ferramentas extras no valor de R$997.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GuaranteesSection;

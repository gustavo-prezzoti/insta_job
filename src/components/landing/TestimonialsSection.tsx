
import { ShoppingCart, Sparkles, Star, Zap, Image, Video, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const TestimonialsSection = () => {
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
    <div className="py-16 px-4 relative overflow-hidden">
      {/* Efeito de brilho */}
      <div className="absolute top-40 left-1/4 w-64 h-64 bg-viral-accent-purple/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-viral-accent-pink/20 rounded-full blur-3xl"></div>
      
      <motion.div 
        className="max-w-6xl mx-auto relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="mb-4 flex justify-center">
          <span className="inline-block bg-viral-accent-pink/20 text-viral-accent-pink px-4 py-1 rounded-full text-sm font-medium">
            EXEMPLOS DE RESULTADOS
          </span>
        </motion.div>
        
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center text-white mb-4"
          variants={itemVariants}
        >
          Vídeos Com <span className="gradient-text">Alto Engajamento</span>
        </motion.h2>
        
        <motion.p 
          className="text-xl text-gray-300 text-center mb-12 max-w-3xl mx-auto"
          variants={itemVariants}
        >
          Conheça exemplos de vídeos criados com nosso robô que ganharam destaque nas redes sociais
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {/* Result 1 */}
          <motion.div 
            className="ai-card overflow-hidden transform transition-all hover:scale-105 duration-300"
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <div className="relative">
              <div className="w-full h-60 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400/30 to-purple-400/30 rounded-full flex items-center justify-center">
                  <Image className="h-5 w-5 text-indigo-400" />
                </div>
              </div>
              <div className="absolute top-2 right-2 bg-viral-accent-red px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                <span>DESTAQUE</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">Cachorro de Óculos</h3>
              <div className="flex items-center justify-between text-sm text-gray-300 mb-4">
                <div className="flex items-center">
                  <Star className="h-3 w-3 text-viral-accent-pink mr-1" />
                  <span>150K visualizações</span>
                </div>
                <span className="text-viral-accent-pink font-medium">Alta repercussão</span>
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-viral-accent-purple to-viral-accent-pink hover:opacity-90 text-white"
              >
                <ShoppingCart className="h-3 w-3 mr-2" />
                QUERO RESULTADOS ASSIM
              </Button>
            </div>
          </motion.div>
          
          {/* Result 2 */}
          <motion.div 
            className="ai-card overflow-hidden transform transition-all hover:scale-105 duration-300"
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <div className="relative">
              <div className="w-full h-60 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400/30 to-indigo-400/30 rounded-full flex items-center justify-center">
                  <Video className="h-5 w-5 text-purple-400" />
                </div>
              </div>
              <div className="absolute top-2 right-2 bg-viral-accent-red px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                <span>DESTAQUE</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">Fantasma na Floresta</h3>
              <div className="flex items-center justify-between text-sm text-gray-300 mb-4">
                <div className="flex items-center">
                  <Star className="h-3 w-3 text-viral-accent-pink mr-1" />
                  <span>76K visualizações</span>
                </div>
                <span className="text-viral-accent-pink font-medium">Muito compartilhado</span>
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-viral-accent-purple to-viral-accent-pink hover:opacity-90 text-white"
              >
                <ShoppingCart className="h-3 w-3 mr-2" />
                QUERO RESULTADOS ASSIM
              </Button>
            </div>
          </motion.div>
          
          {/* Result 3 */}
          <motion.div 
            className="ai-card overflow-hidden transform transition-all hover:scale-105 duration-300"
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <div className="relative">
              <div className="w-full h-60 bg-gradient-to-br from-indigo-500/20 to-viral-accent-pink/20 flex items-center justify-center">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400/30 to-viral-accent-pink/30 rounded-full flex items-center justify-center">
                  <Award className="h-5 w-5 text-indigo-400" />
                </div>
              </div>
              <div className="absolute top-2 right-2 bg-viral-accent-red px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                <span>DESTAQUE</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">Jogador Driblando</h3>
              <div className="flex items-center justify-between text-sm text-gray-300 mb-4">
                <div className="flex items-center">
                  <Star className="h-3 w-3 text-viral-accent-pink mr-1" />
                  <span>56K visualizações</span>
                </div>
                <span className="text-viral-accent-pink font-medium">Bom engajamento</span>
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-viral-accent-purple to-viral-accent-pink hover:opacity-90 text-white"
              >
                <ShoppingCart className="h-3 w-3 mr-2" />
                QUERO RESULTADOS ASSIM
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TestimonialsSection;


import { TrendingUp, Zap, Users, ShoppingCart, Bot, Sparkles, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const FeaturesSection = () => {
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
    <div className="py-16 px-4 relative overflow-hidden bg-indigo-50/50">
      <motion.div 
        className="max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-4"
          variants={itemVariants}
        >
          Transforme Seu Conteúdo com <span className="gradient-text">Inteligência Artificial</span>
        </motion.h2>
        
        <motion.p 
          className="text-xl text-slate-700 text-center mb-12 max-w-3xl mx-auto"
          variants={itemVariants}
        >
          Crie vídeos encantadores em minutos sem aparecer na câmera, sem mostrar seu rosto e sem gravar sua voz
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {/* Feature 1 */}
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-md hover:scale-105 transition-all duration-300 border border-slate-100"
            variants={itemVariants}
          >
            <div className="relative w-16 h-16 ai-glow rounded-full flex items-center justify-center mb-4">
              <div className="absolute inset-0 bg-viral-accent-pink/20 rounded-full animate-pulse-light"></div>
              <BrainCircuit className="h-8 w-8 text-viral-accent-pink relative z-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Vídeos Encantadores Automáticos</h3>
            <p className="text-slate-700">
              Nosso algoritmo analisa as tendências e gera vídeos com alta probabilidade de engajamento, sem que você precise aparecer.
            </p>
          </motion.div>
          
          {/* Feature 2 */}
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-md hover:scale-105 transition-all duration-300 border border-slate-100"
            variants={itemVariants}
          >
            <div className="relative w-16 h-16 ai-glow rounded-full flex items-center justify-center mb-4">
              <div className="absolute inset-0 bg-viral-accent-purple/20 rounded-full animate-pulse-light"></div>
              <Zap className="h-8 w-8 text-viral-accent-purple relative z-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Criação Rápida</h3>
            <p className="text-slate-700">
              Economize tempo e esforço com nossa plataforma que cria conteúdo de qualidade em questão de minutos.
            </p>
          </motion.div>
          
          {/* Feature 3 */}
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-md hover:scale-105 transition-all duration-300 border border-slate-100"
            variants={itemVariants}
          >
            <div className="relative w-16 h-16 ai-glow rounded-full flex items-center justify-center mb-4">
              <div className="absolute inset-0 bg-viral-accent-pink/20 rounded-full animate-pulse-light"></div>
              <Users className="h-8 w-8 text-viral-accent-pink relative z-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Aumente seu Alcance</h3>
            <p className="text-slate-700">
              Crie conteúdo otimizado para algoritmos das redes sociais e aumente suas chances de conquistar novos seguidores.
            </p>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="mt-12 text-center"
          variants={itemVariants}
        >
          <Button 
            size="lg" 
            className="relative bg-gradient-to-r from-viral-accent-purple to-viral-accent-pink hover:opacity-90 text-white font-bold py-6 px-8 rounded-full transition-all shadow-lg shadow-viral-accent-purple/20 text-lg flex items-center gap-2 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-viral-accent-purple/80 via-viral-accent-pink/80 to-viral-accent-purple/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              QUERO COMEÇAR AGORA - R$97,00
            </span>
            <Sparkles className="absolute right-3 top-3 h-4 w-4 text-white/80 animate-pulse-light" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FeaturesSection;

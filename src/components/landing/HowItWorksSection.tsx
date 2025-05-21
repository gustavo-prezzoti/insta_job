
import React from 'react';
import { motion } from "framer-motion";
import { BrainCircuit, ArrowRight } from "lucide-react";

const HowItWorksSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  return (
    <div className="py-20 px-4 border-t border-b border-white/5 relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-viral-accent-purple/5 ai-pattern opacity-20"></div>
      
      <motion.div 
        className="max-w-6xl mx-auto relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="flex justify-center mb-10">
          <div className="relative w-10 h-10 ai-glow rounded-full flex items-center justify-center">
            <div className="absolute inset-0 bg-viral-accent-purple/20 rounded-full animate-pulse-light"></div>
            <BrainCircuit className="h-5 w-5 text-viral-accent-purple relative z-10" />
          </div>
        </motion.div>
        
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center text-white mb-4"
          variants={itemVariants}
        >
          Como o <span className="gradient-text">Robô Viral</span> Funciona
        </motion.h2>
        
        <motion.p 
          className="text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto"
          variants={itemVariants}
        >
          Em apenas 3 passos simples você estará criando vídeos virais e monetizando seu conteúdo
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
          variants={containerVariants}
        >
          {/* Connecting line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-viral-accent-purple/30 to-viral-accent-pink/30 hidden md:block"></div>
          
          <motion.div 
            className="ai-card p-6 relative"
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-viral-accent-pink flex items-center justify-center text-white font-bold text-sm z-20">1</div>
            <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-viral-accent-pink/20 animate-pulse-light"></div>
            <h3 className="text-xl font-bold text-white mb-3 mt-2">Escolha um Tema</h3>
            <p className="text-gray-300">
              Selecione entre centenas de nichos lucrativos ou use nossa ferramenta de análise de tendências.
            </p>
            <ArrowRight className="absolute -right-3 top-1/2 transform -translate-y-1/2 text-viral-accent-pink/80 h-4 w-4 hidden md:block" />
          </motion.div>
          
          <motion.div 
            className="ai-card p-6 relative"
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-viral-accent-pink flex items-center justify-center text-white font-bold text-sm z-20">2</div>
            <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-viral-accent-pink/20 animate-pulse-light"></div>
            <h3 className="text-xl font-bold text-white mb-3 mt-2">Gere o Vídeo</h3>
            <p className="text-gray-300">
              Com um clique, nosso robô cria vídeos completos com imagens, textos, efeitos e narração automatizada.
            </p>
            <ArrowRight className="absolute -right-3 top-1/2 transform -translate-y-1/2 text-viral-accent-pink/80 h-4 w-4 hidden md:block" />
          </motion.div>
          
          <motion.div 
            className="ai-card p-6 relative"
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-viral-accent-pink flex items-center justify-center text-white font-bold text-sm z-20">3</div>
            <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-viral-accent-pink/20 animate-pulse-light"></div>
            <h3 className="text-xl font-bold text-white mb-3 mt-2">Monetize</h3>
            <p className="text-gray-300">
              Publique o vídeo e comece a gerar receita com nosso sistema de monetização automática e parcerias.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HowItWorksSection;

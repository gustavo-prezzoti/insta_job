
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

const ComparisonSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const comparisonItems = [
    {
      feature: "Busca automática de conteúdo viral",
      viralyx: true,
      others: false
    },
    {
      feature: "Identificação de tendências em tempo real",
      viralyx: true,
      others: false
    },
    {
      feature: "Repostagem otimizada para seu público",
      viralyx: true,
      others: false
    },
    {
      feature: "Agendamento inteligente de postagens",
      viralyx: true,
      others: true
    },
    {
      feature: "Análise de desempenho avançada",
      viralyx: true,
      others: false
    },
    {
      feature: "Edição de conteúdo com IA",
      viralyx: true,
      others: false
    },
    {
      feature: "Suporte dedicado",
      viralyx: true,
      others: false
    },
    {
      feature: "Algoritmo preditivo de viralização",
      viralyx: true,
      others: false
    }
  ];

  return (
    <div className="py-24 px-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 ai-pattern opacity-5"></div>
      <div className="absolute -left-32 top-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -right-32 bottom-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
      
      <motion.div 
        className="max-w-7xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-6 text-white"
          variants={itemVariants}
        >
          Por que <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">VIRALYX.AI</span> é a melhor escolha?
        </motion.h2>
        
        <motion.p 
          className="text-lg text-white/70 text-center max-w-3xl mx-auto mb-16"
          variants={itemVariants}
        >
          Compare nossa solução com outros serviços do mercado e veja por que somos a escolha número 1 dos profissionais.
        </motion.p>
        
        <motion.div 
          className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md"
          variants={itemVariants}
        >
          <div className="grid grid-cols-3 text-center p-6 border-b border-white/10 bg-white/5">
            <div className="text-white font-medium">Recurso</div>
            <div className="text-white font-bold">VIRALYX.AI</div>
            <div className="text-white/70 font-medium">Outras soluções</div>
          </div>
          
          {comparisonItems.map((item, index) => (
            <motion.div 
              key={index}
              className="grid grid-cols-3 p-6 border-b border-white/10 items-center hover:bg-white/[0.02] transition-colors"
              variants={itemVariants}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="text-white/80">{item.feature}</div>
              <div className="flex justify-center">
                <CheckCircle className="h-6 w-6 text-indigo-400" />
              </div>
              <div className="flex justify-center">
                {item.others ? (
                  <CheckCircle className="h-6 w-6 text-white/40" />
                ) : (
                  <XCircle className="h-6 w-6 text-white/40" />
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="mt-16 text-center"
          variants={itemVariants}
        >
          <p className="text-white text-xl font-medium mb-4">
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">VIRALYX.AI</span> é a única solução completa do mercado!
          </p>
          <p className="text-white/70 max-w-3xl mx-auto">
            Enquanto outras ferramentas oferecem recursos básicos de agendamento, apenas a VIRALYX.AI proporciona uma solução completa com inteligência artificial avançada para garantir que seu conteúdo se torne viral e gere resultados reais.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ComparisonSection;

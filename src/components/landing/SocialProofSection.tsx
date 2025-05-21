
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BadgeCheck, Award, DollarSign } from 'lucide-react';

const SocialProofSection = () => {
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

  const features = [
    {
      icon: <BadgeCheck className="h-8 w-8 text-indigo-600" />,
      title: "Conteúdo relevante",
      description: "Encontre conteúdos que fazem sentido para seu nicho de mercado"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-indigo-600" />,
      title: "Análise inteligente",
      description: "Identificamos padrões de engajamento para otimizar suas publicações"
    },
    {
      icon: <Award className="h-8 w-8 text-indigo-600" />,
      title: "Qualidade premium",
      description: "Ferramentas desenvolvidas por especialistas em marketing digital"
    },
    {
      icon: <DollarSign className="h-8 w-8 text-indigo-600" />,
      title: "Economia de tempo",
      description: "Automatize a busca por conteúdo de qualidade para suas redes"
    }
  ];

  return (
    <div className="py-12 px-4 relative overflow-hidden bg-gradient-to-b from-[#F5F7FF] to-[#EBEEFF]">
      {/* Background elements */}
      <div className="absolute inset-0 ai-pattern opacity-5"></div>
      <div className="absolute -left-32 top-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
      <div className="absolute -right-32 bottom-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl"></div>
      
      <motion.div 
        className="max-w-7xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-6 text-slate-800"
          variants={itemVariants}
        >
          Principais <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">diferenciais</span>
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="flex flex-col items-center text-center group p-5 rounded-xl bg-white shadow-sm border border-gray-100 hover:border-indigo-100 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(79, 70, 229, 0.1)" }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="mb-3 p-3 bg-indigo-50 rounded-full relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-xl opacity-70"></div>
                {feature.icon}
              </div>
              <div className="text-xl font-bold text-slate-800 mb-1 group-hover:bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                {feature.title}
              </div>
              <div className="text-slate-600 font-medium text-sm">{feature.description}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SocialProofSection;

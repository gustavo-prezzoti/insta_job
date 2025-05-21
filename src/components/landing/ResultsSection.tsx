
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Star, BarChart3, Users } from 'lucide-react';

const ResultsSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const results = [
    {
      icon: <TrendingUp className="h-6 w-6 text-indigo-400" />,
      title: "Aumento de alcance",
      description: "Nossas estratégias podem ajudar a melhorar o alcance de suas publicações."
    },
    {
      icon: <Users className="h-6 w-6 text-indigo-400" />,
      title: "Atração de seguidores",
      description: "Conteúdo otimizado para aumentar suas chances de conquistar novos seguidores."
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-indigo-400" />,
      title: "Melhores interações",
      description: "Identificamos os melhores horários para publicação, melhorando suas taxas de engajamento."
    },
    {
      icon: <Award className="h-6 w-6 text-indigo-400" />,
      title: "Visibilidade da marca",
      description: "Aumente a chance de reconhecimento de sua marca com conteúdo relevante."
    }
  ];

  return (
    <div className="py-20 px-4 relative overflow-hidden bg-black border-t border-slate-800">
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
          className="text-3xl md:text-4xl font-bold text-center mb-6 text-white"
          variants={itemVariants}
        >
          Potencialize seu <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Conteúdo</span>
        </motion.h2>
        
        <motion.p 
          className="text-lg text-slate-300 text-center max-w-3xl mx-auto mb-12"
          variants={itemVariants}
        >
          Descubra como nossa ferramenta pode ajudar a melhorar o desempenho dos seus conteúdos nas redes sociais.
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
        >
          {results.map((result, index) => (
            <motion.div 
              key={index}
              className="bg-slate-800 shadow-md rounded-xl p-6 border border-slate-700 hover:border-indigo-800 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(79, 70, 229, 0.1)" }}
            >
              <div className="mb-4 p-3 bg-indigo-900/30 w-fit rounded-full">
                {result.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{result.title}</h3>
              <p className="text-slate-300">{result.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ResultsSection;

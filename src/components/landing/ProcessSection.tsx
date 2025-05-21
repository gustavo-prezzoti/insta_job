
import React from 'react';
import { motion } from 'framer-motion';
import { Search, MousePointer, Share2 } from 'lucide-react';

const ProcessSection = () => {
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
    <div className="py-12 px-4 relative overflow-hidden bg-slate-900">
      <motion.div 
        className="max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center text-white mb-3"
          variants={itemVariants}
        >
          Como o <span className="text-purple-400">Robô Viral</span> funciona
        </motion.h2>
        
        <motion.p 
          className="text-lg text-slate-300 text-center mb-10 max-w-3xl mx-auto"
          variants={itemVariants}
        >
          Nossa tecnologia simplifica a busca e compartilhamento de conteúdo viral em apenas três etapas
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          <motion.div 
            className="bg-slate-800 p-6 rounded-2xl border border-slate-700 relative overflow-hidden group shadow-sm"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="bg-indigo-900 w-12 h-12 flex items-center justify-center rounded-full mb-4">
              <Search className="w-6 h-6 text-indigo-400" />
            </div>
            <div className="absolute top-6 right-6 text-2xl font-bold text-indigo-900">01</div>
            <h3 className="text-xl font-bold text-white mb-2">Busque vídeos virais</h3>
            <p className="text-slate-300 text-sm">
              Pesquise por palavras-chave e encontre os vídeos mais virais do TikTok em sua categoria.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-slate-800 p-6 rounded-2xl border border-slate-700 relative overflow-hidden group shadow-sm"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="bg-purple-900 w-12 h-12 flex items-center justify-center rounded-full mb-4">
              <MousePointer className="w-6 h-6 text-purple-400" />
            </div>
            <div className="absolute top-6 right-6 text-2xl font-bold text-purple-900">02</div>
            <h3 className="text-xl font-bold text-white mb-2">Selecione os melhores</h3>
            <p className="text-slate-300 text-sm">
              Escolha os vídeos que melhor se encaixam em sua estratégia com base em visualizações, curtidas e compartilhamentos.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-slate-800 p-6 rounded-2xl border border-slate-700 relative overflow-hidden group shadow-sm"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="bg-indigo-900 w-12 h-12 flex items-center justify-center rounded-full mb-4">
              <Share2 className="w-6 h-6 text-indigo-400" />
            </div>
            <div className="absolute top-6 right-6 text-2xl font-bold text-indigo-900">03</div>
            <h3 className="text-xl font-bold text-white mb-2">Poste automaticamente</h3>
            <p className="text-slate-300 text-sm">
              Configure legenda, hashtags e agende suas postagens para o Feed, Reels ou Stories do Instagram.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProcessSection;

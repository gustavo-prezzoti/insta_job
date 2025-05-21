
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BarChart3, Rocket } from 'lucide-react';

const IntroSection = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden bg-black border-b border-slate-800">
      <div className="container mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Transforme seu <span className="text-purple-400">Instagram</span> com vídeos 
            <span className="text-indigo-400"> virais</span>
          </h2>
          <p className="text-slate-300 max-w-3xl mx-auto text-lg">
            O VIRALYX.AI utiliza inteligência artificial para encontrar, adaptar e postar automaticamente
            os vídeos mais virais para o seu perfil, aumentando seu alcance e engajamento.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -5 }}
          >
            <div className="bg-indigo-900 w-12 h-12 flex items-center justify-center rounded-full mb-4">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Conteúdo Viral</h3>
            <p className="text-slate-300 text-sm">
              Nossa IA identifica os vídeos com maior potencial viral em cada nicho, garantindo engajamento máximo.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -5 }}
          >
            <div className="bg-purple-900 w-12 h-12 flex items-center justify-center rounded-full mb-4">
              <BarChart3 className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Métricas Reais</h3>
            <p className="text-slate-300 text-sm">
              Escolha vídeos baseados em dados concretos como visualizações, compartilhamentos e comentários.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ y: -5 }}
          >
            <div className="bg-indigo-900 w-12 h-12 flex items-center justify-center rounded-full mb-4">
              <Rocket className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Automação Total</h3>
            <p className="text-slate-300 text-sm">
              Configure uma vez e deixe o sistema trabalhar por você, postando nos melhores horários para seu público.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;

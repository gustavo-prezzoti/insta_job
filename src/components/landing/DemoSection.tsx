
import React from 'react';
import { motion } from 'framer-motion';
import { Play, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DemoSection = () => {
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
        variants={{
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: { 
              staggerChildren: 0.1
            }
          }
        }}
      >
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-8 text-white"
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
          }}
        >
          Veja a <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">VIRALYX.AI</span> em ação
        </motion.h2>
        
        <motion.p 
          className="text-lg text-white/70 text-center max-w-3xl mx-auto mb-16"
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
          }}
        >
          Assista ao vídeo demonstrativo e descubra como nossa tecnologia revolucionária pode transformar sua presença nas redes sociais e multiplicar seus resultados.
        </motion.p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-xl"
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20"></div>
            <img 
              src="/lovable-uploads/149f4f76-7773-4258-a497-5aba7e415f97.png" 
              alt="VIRALYX.AI Demo" 
              className="w-full h-full object-cover opacity-80" 
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer border border-white/20 group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Play size={36} className="text-white ml-1" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            className="space-y-8"
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
            }}
          >
            <h3 className="text-2xl font-bold text-white">Como funciona a nossa tecnologia</h3>
            
            <ul className="space-y-4">
              {[
                "Busca automática de conteúdos virais em todas as plataformas",
                "Inteligência artificial que identifica padrões de alta conversão",
                "Geração de conteúdo otimizado para seu público-alvo",
                "Agendamento inteligente para os melhores horários de publicação",
                "Análise de performance em tempo real com relatórios detalhados"
              ].map((item, index) => (
                <motion.li 
                  key={index}
                  className="flex items-start gap-3 text-white/80"
                  variants={{
                    hidden: { x: 20, opacity: 0 },
                    visible: { x: 0, opacity: 1, transition: { duration: 0.3, delay: index * 0.1 } }
                  }}
                >
                  <div className="mt-1 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full p-1 flex-shrink-0">
                    <Check size={16} className="text-white" />
                  </div>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
            
            <Button 
              size="lg" 
              className="relative bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 text-white font-bold py-6 px-8 rounded-full transition-all shadow-lg shadow-indigo-500/20 text-lg flex items-center gap-2 overflow-hidden group w-full md:w-auto justify-center mt-6"
            >
              <span className="relative z-10">COMEÇAR AGORA</span>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default DemoSection;
